from typing import AsyncIterator
from motor.motor_asyncio import AsyncIOMotorDatabase
from .database import db


async def get_db() -> AsyncIterator[AsyncIOMotorDatabase]:
    # Motor client/DB are async; yield the database handle
    yield db
