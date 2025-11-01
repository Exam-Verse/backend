import os
from typing import List, Dict, Optional
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from dotenv import load_dotenv

load_dotenv()

YOUTUBE_API_KEY = os.getenv("YOUTUBE_API_KEY", "")


def is_youtube_configured() -> bool:
    """Check if YouTube API is configured"""
    return bool(YOUTUBE_API_KEY)


async def search_youtube_videos(
    query: str,
    max_results: int = 5,
    order: str = "relevance",
    video_duration: str = "any"
) -> dict:
    """
    Search for YouTube videos based on query
    
    Args:
        query: Search query
        max_results: Maximum number of results (1-50)
        order: Sort order (relevance, viewCount, rating, date)
        video_duration: Video duration filter (any, short, medium, long)
    
    Returns:
        dict with success status and list of videos
    """
    if not YOUTUBE_API_KEY:
        return {
            "success": False,
            "error": "YouTube API key not configured",
            "videos": []
        }
    
    try:
        # Build YouTube API client
        youtube = build('youtube', 'v3', developerKey=YOUTUBE_API_KEY)
        
        # Search for videos
        search_response = youtube.search().list(
            q=query,
            part='id,snippet',
            maxResults=max_results,
            type='video',
            order=order,
            videoDuration=video_duration,
            relevanceLanguage='en',
            safeSearch='strict'
        ).execute()
        
        videos = []
        
        # Extract video information
        for item in search_response.get('items', []):
            video_id = item['id']['videoId']
            snippet = item['snippet']
            
            video_info = {
                "video_id": video_id,
                "title": snippet['title'],
                "description": snippet['description'],
                "thumbnail": snippet['thumbnails']['high']['url'],
                "channel_title": snippet['channelTitle'],
                "published_at": snippet['publishedAt'],
                "url": f"https://www.youtube.com/watch?v={video_id}",
                "embed_url": f"https://www.youtube.com/embed/{video_id}"
            }
            
            videos.append(video_info)
        
        # Get video statistics (views, likes, etc.)
        if videos:
            video_ids = ','.join([v['video_id'] for v in videos])
            stats_response = youtube.videos().list(
                part='statistics,contentDetails',
                id=video_ids
            ).execute()
            
            # Add statistics to video info
            for i, stats_item in enumerate(stats_response.get('items', [])):
                if i < len(videos):
                    stats = stats_item.get('statistics', {})
                    content = stats_item.get('contentDetails', {})
                    
                    videos[i].update({
                        "view_count": int(stats.get('viewCount', 0)),
                        "like_count": int(stats.get('likeCount', 0)),
                        "comment_count": int(stats.get('commentCount', 0)),
                        "duration": content.get('duration', 'PT0S')
                    })
        
        return {
            "success": True,
            "videos": videos,
            "total_results": len(videos),
            "query": query
        }
    
    except HttpError as e:
        return {
            "success": False,
            "error": f"YouTube API error: {str(e)}",
            "videos": []
        }
    except Exception as e:
        return {
            "success": False,
            "error": f"Search failed: {str(e)}",
            "videos": []
        }


async def search_videos_for_question(
    question_text: str,
    subject: Optional[str] = None,
    max_results: int = 5
) -> dict:
    """
    Search for educational videos related to a specific question
    
    Args:
        question_text: The question text
        subject: Subject area (optional)
        max_results: Maximum number of results
    
    Returns:
        dict with relevant educational videos
    """
    if not YOUTUBE_API_KEY:
        return {
            "success": False,
            "error": "YouTube API key not configured",
            "videos": []
        }
    
    try:
        # Build search query - extract key concepts from question
        # Take first 100 characters and clean it up
        query_base = question_text[:100].strip()
        
        # Add subject if provided
        if subject:
            query = f"{subject} {query_base} tutorial explanation"
        else:
            query = f"{query_base} tutorial explanation"
        
        # Add common educational keywords
        query += " education lecture"
        
        # Search with medium-length videos preferred (better for explanations)
        result = await search_youtube_videos(
            query=query,
            max_results=max_results,
            order="relevance",
            video_duration="medium"
        )
        
        return result
    
    except Exception as e:
        return {
            "success": False,
            "error": f"Question video search failed: {str(e)}",
            "videos": []
        }


