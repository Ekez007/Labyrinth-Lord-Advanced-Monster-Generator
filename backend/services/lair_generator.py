import random
from typing import List, Dict
from ..models.monster import LairInfo

class LairGenerator:
    
    LAIR_SIZES = {
        'tiny': "Small cave or burrow (10-20 feet)",
        'small': "Modest lair or den (20-40 feet)", 
        'medium': "Standard lair complex (40-80 feet)",
        'large': "Extensive lair network (80-150 feet)",
        'huge': "Vast underground complex (150+ feet)"
    }
    
    TERRAIN_DESCRIPTIONS = {
        'dungeon': {
            'base': "Ancient stone corridors and chambers carved deep underground",
            'features': ["Crumbling masonry", "Iron-bound doors", "Torch brackets", "Stone altars", "Carved reliefs"],
            'defenses': ["Heavy doors", "Pit traps", "Pressure plates", "Maze-like layout", "Narrow passages"]
        },
        'forest': {
            'base': "Natural clearing surrounded by dense woodland and undergrowth",
            'features': ["Massive tree roots", "Moss-covered stones", "Natural springs", "Hollow logs", "Berry bushes"],
            'defenses': ["Camouflaged entrance", "Thorny barriers", "Multiple escape routes", "Elevated position", "Dense canopy cover"]
        },
        'swamp': {
            'base': "Murky bog with stagnant pools and twisted vegetation",
            'features': ["Lily pads", "Rotting logs", "Hanging moss", "Poisonous plants", "Misty atmosphere"],
            'defenses': ["Quicksand patches", "Misleading paths", "Toxic gas pockets", "Hidden underwater routes", "Insect swarms"]
        },
        'mountain': {
            'base': "Rocky cave system carved into the mountainside by wind and water",
            'features': ["Stalactites", "Underground streams", "Crystal formations", "Echoing chambers", "Natural bridges"],
            'defenses': ["Narrow ledges", "Rockfall traps", "Steep climbs", "Hidden passages", "Avalanche triggers"]
        },
        'desert': {
            'base': "Sandy cave or oasis hidden among dunes and rock formations",
            'features': ["Sand drifts", "Palm trees", "Clear pools", "Sun-bleached bones", "Ancient ruins"],
            'defenses': ["Sandstorm cover", "Mirage effects", "Hidden beneath sand", "Scorching heat", "Water scarcity"]
        },
        'arctic': {
            'base': "Ice cave or snow-covered den in the frozen wasteland",
            'features': ["Icicle formations", "Frozen pools", "Snow drifts", "Aurora light", "Fur-lined surfaces"],
            'defenses': ["Blizzard concealment", "Slippery ice", "Extreme cold", "Snow barriers", "Frozen traps"]
        },
        'coastal': {
            'base': "Sea cave accessible during low tide with tidal pools and coral",
            'features': ["Barnacle-encrusted walls", "Tidal pools", "Seaweed curtains", "Smooth stones", "Salt crystals"],
            'defenses': ["Tidal flooding", "Slippery rocks", "Strong currents", "Hidden underwater", "Storm surge protection"]
        },
        'urban': {
            'base': "Abandoned building or sewer system within the city limits",
            'features': ["Broken furniture", "Graffiti", "Makeshift barricades", "Stolen goods", "Improvised tools"],
            'defenses': ["Multiple exits", "Alarm systems", "Guard posts", "Hidden compartments", "Crowd camouflage"]
        },
        'underground': {
            'base': "Deep cavern system far below the surface world",
            'features': ["Phosphorescent fungi", "Underground rivers", "Mineral veins", "Bat colonies", "Echo chambers"],
            'defenses': ["Maze-like tunnels", "Deep pits", "Cave-ins", "Poisonous gases", "Complete darkness"]
        },
        'planar': {
            'base': "Otherworldly realm with reality-defying properties",
            'features': ["Floating platforms", "Glowing sigils", "Shifting geometries", "Elemental storms", "Temporal distortions"],
            'defenses': ["Planar barriers", "Reality rifts", "Magical wards", "Dimensional locks", "Chaos effects"]
        }
    }
    
    INTELLIGENCE_BASED_FEATURES = {
        'animal': ["Simple nests", "Scent markings", "Food caches", "Scratch marks"],
        'low': ["Basic tools", "Simple traps", "Crude alarm systems", "Territorial markings"],
        'average': ["Organized spaces", "Mechanical traps", "Lookout posts", "Stored supplies"],
        'high': ["Complex defenses", "Magical wards", "Strategic positioning", "Advanced traps"],
        'genius': ["Masterful architecture", "Layered security", "Backup plans", "Psychological warfare"]
    }

    @staticmethod
    def generate_lair(monster_type: str, environment: str, challenge_rating: str, special_abilities: List[str]) -> LairInfo:
        """Generate a complete lair description"""
        
        # Determine lair size based on challenge rating
        size = LairGenerator._determine_lair_size(challenge_rating)
        
        # Get terrain-specific information
        terrain_info = LairGenerator.TERRAIN_DESCRIPTIONS.get(environment, LairGenerator.TERRAIN_DESCRIPTIONS['dungeon'])
        
        # Generate base description
        base_description = terrain_info['base']
        
        # Add size context
        size_description = LairGenerator.LAIR_SIZES[size]
        
        # Generate additional features based on monster type and abilities
        features = LairGenerator._generate_features(monster_type, special_abilities, terrain_info['features'])
        
        # Generate defenses based on intelligence and abilities
        defenses = LairGenerator._generate_defenses(monster_type, special_abilities, terrain_info['defenses'])
        
        # Combine into full description
        full_description = f"{base_description}. {size_description}."
        if features:
            full_description += f" Notable features include {', '.join(features[:3])}."
        
        return LairInfo(
            description=full_description,
            terrain=environment,
            size=size,
            defenses=defenses,
            features=features
        )

    @staticmethod
    def _determine_lair_size(challenge_rating: str) -> str:
        """Determine lair size based on challenge rating"""
        cr_to_size = {
            '0': 'tiny',
            '1': 'small',
            '2': 'small', 
            '3': 'medium',
            '4': 'medium',
            '5': 'large',
            '6+': 'huge'
        }
        return cr_to_size.get(challenge_rating, 'medium')

    @staticmethod
    def _generate_features(monster_type: str, special_abilities: List[str], terrain_features: List[str]) -> List[str]:
        """Generate lair features based on monster characteristics"""
        features = []
        
        # Add terrain-specific features
        features.extend(random.sample(terrain_features, min(3, len(terrain_features))))
        
        # Add ability-specific features
        ability_features = {
            'Web': ["Sticky web strands", "Web-wrapped prey"],
            'Flight': ["High perches", "Aerial approach routes"],
            'Burrow': ["Underground tunnels", "Hidden entrances"],
            'Swim': ["Flooded chambers", "Underwater passages"],
            'Invisible': ["Misleading empty spaces", "Hidden alcoves"],
            'Regeneration': ["Healing chambers", "Recovery areas"],
            'Poison': ["Toxic pools", "Venomous plants"],
            'Fire immunity': ["Lava flows", "Charred surfaces"],
            'Cold immunity': ["Frozen chambers", "Ice formations"]
        }
        
        for ability in special_abilities:
            if ability in ability_features:
                features.extend(ability_features[ability])
        
        # Add type-specific features
        type_features = {
            'dragon': ["Treasure chamber", "Royal throne", "Scrying pool"],
            'undead': ["Burial chambers", "Bone decorations", "Unholy altars"],
            'beast': ["Feeding areas", "Territory markers", "Sleeping dens"],
            'giant': ["Oversized furniture", "Trophy displays", "Weapon racks"],
            'fey': ["Fairy rings", "Glamered illusions", "Nature shrines"]
        }
        
        if monster_type in type_features:
            features.extend(type_features[monster_type])
        
        return list(set(features))  # Remove duplicates

    @staticmethod
    def _generate_defenses(monster_type: str, special_abilities: List[str], terrain_defenses: List[str]) -> List[str]:
        """Generate lair defenses based on monster intelligence and abilities"""
        defenses = []
        
        # Add terrain-specific defenses
        defenses.extend(random.sample(terrain_defenses, min(2, len(terrain_defenses))))
        
        # Add ability-based defenses
        ability_defenses = {
            'Web': ["Web barriers", "Entangling traps"],
            'Poison': ["Poisoned spikes", "Toxic gas vents"],
            'Magic resistance': ["Anti-magic zones", "Spell-turning wards"],
            'Charm': ["Charmed guardians", "Mental compulsions"],
            'Fear aura': ["Intimidating displays", "Terror triggers"],
            'Invisible': ["False walls", "Hidden passages"],
            'Teleport': ["Escape portals", "Dimensional rifts"]
        }
        
        for ability in special_abilities:
            if ability in ability_defenses:
                defenses.extend(ability_defenses[ability])
        
        # Add intelligence-based defenses
        intelligence_level = LairGenerator._determine_intelligence(monster_type)
        if intelligence_level in LairGenerator.INTELLIGENCE_BASED_FEATURES:
            defenses.extend(LairGenerator.INTELLIGENCE_BASED_FEATURES[intelligence_level])
        
        return list(set(defenses))  # Remove duplicates

    @staticmethod
    def _determine_intelligence(monster_type: str) -> str:
        """Determine approximate intelligence level from monster type"""
        intelligence_map = {
            'beast': 'animal',
            'undead': 'low',
            'construct': 'low',
            'humanoid': 'average',
            'giant': 'average',
            'fey': 'high',
            'fiend': 'high',
            'dragon': 'genius',
            'aberration': 'high',
            'elemental': 'average'
        }
        return intelligence_map.get(monster_type, 'average')