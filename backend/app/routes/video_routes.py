from fastapi import APIRouter, Query
from typing import Optional
from app.utils.youtube_search import (
    search_youtube_videos,
    search_videos_by_topic,
    get_video_details,
)

router = APIRouter(prefix="/videos", tags=["Videos"])


@router.get("/search")
async def search_videos(
    query: str = Query(..., description="Search query for YouTube videos"),
    max_results: int = Query(6, ge=1, le=25),
    order: str = Query("relevance", pattern="^(relevance|viewCount|rating|date)$"),
    duration: str = Query("any", pattern="^(any|short|medium|long)$"),
):
    return await search_youtube_videos(
        query=query, max_results=max_results, order=order, video_duration=duration
    )


@router.get("/topic")
async def videos_by_topic(
    topic: str = Query(..., description="Topic to search"),
    subject: str = Query("", description="Subject area"),
    max_results: int = Query(6, ge=1, le=25),
    order: str = Query("relevance"),
):
    return await search_videos_by_topic(
        topic=topic, subject=subject, max_results=max_results, order=order
    )


@router.get("/{video_id}")
async def video_details(video_id: str):
    return await get_video_details(video_id)
