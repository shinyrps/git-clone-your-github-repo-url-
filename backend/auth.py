from fastapi import HTTPException, Request, Response
from datetime import datetime, timezone, timedelta
import httpx
import uuid
import os
from motor.motor_asyncio import AsyncIOMotorClient

mongo_url = os.environ.get('MONGO_URL')
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'shinyfy_db')]

# REMINDER: DO NOT HARDCODE THE URL, OR ADD ANY FALLBACKS OR REDIRECT URLS, THIS BREAKS THE AUTH

async def get_session_data(session_id: str):
    """Get user data from Emergent Auth using session_id"""
    async with httpx.AsyncClient() as client:
        response = await client.get(
            "https://demobackend.emergentagent.com/auth/v1/env/oauth/session-data",
            headers={"X-Session-ID": session_id}
        )
        if response.status_code != 200:
            raise HTTPException(status_code=401, detail="Invalid session ID")
        return response.json()

async def create_or_update_user(user_data: dict):
    """Create new user or update existing user"""
    email = user_data["email"]
    
    # Check if user exists
    existing_user = await db.users.find_one({"email": email}, {"_id": 0})
    
    if existing_user:
        # Update user data
        await db.users.update_one(
            {"email": email},
            {"$set": {
                "name": user_data["name"],
                "picture": user_data.get("picture", ""),
                "google_id": user_data.get("id", "")
            }}
        )
        return existing_user["user_id"]
    else:
        # Create new user
        user_id = f"user_{uuid.uuid4().hex[:12]}"
        await db.users.insert_one({
            "user_id": user_id,
            "email": email,
            "name": user_data["name"],
            "picture": user_data.get("picture", ""),
            "google_id": user_data.get("id", ""),
            "created_at": datetime.now(timezone.utc),
            "liked_songs": [],
            "playlists": [],
            "recently_played": [],
            "preferences": {"region": "global", "favorite_genres": []}
        })
        return user_id

async def create_session(user_id: str, session_token: str):
    """Create a new session in database"""
    expires_at = datetime.now(timezone.utc) + timedelta(days=7)
    
    await db.user_sessions.insert_one({
        "user_id": user_id,
        "session_token": session_token,
        "expires_at": expires_at,
        "created_at": datetime.now(timezone.utc)
    })

async def get_user_from_session(request: Request) -> dict:
    """Get user from session token (cookie or header)"""
    # Try cookie first
    session_token = request.cookies.get("session_token")
    
    # Fallback to Authorization header
    if not session_token:
        auth_header = request.headers.get("Authorization")
        if auth_header and auth_header.startswith("Bearer "):
            session_token = auth_header.replace("Bearer ", "")
    
    if not session_token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    # Find session in database
    session_doc = await db.user_sessions.find_one({"session_token": session_token})
    if not session_doc:
        raise HTTPException(status_code=401, detail="Invalid session")
    
    # Check expiry
    expires_at = session_doc["expires_at"]
    if isinstance(expires_at, str):
        expires_at = datetime.fromisoformat(expires_at)
    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)
    if expires_at < datetime.now(timezone.utc):
        raise HTTPException(status_code=401, detail="Session expired")
    
    # Get user data
    user = await db.users.find_one({"user_id": session_doc["user_id"]}, {"_id": 0})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return user

async def delete_session(session_token: str):
    """Delete session from database"""
    await db.user_sessions.delete_one({"session_token": session_token})

def set_session_cookie(response: Response, session_token: str):
    """Set session cookie"""
    response.set_cookie(
        key="session_token",
        value=session_token,
        httponly=True,
        secure=True,
        samesite="none",
        path="/",
        max_age=7 * 24 * 60 * 60  # 7 days
    )

def clear_session_cookie(response: Response):
    """Clear session cookie"""
    response.delete_cookie(
        key="session_token",
        path="/",
        secure=True,
        samesite="none"
    )