from fastapi import FastAPI, APIRouter, HTTPException, Request, Response, Query
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from typing import List, Optional
import uuid
from datetime import datetime, timezone

# Import models and services
from models import (
    User, Song, Playlist, PlaylistCreate, PlaylistUpdate,
    Artist, YouTubeVideo, YouTubeSearchResult
)
from auth import (
    get_session_data, create_or_update_user, create_session,
    get_user_from_session, delete_session, set_session_cookie, clear_session_cookie
)
from youtube_service import (
    search_youtube_music, get_youtube_video_details, get_related_videos
)

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'shinyfy_db')]

# Create the main app without a prefix
app = FastAPI(title="Shinyfy API")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


# ==================== AUTH ENDPOINTS ====================

@api_router.post("/auth/session")
async def create_user_session(request: Request, response: Response):
    \"\"\"Exchange session_id for session_token and create user\"\"\"
    try:
        body = await request.json()
        session_id = body.get("session_id")
        
        if not session_id:
            raise HTTPException(status_code=400, detail="session_id is required")
        
        # Get user data from Emergent Auth
        user_data = await get_session_data(session_id)
        session_token = user_data["session_token"]
        
        # Create or update user
        user_id = await create_or_update_user(user_data)
        
        # Create session in database
        await create_session(user_id, session_token)
        
        # Set session cookie
        set_session_cookie(response, session_token)
        
        # Return user data
        user = await db.users.find_one({"user_id": user_id}, {"_id": 0})
        return {"user": user, "session_token": session_token}
    
    except Exception as e:
        logger.error(f"Session creation error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@api_router.get("/auth/me")
async def get_current_user(request: Request):
    \"\"\"Get current authenticated user\"\"\"
    user = await get_user_from_session(request)
    return user


@api_router.post("/auth/logout")
async def logout(request: Request, response: Response):
    \"\"\"Logout user and clear session\"\"\"
    try:
        session_token = request.cookies.get("session_token")
        if session_token:
            await delete_session(session_token)
        clear_session_cookie(response)
        return {"message": "Logged out successfully"}
    except Exception as e:
        logger.error(f"Logout error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


# ==================== SONG ENDPOINTS ====================

@api_router.get("/songs", response_model=List[Song])
async def get_songs(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    region: Optional[str] = None,
    genre: Optional[str] = None
):
    \"\"\"Get all songs with filters\"\"\"
    query = {}
    if region and region != "global":
        query["region"] = region
    if genre:
        query["genre"] = genre
    
    songs = await db.songs.find(query, {"_id": 0}).skip(skip).limit(limit).to_list(limit)
    return songs


@api_router.get("/songs/search")
async def search_songs(q: str = Query(..., min_length=1)):
    \"\"\"Search songs, artists, and playlists\"\"\"
    query_regex = {"$regex": q, "$options": "i"}
    
    # Search songs
    songs = await db.songs.find({
        "$or": [
            {"title": query_regex},
            {"artist": query_regex},
            {"album": query_regex}
        ]
    }, {"_id": 0}).limit(10).to_list(10)
    
    # Search playlists
    playlists = await db.playlists.find({
        "$or": [
            {"name": query_regex},
            {"description": query_regex}
        ]
    }, {"_id": 0}).limit(5).to_list(5)
    
    # Search artists
    artists = await db.artists.find({
        "name": query_regex
    }, {"_id": 0}).limit(5).to_list(5)
    
    return {
        "songs": songs,
        "playlists": playlists,
        "artists": artists
    }


@api_router.get("/songs/{song_id}")
async def get_song(song_id: str):
    \"\"\"Get song by ID\"\"\"
    song = await db.songs.find_one({"song_id": song_id}, {"_id": 0})
    if not song:
        raise HTTPException(status_code=404, detail="Song not found")
    return song


@api_router.post("/songs/{song_id}/play")
async def track_play(song_id: str, request: Request):
    \"\"\"Track song play\"\"\"
    # Increment play count
    await db.songs.update_one(
        {"song_id": song_id},
        {"$inc": {"plays": 1}}
    )
    
    # Add to user's recently played (if authenticated)
    try:
        user = await get_user_from_session(request)
        recently_played = user.get("recently_played", [])
        
        # Remove if already exists, then add to front
        if song_id in recently_played:
            recently_played.remove(song_id)
        recently_played.insert(0, song_id)
        
        # Keep only last 20
        recently_played = recently_played[:20]
        
        await db.users.update_one(
            {"user_id": user["user_id"]},
            {"$set": {"recently_played": recently_played}}
        )
    except:
        pass  # Anonymous play tracking
    
    return {"message": "Play tracked"}


@api_router.get("/songs/{song_id}/lyrics")
async def get_lyrics(song_id: str):
    \"\"\"Get karaoke lyrics for a song\"\"\"
    song = await db.songs.find_one({"song_id": song_id}, {"_id": 0, "lyrics": 1})
    if not song:
        raise HTTPException(status_code=404, detail="Song not found")
    return {"lyrics": song.get("lyrics", [])}


# ==================== PLAYLIST ENDPOINTS ====================

@api_router.get("/playlists", response_model=List[Playlist])
async def get_playlists(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100)
):
    \"\"\"Get all public playlists\"\"\"
    playlists = await db.playlists.find(
        {"is_public": True},
        {"_id": 0}
    ).skip(skip).limit(limit).to_list(limit)
    return playlists


@api_router.get("/playlists/{playlist_id}")
async def get_playlist(playlist_id: str):
    \"\"\"Get playlist by ID\"\"\"
    playlist = await db.playlists.find_one({"playlist_id": playlist_id}, {"_id": 0})
    if not playlist:
        raise HTTPException(status_code=404, detail="Playlist not found")
    
    # Get songs in playlist
    song_ids = playlist.get("songs", [])
    songs = await db.songs.find(
        {"song_id": {"$in": song_ids}},
        {"_id": 0}
    ).to_list(len(song_ids))
    
    return {**playlist, "song_details": songs}


@api_router.post("/playlists", response_model=Playlist)
async def create_playlist(playlist: PlaylistCreate, request: Request):
    \"\"\"Create new playlist\"\"\"
    user = await get_user_from_session(request)
    
    playlist_id = f"playlist_{uuid.uuid4().hex[:12]}"
    now = datetime.now(timezone.utc)
    
    new_playlist = {
        "playlist_id": playlist_id,
        "name": playlist.name,
        "description": playlist.description,
        "cover_url": playlist.cover_url,
        "songs": [],
        "owner": user["user_id"],
        "followers": 0,
        "region": "global",
        "is_public": playlist.is_public,
        "created_at": now,
        "updated_at": now
    }
    
    await db.playlists.insert_one(new_playlist)
    
    # Add to user's playlists
    await db.users.update_one(
        {"user_id": user["user_id"]},
        {"$push": {"playlists": playlist_id}}
    )
    
    new_playlist.pop("_id", None)
    return new_playlist


@api_router.put("/playlists/{playlist_id}")
async def update_playlist(playlist_id: str, update: PlaylistUpdate, request: Request):
    \"\"\"Update playlist\"\"\"
    user = await get_user_from_session(request)
    
    # Check ownership
    playlist = await db.playlists.find_one({"playlist_id": playlist_id})
    if not playlist:
        raise HTTPException(status_code=404, detail="Playlist not found")
    if playlist["owner"] != user["user_id"]:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    # Build update dict
    update_dict = {k: v for k, v in update.dict().items() if v is not None}
    update_dict["updated_at"] = datetime.now(timezone.utc)
    
    await db.playlists.update_one(
        {"playlist_id": playlist_id},
        {"$set": update_dict}
    )
    
    return {"message": "Playlist updated"}


@api_router.delete("/playlists/{playlist_id}")
async def delete_playlist(playlist_id: str, request: Request):
    \"\"\"Delete playlist\"\"\"
    user = await get_user_from_session(request)
    
    # Check ownership
    playlist = await db.playlists.find_one({"playlist_id": playlist_id})
    if not playlist:
        raise HTTPException(status_code=404, detail="Playlist not found")
    if playlist["owner"] != user["user_id"]:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    await db.playlists.delete_one({"playlist_id": playlist_id})
    
    # Remove from user's playlists
    await db.users.update_one(
        {"user_id": user["user_id"]},
        {"$pull": {"playlists": playlist_id}}
    )
    
    return {"message": "Playlist deleted"}


@api_router.post("/playlists/{playlist_id}/songs")
async def add_song_to_playlist(playlist_id: str, song_id: str, request: Request):
    \"\"\"Add song to playlist\"\"\"
    user = await get_user_from_session(request)
    
    # Check ownership
    playlist = await db.playlists.find_one({"playlist_id": playlist_id})
    if not playlist:
        raise HTTPException(status_code=404, detail="Playlist not found")
    if playlist["owner"] != user["user_id"]:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    # Check if song exists
    song = await db.songs.find_one({"song_id": song_id})
    if not song:
        raise HTTPException(status_code=404, detail="Song not found")
    
    # Add song
    await db.playlists.update_one(
        {"playlist_id": playlist_id},
        {"$addToSet": {"songs": song_id}}
    )
    
    return {"message": "Song added to playlist"}


@api_router.delete("/playlists/{playlist_id}/songs/{song_id}")
async def remove_song_from_playlist(playlist_id: str, song_id: str, request: Request):
    \"\"\"Remove song from playlist\"\"\"
    user = await get_user_from_session(request)
    
    # Check ownership
    playlist = await db.playlists.find_one({"playlist_id": playlist_id})
    if not playlist:
        raise HTTPException(status_code=404, detail="Playlist not found")
    if playlist["owner"] != user["user_id"]:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    # Remove song
    await db.playlists.update_one(
        {"playlist_id": playlist_id},
        {"$pull": {"songs": song_id}}
    )
    
    return {"message": "Song removed from playlist"}


# ==================== USER LIBRARY ENDPOINTS ====================

@api_router.get("/library/liked-songs")
async def get_liked_songs(request: Request):
    \"\"\"Get user's liked songs\"\"\"
    user = await get_user_from_session(request)
    song_ids = user.get("liked_songs", [])
    
    songs = await db.songs.find(
        {"song_id": {"$in": song_ids}},
        {"_id": 0}
    ).to_list(len(song_ids))
    
    return songs


@api_router.post("/library/liked-songs/{song_id}")
async def like_song(song_id: str, request: Request):
    \"\"\"Like a song\"\"\"
    user = await get_user_from_session(request)
    
    await db.users.update_one(
        {"user_id": user["user_id"]},
        {"$addToSet": {"liked_songs": song_id}}
    )
    
    return {"message": "Song liked"}


@api_router.delete("/library/liked-songs/{song_id}")
async def unlike_song(song_id: str, request: Request):
    \"\"\"Unlike a song\"\"\"
    user = await get_user_from_session(request)
    
    await db.users.update_one(
        {"user_id": user["user_id"]},
        {"$pull": {"liked_songs": song_id}}
    )
    
    return {"message": "Song unliked"}


@api_router.get("/library/playlists")
async def get_user_playlists(request: Request):
    \"\"\"Get user's playlists\"\"\"
    user = await get_user_from_session(request)
    playlist_ids = user.get("playlists", [])
    
    playlists = await db.playlists.find(
        {"playlist_id": {"$in": playlist_ids}},
        {"_id": 0}
    ).to_list(len(playlist_ids))
    
    return playlists


@api_router.get("/library/recently-played")
async def get_recently_played(request: Request):
    \"\"\"Get recently played songs\"\"\"
    user = await get_user_from_session(request)
    song_ids = user.get("recently_played", [])
    
    songs = await db.songs.find(
        {"song_id": {"$in": song_ids}},
        {"_id": 0}
    ).to_list(len(song_ids))
    
    # Sort by recently played order
    songs_dict = {s["song_id"]: s for s in songs}
    ordered_songs = [songs_dict[sid] for sid in song_ids if sid in songs_dict]
    
    return ordered_songs


# ==================== YOUTUBE ENDPOINTS ====================

@api_router.get("/youtube/search")
async def youtube_search(q: str = Query(..., min_length=1), max_results: int = Query(10, ge=1, le=50)):
    \"\"\"Search YouTube for music\"\"\"
    try:
        videos = await search_youtube_music(q, max_results)
        return {"videos": videos}
    except Exception as e:
        logger.error(f"YouTube search error: {str(e)}")
        raise HTTPException(status_code=500, detail="YouTube search failed")


@api_router.get("/youtube/video/{video_id}")
async def get_video(video_id: str):
    \"\"\"Get YouTube video details\"\"\"
    video = await get_youtube_video_details(video_id)
    if not video:
        raise HTTPException(status_code=404, detail="Video not found")
    return video


@api_router.get("/youtube/related/{video_id}")
async def get_related(video_id: str, max_results: int = Query(5, ge=1, le=20)):
    \"\"\"Get related videos\"\"\"
    videos = await get_related_videos(video_id, max_results)
    return {"videos": videos}


# ==================== ARTIST ENDPOINTS ====================

@api_router.get("/artists")
async def get_artists(skip: int = Query(0, ge=0), limit: int = Query(20, ge=1, le=100)):
    \"\"\"Get all artists\"\"\"
    artists = await db.artists.find({}, {"_id": 0}).skip(skip).limit(limit).to_list(limit)
    return artists


@api_router.get("/artists/{artist_id}")
async def get_artist(artist_id: str):
    \"\"\"Get artist by ID\"\"\"
    artist = await db.artists.find_one({"artist_id": artist_id}, {"_id": 0})
    if not artist:
        raise HTTPException(status_code=404, detail="Artist not found")
    return artist


@api_router.get("/artists/{artist_id}/top-songs")
async def get_artist_top_songs(artist_id: str):
    \"\"\"Get artist's top songs\"\"\"
    artist = await db.artists.find_one({"artist_id": artist_id}, {"_id": 0})
    if not artist:
        raise HTTPException(status_code=404, detail="Artist not found")
    
    song_ids = artist.get("top_songs", [])
    songs = await db.songs.find(
        {"song_id": {"$in": song_ids}},
        {"_id": 0}
    ).to_list(len(song_ids))
    
    return songs


# Include the router in the main app
app.include_router(api_router)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
