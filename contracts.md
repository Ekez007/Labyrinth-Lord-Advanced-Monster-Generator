# Labyrinth Lord Monster Generator - API Contracts & Implementation Plan

## Current Mock Data to Replace

### Frontend Mock Data (to be replaced with real API calls):
- `src/data/mockMonsters.js` - Static monster templates
- `src/utils/monsterGenerator.js` - Client-side generation logic
- Local state management for saved monsters

## API Contracts

### 1. Monster Generation
**POST /api/monsters/generate**
```json
Request: {
  "filters": {
    "challengeRating": "any" | "0" | "1" | "2" | "3" | "4" | "5" | "6+",
    "type": "any" | "beast" | "undead" | "humanoid" | etc.,
    "environment": "any" | "dungeon" | "forest" | "swamp" | etc.,
    "count": 1-5
  }
}

Response: {
  "monsters": [
    {
      "id": "generated-id",
      "name": "Ancient Dire Wolf",
      "type": "beast",
      "challengeRating": "3",
      "environment": "forest",
      "stats": {
        "ac": 6,
        "hd": "3+3",
        "hp": 16,
        "movement": "150'(50')",
        "attacks": "1 bite",
        "damage": "2d4",
        "save": "Fighter 2",
        "morale": 8,
        "xp": 50
      },
      "description": "Generated description...",
      "specialAbilities": ["Pack tactics", "Keen scent"],
      "encounters": {
        "numberAppearing": "2d4",
        "wildEncounter": "1d6",
        "lairChance": 25
      },
      "treasure": {
        "individual": "None",
        "lair": "C"
      },
      "lair": {
        "description": "Dense forest den with multiple entrances...",
        "terrain": "forest",
        "size": "medium",
        "defenses": ["Camouflaged entrance", "Multiple escape routes"]
      }
    }
  ]
}
```

### 2. Monster Libraries
**GET /api/monsters/libraries**
```json
Response: {
  "libraries": [
    {
      "id": "official-ll",
      "name": "Official Labyrinth Lord",
      "description": "Core monsters from LL rulebook",
      "isPublic": true,
      "monsterCount": 150
    },
    {
      "id": "user-123-custom",
      "name": "My Custom Monsters",
      "description": "Personal monster collection",
      "isPublic": false,
      "monsterCount": 25
    }
  ]
}
```

### 3. Save Monster
**POST /api/monsters/save**
```json
Request: {
  "monster": { /* full monster object */ },
  "libraryId": "user-123-custom"
}

Response: {
  "success": true,
  "monsterId": "saved-monster-id",
  "message": "Monster saved successfully"
}
```

### 4. User Monster Collection
**GET /api/monsters/my-collection**
```json
Response: {
  "monsters": [/* array of saved monsters */],
  "totalCount": 25,
  "libraries": [/* user's libraries */]
}
```

### 5. Share Monster
**POST /api/monsters/share**
```json
Request: {
  "monsterId": "monster-id",
  "shareType": "public" | "link",
  "expiresIn": 7 // days
}

Response: {
  "shareUrl": "https://app.com/monster/shared/abc123",
  "shareId": "abc123",
  "expiresAt": "2025-01-22T10:00:00Z"
}
```

### 6. Get Shared Monster
**GET /api/monsters/shared/:shareId**
```json
Response: {
  "monster": { /* full monster object */ },
  "sharedBy": "Anonymous User",
  "sharedAt": "2025-01-15T10:00:00Z"
}
```

### 7. Advanced Generation Settings
**POST /api/monsters/generate-advanced**
```json
Request: {
  "algorithm": "balanced" | "random" | "template-based",
  "complexity": "simple" | "moderate" | "complex",
  "includeTreasure": true,
  "includeLair": true,
  "customRules": {
    "forceSpecialAbilities": 2,
    "treasureMultiplier": 1.5
  }
}
```

## Database Models

### Monster Schema
```javascript
{
  _id: ObjectId,
  name: String,
  type: String,
  challengeRating: String,
  environment: String,
  stats: {
    ac: Number,
    hd: String,
    hp: Number,
    movement: String,
    attacks: String,
    damage: String,
    save: String,
    morale: Number,
    xp: Number
  },
  description: String,
  specialAbilities: [String],
  encounters: {
    numberAppearing: String,
    wildEncounter: String,
    lairChance: Number
  },
  treasure: {
    individual: String,
    lair: String
  },
  lair: {
    description: String,
    terrain: String,
    size: String,
    defenses: [String]
  },
  createdBy: ObjectId,
  createdAt: Date,
  isTemplate: Boolean,
  source: String // "generated", "template", "user-created"
}
```

### Library Schema
```javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  ownerId: ObjectId,
  isPublic: Boolean,
  monsters: [ObjectId],
  createdAt: Date,
  updatedAt: Date
}
```

### Share Schema
```javascript
{
  _id: ObjectId,
  monsterId: ObjectId,
  shareId: String,
  sharedBy: ObjectId,
  shareType: String,
  expiresAt: Date,
  viewCount: Number,
  createdAt: Date
}
```

## Frontend Integration Changes

### 1. Replace Monster Generation
- Remove `generateMonsters()` from `monsterGenerator.js`
- Replace with API call to `/api/monsters/generate`
- Keep UI state management for loading/error states

### 2. Add Library Management
- New component: `MonsterLibraries.jsx`
- Integration with existing `SavedMonsters.jsx`
- Library selection in save workflow

### 3. Add Sharing Features
- Share button in `MonsterCard.jsx`
- Share modal with link generation
- View shared monsters page

### 4. Enhanced Monster Display
- Add encounter information section
- Add treasure information section
- Add lair description section
- Expandable sections for better organization

### 5. Advanced Generation Controls
- Algorithm selection in `GenerationControls.jsx`
- Complexity settings
- Toggle for treasure/lair generation

## Advanced Generation Algorithm Features

### 1. Treasure System
- Individual treasure based on monster type and CR
- Lair treasure using Labyrinth Lord treasure tables
- Coin generation: copper, silver, electrum, gold, platinum
- Gem and jewelry generation
- Magic item inclusion based on CR

### 2. Encounter Numbers
- Number appearing in wilderness
- Lair encounter numbers
- Social structure (solitary, pair, pack, horde)
- Lair occupancy percentage

### 3. Lair Generation
- Terrain-appropriate lair descriptions
- Defensive features based on monster intelligence
- Size appropriate to creature and numbers
- Environmental hazards and advantages

### 4. Advanced AI-like Generation
- Monster ecology relationships
- Behavioral patterns based on intelligence
- Seasonal migration patterns
- Diet and hunting preferences

## Implementation Priority

1. **Phase 1**: Basic API endpoints for generation and saving
2. **Phase 2**: Treasure and encounter systems
3. **Phase 3**: Lair generation system
4. **Phase 4**: Library management
5. **Phase 5**: Sharing system
6. **Phase 6**: Advanced generation algorithms

## Backend Implementation Notes

- Use existing MongoDB connection
- Implement proper error handling and validation
- Add rate limiting for generation endpoints
- Cache frequently used monster templates
- Implement proper user session management (basic)
- Add logging for generation statistics

## Frontend Updates Required

- Update all mock data usage to API calls
- Add loading states for all async operations
- Implement error handling and retry logic
- Add new UI components for advanced features
- Update existing components to show new data fields