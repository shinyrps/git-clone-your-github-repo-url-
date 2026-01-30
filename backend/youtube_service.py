from googleapiclient.discovery import build
from typing import List, Optional
import os
import logging
from models import YouTubeVideo

logger = logging.getLogger(__name__)

# YouTube API keys (rotating keys for rate limiting)
YOUTUBE_API_KEYS = [
    "AIzaSyB_5S7LMRMbOJTr-0Gi4bfLTGDQzVeQ7ds",  # Primary key
    "AIzaSyDT1234567890abcdefghijklmnopqrst",  # Backup key 1
    "AIzaSyEX0987654321zyxwvutsrqponmlkjih"   # Backup key 2
]

current_key_index = 0

def get_youtube_client():
    """Get YouTube API client with rotating keys"""
    global current_key_index
    api_key = YOUTUBE_API_KEYS[current_key_index % len(YOUTUBE_API_KEYS)]
    return build('youtube', 'v3', developerKey=api_key)

def rotate_api_key():
    """Rotate to next API key"""
    global current_key_index
    current_key_index += 1
    logger.info(f"Rotated to API key index {current_key_index % len(YOUTUBE_API_KEYS)}")

async def search_youtube_music(query: str, max_results: int = 10) -> List[YouTubeVideo]:
    """Search YouTube for music videos"""
    try:
        youtube = get_youtube_client()
        
        request = youtube.search().list(
            part='snippet',
            q=f"{query} official music video",
            type='video',
            videoCategoryId='10',  # Music category
            maxResults=max_results,
            order='relevance'
        )
        
        response = request.execute()
        
        videos = []
        video_ids = [item['id']['videoId'] for item in response.get('items', [])]
        
        if video_ids:
            # Get video details including duration
            video_details = youtube.videos().list(
                part='snippet,contentDetails,statistics',
                id=','.join(video_ids)
            ).execute()
            
            for item in video_details.get('items', []):
                videos.append(YouTubeVideo(
                    video_id=item['id'],
                    title=item['snippet']['title'],
                    channel_title=item['snippet']['channelTitle'],
                    thumbnail_url=item['snippet']['thumbnails']['high']['url'],
                    duration=item['contentDetails']['duration'],
                    view_count=int(item['statistics'].get('viewCount', 0)),
                    published_at=item['snippet']['publishedAt']
                ))
        
        return videos
    
    except Exception as e:
        logger.error(f"YouTube API error: {str(e)}")
        rotate_api_key()
        raise

async def get_youtube_video_details(video_id: str) -> Optional[YouTubeVideo]:
    """Get details for a specific YouTube video"""
    try:
        youtube = get_youtube_client()
        
        request = youtube.videos().list(
            part='snippet,contentDetails,statistics',
            id=video_id
        )
        
        response = request.execute()
        items = response.get('items', [])
        
        if not items:
            return None
        
        item = items[0]
        return YouTubeVideo(
            video_id=item['id'],
            title=item['snippet']['title'],
            channel_title=item['snippet']['channelTitle'],
            thumbnail_url=item['snippet']['thumbnails']['high']['url'],
            duration=item['contentDetails']['duration'],
            view_count=int(item['statistics'].get('viewCount', 0)),
            published_at=item['snippet']['publishedAt']
        )
    
    except Exception as e:
        logger.error(f"YouTube API error: {str(e)}")
        return None

async def get_related_videos(video_id: str, max_results: int = 5) -> List[YouTubeVideo]:
    """Get related videos for recommendations"""
    try:
        youtube = get_youtube_client()
        
        request = youtube.search().list(
            part='snippet',
            relatedToVideoId=video_id,
            type='video',
            maxResults=max_results
        )
        
        response = request.execute()
        
        videos = []
        for item in response.get('items', []):
            videos.append(YouTubeVideo(
                video_id=item['id']['videoId'],
                title=item['snippet']['title'],
                channel_title=item['snippet']['channelTitle'],
                thumbnail_url=item['snippet']['thumbnails']['high']['url'],
                duration="",  # Not available in search results
                published_at=item['snippet']['publishedAt']
            ))
        
        return videos
    
    except Exception as e:
        logger.error(f"YouTube API error: {str(e)}")
        return []