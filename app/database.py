import os
from motor.motor_asyncio import AsyncIOMotorClient
from pymongo.errors import PyMongoError

# MongoDB connection settings
MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
MONGODB_DB = os.getenv("MONGODB_DB", "examverse")

# Create a single global Motor client (recommended by Motor/PyMongo)
client: AsyncIOMotorClient = AsyncIOMotorClient(MONGODB_URI)
db = client[MONGODB_DB]


async def init_db() -> None:
	"""Initialize database objects like indexes."""
	# Verify connection (fast ping) and ensure indexes
	try:
		await client.admin.command("ping")
		# Ensure unique index on email for users collection
		await db["users"].create_index("email", unique=True)
	except PyMongoError as e:
		# Re-raise to fail fast on startup; FastAPI will log the exception
		raise e