async def search_videos_by_topic(
    topic: str,
    subject: str,
    max_results: int = 10,
    order: str = "relevance"
) -> dict:
    """
    Search for videos on a specific topic
    
    Args:
        topic: The topic to search for
        subject: Subject area
        max_results: Maximum number of results
        order: Sort order
    
    Returns:
        dict with relevant videos
    """
    query = f"{subject} {topic} tutorial explanation lecture"
    
    return await search_youtube_videos(
        query=query,
        max_results=max_results,
        order=order,
        video_duration="any"
    )


async def get_video_details(video_id: str) -> dict:
    """
    Get detailed information about a specific video
    
    Args:
        video_id: YouTube video ID
    
    Returns:
        dict with detailed video information
    """
    if not YOUTUBE_API_KEY:
        return {
            "success": False,
            "error": "YouTube API key not configured"
        }
    
    try:
        youtube = build('youtube', 'v3', developerKey=YOUTUBE_API_KEY)
        
        response = youtube.videos().list(
            part='snippet,statistics,contentDetails',
            id=video_id
        ).execute()
        
        if not response.get('items'):
            return {
                "success": False,
                "error": "Video not found"
            }
        
        item = response['items'][0]
        snippet = item['snippet']
        stats = item.get('statistics', {})
        content = item.get('contentDetails', {})
        
        video_info = {
            "video_id": video_id,
            "title": snippet['title'],
            "description": snippet['description'],
            "thumbnail": snippet['thumbnails']['high']['url'],
            "channel_title": snippet['channelTitle'],
            "channel_id": snippet['channelId'],
            "published_at": snippet['publishedAt'],
            "tags": snippet.get('tags', []),
            "category_id": snippet.get('categoryId'),
            "view_count": int(stats.get('viewCount', 0)),
            "like_count": int(stats.get('likeCount', 0)),
            "comment_count": int(stats.get('commentCount', 0)),
            "duration": content.get('duration', 'PT0S'),
            "url": f"https://www.youtube.com/watch?v={video_id}",
            "embed_url": f"https://www.youtube.com/embed/{video_id}"
        }
        
        return {
            "success": True,
            "video": video_info
        }
    
    except HttpError as e:
        return {
            "success": False,
            "error": f"YouTube API error: {str(e)}"
        }
    except Exception as e:
        return {
            "success": False,
            "error": f"Failed to get video details: {str(e)}"
        }


def parse_duration(duration: str) -> int:
    """
    Parse ISO 8601 duration format to seconds
    
    Args:
        duration: ISO 8601 duration string (e.g., PT1H2M10S)
    
    Returns:
        Duration in seconds
    """
    import re
    
    pattern = r'PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?'
    match = re.match(pattern, duration)
    
    if not match:
        return 0
    
    hours = int(match.group(1) or 0)
    minutes = int(match.group(2) or 0)
    seconds = int(match.group(3) or 0)
    
    return hours * 3600 + minutes * 60 + seconds


def format_duration(seconds: int) -> str:
    """
    Format seconds to human-readable duration
    
    Args:
        seconds: Duration in seconds
    
    Returns:
        Formatted duration string (e.g., "1h 2m 10s")
    """
    hours = seconds // 3600
    minutes = (seconds % 3600) // 60
    secs = seconds % 60
    
    parts = []
    if hours > 0:
        parts.append(f"{hours}h")
    if minutes > 0:
        parts.append(f"{minutes}m")
    if secs > 0 or not parts:
        parts.append(f"{secs}s")
    
    return " ".join(parts)
