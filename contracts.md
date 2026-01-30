# Shinyfy Backend Implementation Contracts

## Overview
This document outlines the backend implementation for Shinyfy, a Spotify clone with YouTube integration, free music APIs, Google Social Login, and karaoke features.

## Current Mock Data to Replace
Located in `/app/frontend/src/mock/musicData.js`:
- `mockSongs` - Array of song objects with YouTube IDs
- `mockPlaylists` - Array of playlist objects
- `mockArtists` - Array of artist objects
- `mockRegions` - Array of region objects
- `mockLyrics` - Object with song lyrics for karaoke

## Database Models

### 1. User Model
```python
{
  "_id": ObjectId,
  "email": str,
  "name": str,
  "profile_picture": str,
  "google_id": str,  # From Google OAuth
  "created_at": datetime,
  "liked_songs": [song_id],
  "playlists": [playlist_id],
  "recently_played": [song_id],
  "preferences": {
    "region": str,
    "favorite_genres": [str]
  }
}
```

### 2. Song Model
```python
{
  "_id": ObjectId,
  "title": str,
  "artist": str,
  "album": str,
  "duration": str,
  "duration_seconds": int,
  "cover_url": str,
  "youtube_id": str,  # Primary source
  "genre": str,
  "region": str,
  "plays": int,
  "release_year": int,
  "lyrics": [{"time": int, "text": str}],  # For karaoke
  "source": str  # "youtube", "jamendo", etc.
}
```

### 3. Playlist Model
```python
{
  "_id": ObjectId,
  "name": str,
  "description": str,
  "cover_url": str,
  "songs": [song_id],
  "owner": user_id,
  "followers": int,
  "region": str,
  "is_public": bool,
  "created_at": datetime,
  "updated_at": datetime
}
```

### 4. Artist Model
```python
{
  "_id": ObjectId,
  "name": str,
  "image_url": str,
  "followers": int,
  "verified": bool,
  "top_songs": [song_id],
  "bio": str,
  "genres": [str]
}
```

## API Endpoints

### Authentication (Google Social Login)
- `POST /api/auth/google/login` - Initiate Google OAuth flow
- `GET /api/auth/google/callback` - Handle OAuth callback
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user info

### Songs
- `GET /api/songs` - Get all songs (with pagination, filters)
- `GET /api/songs/:id` - Get song by ID
- `GET /api/songs/search?q=query` - Search songs
- `GET /api/songs/region/:region` - Get songs by region
- `POST /api/songs/:id/play` - Track play count
- `GET /api/songs/:id/lyrics` - Get karaoke lyrics

### Playlists
- `GET /api/playlists` - Get all playlists
- `GET /api/playlists/:id` - Get playlist by ID
- `POST /api/playlists` - Create new playlist (auth required)
- `PUT /api/playlists/:id` - Update playlist (auth required)
- `DELETE /api/playlists/:id` - Delete playlist (auth required)
- `POST /api/playlists/:id/songs` - Add song to playlist
- `DELETE /api/playlists/:id/songs/:songId` - Remove song from playlist

### User Library
- `GET /api/library/liked-songs` - Get user's liked songs
- `POST /api/library/liked-songs/:songId` - Like a song
- `DELETE /api/library/liked-songs/:songId` - Unlike a song
- `GET /api/library/playlists` - Get user's playlists
- `GET /api/library/recently-played` - Get recently played songs

### YouTube Integration
- `GET /api/youtube/search?q=query` - Search YouTube for music
- `GET /api/youtube/video/:videoId` - Get video details
- `GET /api/youtube/related/:videoId` - Get related videos

### Artists
- `GET /api/artists` - Get all artists
- `GET /api/artists/:id` - Get artist by ID
- `GET /api/artists/:id/top-songs` - Get artist's top songs

## External API Integrations

### 1. YouTube Data API v3
**Purpose**: Primary music source for playback
**Setup**: Google Cloud Project with API key
**Usage**:
- Search for music videos
- Get video metadata (title, thumbnail, duration)
- Fetch related videos for recommendations
**Rate Limits**: 10,000 units/day (default)

### 2. Emergent Google OAuth
**Purpose**: User authentication via Google Social Login
**Setup**: Use integration_playbook_expert_v2 for setup
**Features**:
- Secure authentication
- User profile data (name, email, picture)

### 3. Free Music APIs (Optional Enhancement)
**Jamendo API**: CC-licensed music
**Free Music Archive**: Public domain tracks

## Frontend Integration Plan

### Files to Update

#### 1. PlayerContext.js
- Add API calls for tracking plays
- Integrate real YouTube player API
- Update karaoke lyrics fetching

#### 2. Home.js
```javascript
// Replace mock data with API calls
useEffect(() => {
  fetchRecentlyPlayed();
  fetchTopPlaylists();
  fetchRegionalPlaylists(selectedRegion);
}, [selectedRegion]);
```

#### 3. Search.js
```javascript
// Replace mock search with API
const handleSearch = async (query) => {
  const results = await axios.get(`${API}/songs/search?q=${query}`);
  setFilteredSongs(results.data.songs);
  setFilteredPlaylists(results.data.playlists);
  setFilteredArtists(results.data.artists);
};
```

#### 4. Library.js
```javascript
// Fetch user's library data
useEffect(() => {
  if (user) {
    fetchLikedSongs();
    fetchMyPlaylists();
    fetchRecentlyPlayed();
  }
}, [user]);
```

#### 5. TrackList.js
- Add like/unlike functionality
- Track play counts on song click

#### 6. MusicPlayer.js
- Integrate YouTube iframe Player API
- Sync with backend for play tracking
- Implement video/audio toggle
- Load real lyrics for karaoke mode

### New Components to Create

#### 1. Auth Components
- `LoginModal.js` - Google login button
- `AuthProvider.js` - Auth context wrapper

#### 2. YouTube Player Component
- `YouTubePlayer.js` - Embedded YouTube player with controls
- `KaraokeDisplay.js` - Lyrics overlay for karaoke mode

## Implementation Steps

### Phase 1: Backend Setup
1. Create MongoDB models
2. Set up authentication endpoints
3. Seed initial song data from YouTube

### Phase 2: YouTube Integration
1. Set up YouTube Data API
2. Create search functionality
3. Implement video playback

### Phase 3: Core Features
1. Playlist CRUD operations
2. User library management
3. Play tracking

### Phase 4: Frontend Integration
1. Replace all mock data with API calls
2. Implement YouTube player
3. Add authentication flow
4. Implement karaoke mode

### Phase 5: Testing & Polish
1. Test all API endpoints
2. Test frontend features
3. Optimize performance
4. Add error handling

## Key Features Implementation

### Karaoke Mode
- Fetch lyrics from backend
- Sync lyrics with YouTube player time
- Display lyrics overlay on video/audio
- Toggle karaoke mode on/off

### Region-wise Playlists
- Filter songs by region
- Show region selector on home page
- Create curated regional playlists

### Volume Controls
- YouTube player volume API
- Persist volume preference
- Mute/unmute functionality

### Video/Audio Toggle
- Show/hide YouTube player iframe
- Audio-only mode with cover art
- Video mode with full player

## Error Handling
- API rate limit handling
- Network error recovery
- Invalid YouTube ID handling
- Authentication errors
- Database connection errors

## Security Considerations
- Secure Google OAuth implementation
- JWT token management
- API key protection (environment variables)
- User data privacy
- CORS configuration
