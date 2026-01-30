from pydantic import BaseModel, Field
from typing import List, Optional, Dict
from datetime import datetime

# User Models
class User(BaseModel):
    user_id: str
    email: str
    name: str
    picture: Optional[str] = None
    created_at: datetime
    liked_songs: List[str] = []
    playlists: List[str] = []
    recently_played: List[str] = []
    preferences: Dict = {"region": "global", "favorite_genres": []}

class UserSession(BaseModel):
    user_id: str
    session_token: str
    expires_at: datetime
    created_at: datetime

# Song Models
class Song(BaseModel):
    song_id: str
    title: str
    artist: str
    album: str
    duration: str
    duration_seconds: int
    cover_url: str
    youtube_id: str
    genre: str
    region: str
    plays: int = 0
    release_year: int
    lyrics: List[Dict] = []  # [{"time": int, "text": str}]
    source: str = "youtube"

class SongCreate(BaseModel):
    title: str
    artist: str
    album: str
    youtube_id: str
    genre: str
    region: str
    release_year: int

# Playlist Models
class Playlist(BaseModel):
    playlist_id: str
    name: str
    description: str
    cover_url: str
    songs: List[str] = []
    owner: str
    followers: int = 0
    region: str = "global"
    is_public: bool = True
    created_at: datetime
    updated_at: datetime

class PlaylistCreate(BaseModel):
    name: str
    description: str
    cover_url: str = "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=300&fit=crop"
    is_public: bool = True

class PlaylistUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    cover_url: Optional[str] = None
    is_public: Optional[bool] = None

# Artist Models
class Artist(BaseModel):
    artist_id: str
    name: str
    image_url: str
    followers: int = 0
    verified: bool = False
    top_songs: List[str] = []
    bio: str = ""
    genres: List[str] = []

# YouTube Models
class YouTubeVideo(BaseModel):
    video_id: str
    title: str
    channel_title: str
    thumbnail_url: str
    duration: str
    view_count: int = 0
    published_at: str

class YouTubeSearchResult(BaseModel):
    videos: List[YouTubeVideo]
    next_page_token: Optional[str] = None