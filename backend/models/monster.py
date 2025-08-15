from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime
import uuid

class MonsterStats(BaseModel):
    ac: int
    hd: str
    hp: int
    movement: str
    attacks: str
    damage: str
    save: str
    morale: int
    xp: int

class EncounterInfo(BaseModel):
    numberAppearing: str
    wildEncounter: str
    lairChance: int

class TreasureInfo(BaseModel):
    individual: str
    lair: str
    coins: Optional[Dict[str, int]] = {}
    gems: Optional[List[str]] = []
    magicItems: Optional[List[str]] = []

class LairInfo(BaseModel):
    description: str
    terrain: str
    size: str
    defenses: List[str]
    features: Optional[List[str]] = []

class Monster(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    type: str
    challengeRating: str
    environment: str
    stats: MonsterStats
    description: str
    specialAbilities: List[str]
    encounters: EncounterInfo
    treasure: TreasureInfo
    lair: LairInfo
    createdBy: Optional[str] = None
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    isTemplate: bool = False
    source: str = "generated"

class MonsterLibrary(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    description: str
    ownerId: Optional[str] = None
    isPublic: bool = False
    monsters: List[str] = []
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    updatedAt: datetime = Field(default_factory=datetime.utcnow)

class ShareInfo(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    monsterId: str
    shareId: str = Field(default_factory=lambda: str(uuid.uuid4())[:8])
    sharedBy: Optional[str] = None
    shareType: str = "link"
    expiresAt: Optional[datetime] = None
    viewCount: int = 0
    createdAt: datetime = Field(default_factory=datetime.utcnow)

class GenerationFilters(BaseModel):
    challengeRating: str = "any"
    type: str = "any"
    environment: str = "any"
    count: int = 1

class AdvancedGenerationRequest(BaseModel):
    filters: GenerationFilters = GenerationFilters()
    algorithm: str = "balanced"
    complexity: str = "moderate"
    includeTreasure: bool = True
    includeLair: bool = True
    customRules: Optional[Dict[str, Any]] = {}

class SaveMonsterRequest(BaseModel):
    monster: Monster
    libraryId: Optional[str] = None

class ShareMonsterRequest(BaseModel):
    monsterId: str
    shareType: str = "link"
    expiresIn: int = 7