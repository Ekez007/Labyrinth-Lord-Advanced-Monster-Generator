from fastapi import FastAPI, APIRouter, HTTPException
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime, timedelta

from models.monster import (
    Monster, MonsterLibrary, ShareInfo, 
    AdvancedGenerationRequest, SaveMonsterRequest, ShareMonsterRequest,
    GenerationFilters
)
from services.advanced_generator import AdvancedMonsterGenerator

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI(title="Labyrinth Lord Monster Generator", version="1.0.0")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Legacy endpoints
@api_router.get("/")
async def root():
    return {"message": "Labyrinth Lord Monster Generator API"}

# Monster Generation Endpoints
@api_router.post("/monsters/generate", response_model=Dict[str, List[Monster]])
async def generate_monsters(request: AdvancedGenerationRequest):
    """Generate monsters using advanced algorithms"""
    try:
        monsters = AdvancedMonsterGenerator.generate_monsters(request)
        
        # Store generated monsters in database for potential future reference
        for monster in monsters:
            monster_dict = monster.dict()
            await db.generated_monsters.insert_one(monster_dict)
        
        logger.info(f"Generated {len(monsters)} monsters")
        return {"monsters": monsters}
        
    except Exception as e:
        logger.error(f"Error generating monsters: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Generation failed: {str(e)}")

@api_router.post("/monsters/generate-simple")
async def generate_monsters_simple(filters: GenerationFilters):
    """Simple generation endpoint for backward compatibility"""
    request = AdvancedGenerationRequest(filters=filters)
    return await generate_monsters(request)

# Monster Library Endpoints
@api_router.get("/monsters/libraries", response_model=Dict[str, List[MonsterLibrary]])
async def get_libraries():
    """Get all available monster libraries"""
    try:
        # Get public libraries
        public_libraries = await db.monster_libraries.find({"isPublic": True}).to_list(100)
        
        # Create default library if none exist
        if not public_libraries:
            default_library = MonsterLibrary(
                name="Official Labyrinth Lord",
                description="Core monsters from the Labyrinth Lord rulebook",
                isPublic=True
            )
            await db.monster_libraries.insert_one(default_library.dict())
            public_libraries = [default_library]
        
        # Convert to MonsterLibrary objects if they're dicts, otherwise use as-is
        libraries = []
        for lib in public_libraries:
            if isinstance(lib, dict):
                libraries.append(MonsterLibrary(**lib))
            else:
                libraries.append(lib)
        
        return {"libraries": libraries}
        
    except Exception as e:
        logger.error(f"Error fetching libraries: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch libraries")

@api_router.post("/monsters/save")
async def save_monster(request: SaveMonsterRequest):
    """Save a monster to a library"""
    try:
        monster_dict = request.monster.dict()
        monster_dict["savedAt"] = datetime.utcnow()
        
        # Insert monster
        result = await db.saved_monsters.insert_one(monster_dict)
        monster_id = str(result.inserted_id)
        
        # Update library if specified
        if request.libraryId:
            await db.monster_libraries.update_one(
                {"id": request.libraryId},
                {"$addToSet": {"monsters": monster_id}, "$set": {"updatedAt": datetime.utcnow()}}
            )
        
        logger.info(f"Saved monster: {request.monster.name}")
        return {"success": True, "monsterId": monster_id, "message": "Monster saved successfully"}
        
    except Exception as e:
        logger.error(f"Error saving monster: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to save monster")

@api_router.get("/monsters/my-collection")
async def get_my_collection():
    """Get user's saved monsters"""
    try:
        # For now, return all saved monsters (would filter by user in production)
        monsters = await db.saved_monsters.find().to_list(1000)
        libraries = await db.monster_libraries.find({"isPublic": False}).to_list(100)
        
        return {
            "monsters": [Monster(**monster) for monster in monsters],
            "totalCount": len(monsters),
            "libraries": [MonsterLibrary(**lib) for lib in libraries]
        }
        
    except Exception as e:
        logger.error(f"Error fetching collection: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch collection")

# Monster Sharing Endpoints
@api_router.post("/monsters/share")
async def share_monster(request: ShareMonsterRequest):
    """Create a shareable link for a monster"""
    try:
        # Check if monster exists
        monster = await db.saved_monsters.find_one({"id": request.monsterId})
        if not monster:
            raise HTTPException(status_code=404, detail="Monster not found")
        
        # Create share record
        expires_at = datetime.utcnow() + timedelta(days=request.expiresIn)
        share_info = ShareInfo(
            monsterId=request.monsterId,
            shareType=request.shareType,
            expiresAt=expires_at
        )
        
        await db.monster_shares.insert_one(share_info.dict())
        
        # Create share URL (would be proper domain in production)
        share_url = f"http://localhost:3000/shared/{share_info.shareId}"
        
        logger.info(f"Created share link for monster: {request.monsterId}")
        return {
            "shareUrl": share_url,
            "shareId": share_info.shareId,
            "expiresAt": expires_at.isoformat()
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error creating share: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to create share link")

@api_router.get("/monsters/shared/{share_id}")
async def get_shared_monster(share_id: str):
    """Get a shared monster by share ID"""
    try:
        # Find share record
        share_record = await db.monster_shares.find_one({"shareId": share_id})
        if not share_record:
            raise HTTPException(status_code=404, detail="Shared monster not found")
        
        # Check if expired
        if share_record.get("expiresAt") and datetime.fromisoformat(share_record["expiresAt"]) < datetime.utcnow():
            raise HTTPException(status_code=410, detail="Shared link has expired")
        
        # Get monster
        monster = await db.saved_monsters.find_one({"id": share_record["monsterId"]})
        if not monster:
            raise HTTPException(status_code=404, detail="Monster not found")
        
        # Update view count
        await db.monster_shares.update_one(
            {"shareId": share_id},
            {"$inc": {"viewCount": 1}}
        )
        
        return {
            "monster": Monster(**monster),
            "sharedBy": "Anonymous User",
            "sharedAt": share_record.get("createdAt", datetime.utcnow()).isoformat()
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching shared monster: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch shared monster")

# Utility Endpoints
@api_router.get("/monsters/stats")
async def get_generation_stats():
    """Get generation statistics"""
    try:
        total_generated = await db.generated_monsters.count_documents({})
        total_saved = await db.saved_monsters.count_documents({})
        total_shared = await db.monster_shares.count_documents({})
        
        return {
            "totalGenerated": total_generated,
            "totalSaved": total_saved,
            "totalShared": total_shared
        }
        
    except Exception as e:
        logger.error(f"Error fetching stats: {str(e)}")
        return {"totalGenerated": 0, "totalSaved": 0, "totalShared": 0}

@api_router.delete("/monsters/saved/{monster_id}")
async def delete_saved_monster(monster_id: str):
    """Delete a saved monster"""
    try:
        result = await db.saved_monsters.delete_one({"id": monster_id})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Monster not found")
        
        # Remove from libraries
        await db.monster_libraries.update_many(
            {},
            {"$pull": {"monsters": monster_id}}
        )
        
        logger.info(f"Deleted monster: {monster_id}")
        return {"success": True, "message": "Monster deleted successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting monster: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to delete monster")

# Error handlers
@app.exception_handler(404)
async def not_found_handler(request, exc):
    return JSONResponse(
        status_code=404,
        content={"detail": "Resource not found"}
    )

@app.exception_handler(500)
async def internal_error_handler(request, exc):
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error"}
    )

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    logger.info("Labyrinth Lord Monster Generator API started")

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
    logger.info("Database connection closed")
