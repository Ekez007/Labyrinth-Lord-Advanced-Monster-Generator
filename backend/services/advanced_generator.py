import random
import uuid
from typing import List, Dict, Any
from datetime import datetime

from models.monster import Monster, MonsterStats, AdvancedGenerationRequest
from services.treasure_generator import TreasureGenerator
from services.lair_generator import LairGenerator  
from services.encounter_generator import EncounterGenerator

class AdvancedMonsterGenerator:
    
    # Comprehensive monster data
    MONSTER_TEMPLATES = [
        {
            "name": "Goblin Warrior", "type": "humanoid", "challengeRating": "1", "environment": "dungeon",
            "ac": 6, "hd": "1-1", "hp": 3, "movement": "60' (20')", "attacks": "1 weapon", 
            "damage": "1d6 or by weapon", "save": "Normal Human", "morale": 7, "xp": 5,
            "description": "Small, malicious humanoids with yellow eyes and cruel expressions. They favor ambush tactics and overwhelming numbers.",
            "specialAbilities": ["Infravision 60'", "Sunlight Penalty -1"]
        },
        {
            "name": "Orc Berserker", "type": "humanoid", "challengeRating": "1", "environment": "dungeon",
            "ac": 6, "hd": "1", "hp": 4, "movement": "120' (40')", "attacks": "1 weapon",
            "damage": "1d8 or by weapon", "save": "Fighter 1", "morale": 8, "xp": 10,
            "description": "Brutish humanoids with pig-like features and a taste for violence. They live in tribes and raid civilized lands.",
            "specialAbilities": ["Infravision 60'", "Berserker Rage +2 to hit"]
        },
        {
            "name": "Ancient Dragon", "type": "dragon", "challengeRating": "6+", "environment": "mountain",
            "ac": 0, "hd": "11", "hp": 48, "movement": "80' (30') / 240' (80') flying", "attacks": "2 claws/1 bite or breath",
            "damage": "1d8/1d8/3d8 or breath weapon", "save": "Fighter 11", "morale": 10, "xp": 2300,
            "description": "Massive, ancient wyrm with scales like armor and eyes like burning coals. Commands respect and fear across the realm.",
            "specialAbilities": ["Breath weapon", "Magic resistance 50%", "Spellcasting", "Fear aura", "Treasure sense"]
        }
    ]
    
    MONSTER_TYPES = ["beast", "undead", "humanoid", "dragon", "fey", "fiend", "construct", "elemental", "giant", "aberration"]
    ENVIRONMENTS = ["dungeon", "forest", "swamp", "mountain", "desert", "arctic", "coastal", "urban", "underground", "planar"]
    CHALLENGE_RATINGS = ["0", "1", "2", "3", "4", "5", "6+"]
    
    SPECIAL_ABILITIES = [
        "Infravision 60'", "Infravision 90'", "Immune to sleep/charm", "Poison immunity", "Fire immunity", "Cold immunity",
        "Lightning immunity", "Magic resistance", "Spell turning", "Regeneration", "Flight", "Burrow", "Swim", "Climb walls",
        "Web", "Paralysis", "Charm", "Fear aura", "Death gaze", "Breath weapon", "Spellcasting", "Pack tactics",
        "Berserker rage", "Leadership", "Keen scent", "Tracking", "Invisible", "Phase", "Teleport", "Shapeshifting",
        "Energy drain", "Disease", "Curse", "Dimension door", "Mirror image", "Displacement", "Ethereal", "Astral projection"
    ]
    
    NAME_PREFIXES = [
        "Ancient", "Dire", "Giant", "Lesser", "Greater", "Elder", "Young", "Feral", "Savage", "Wild",
        "Shadow", "Frost", "Fire", "Stone", "Iron", "Blood", "Death", "Bone", "Dark", "Pale",
        "Crimson", "Azure", "Golden", "Silver", "Obsidian", "Crystal", "Spectral", "Phantom", "Void", "Storm"
    ]
    
    NAME_ROOTS = [
        "Fang", "Claw", "Horn", "Wing", "Eye", "Maw", "Stalker", "Hunter", "Reaper", "Slayer",
        "Beast", "Fiend", "Wraith", "Shade", "Spirit", "Guardian", "Warden", "Sentinel", "Keeper", "Lord",
        "Terror", "Doom", "Rage", "Fury", "Dread", "Blight", "Scourge", "Plague", "Venom", "Toxin"
    ]
    
    DESCRIPTORS = [
        "malevolent", "cunning", "brutal", "savage", "ancient", "mysterious", "terrifying", "relentless",
        "crafty", "vicious", "deadly", "fearsome", "monstrous", "otherworldly", "predatory", "aggressive",
        "sinister", "ominous", "menacing", "horrific", "nightmarish", "ghastly", "twisted", "aberrant"
    ]

    @staticmethod
    def generate_monsters(request: AdvancedGenerationRequest) -> List[Monster]:
        """Main generation method using advanced algorithms"""
        monsters = []
        
        for _ in range(request.filters.count):
            if request.algorithm == "template-based":
                monster = AdvancedMonsterGenerator._generate_from_template(request)
            elif request.algorithm == "random":
                monster = AdvancedMonsterGenerator._generate_completely_random(request)
            else:  # balanced
                monster = AdvancedMonsterGenerator._generate_balanced(request)
            
            monsters.append(monster)
        
        return monsters

    @staticmethod
    def _generate_balanced(request: AdvancedGenerationRequest) -> Monster:
        """Generate monster using balanced algorithm (70% template, 30% random)"""
        if random.random() < 0.7:
            return AdvancedMonsterGenerator._generate_from_template(request)
        else:
            return AdvancedMonsterGenerator._generate_completely_random(request)

    @staticmethod
    def _generate_from_template(request: AdvancedGenerationRequest) -> Monster:
        """Generate monster based on existing templates with variations"""
        # Filter templates by criteria
        suitable_templates = [
            t for t in AdvancedMonsterGenerator.MONSTER_TEMPLATES
            if (request.filters.challengeRating == "any" or t["challengeRating"] == request.filters.challengeRating) and
               (request.filters.type == "any" or t["type"] == request.filters.type) and
               (request.filters.environment == "any" or t["environment"] == request.filters.environment)
        ]
        
        if not suitable_templates:
            return AdvancedMonsterGenerator._generate_completely_random(request)
        
        template = random.choice(suitable_templates)
        
        # Create variations of the template
        monster_data = template.copy()
        
        # Add variations based on complexity
        if request.complexity == "complex":
            monster_data = AdvancedMonsterGenerator._add_complex_variations(monster_data)
        elif request.complexity == "moderate":
            monster_data = AdvancedMonsterGenerator._add_moderate_variations(monster_data)
        
        return AdvancedMonsterGenerator._build_complete_monster(monster_data, request)

    @staticmethod
    def _generate_completely_random(request: AdvancedGenerationRequest) -> Monster:
        """Generate completely random monster"""
        cr = request.filters.challengeRating if request.filters.challengeRating != "any" else random.choice(AdvancedMonsterGenerator.CHALLENGE_RATINGS)
        monster_type = request.filters.type if request.filters.type != "any" else random.choice(AdvancedMonsterGenerator.MONSTER_TYPES)
        environment = request.filters.environment if request.filters.environment != "any" else random.choice(AdvancedMonsterGenerator.ENVIRONMENTS)
        
        # Generate stats based on CR
        stats = AdvancedMonsterGenerator._generate_stats_by_cr(cr)
        
        # Generate name
        name = AdvancedMonsterGenerator._generate_monster_name(monster_type)
        
        # Generate abilities
        abilities = AdvancedMonsterGenerator._generate_special_abilities(cr, monster_type, request.complexity)
        
        # Generate description
        description = AdvancedMonsterGenerator._generate_description(name, monster_type, environment)
        
        monster_data = {
            "name": name,
            "type": monster_type,
            "challengeRating": cr,
            "environment": environment,
            "ac": stats["ac"],
            "hd": stats["hd"],
            "hp": stats["hp"],
            "movement": stats["movement"],
            "attacks": stats["attacks"],
            "damage": stats["damage"],
            "save": stats["save"],
            "morale": stats["morale"],
            "xp": stats["xp"],
            "description": description,
            "specialAbilities": abilities
        }
        
        return AdvancedMonsterGenerator._build_complete_monster(monster_data, request)

    @staticmethod
    def _build_complete_monster(monster_data: Dict[str, Any], request: AdvancedGenerationRequest) -> Monster:
        """Build complete monster with all systems"""
        
        # Create basic monster stats
        stats = MonsterStats(
            ac=monster_data["ac"],
            hd=monster_data["hd"],
            hp=monster_data["hp"],
            movement=monster_data["movement"],
            attacks=monster_data["attacks"],
            damage=monster_data["damage"],
            save=monster_data["save"],
            morale=monster_data["morale"],
            xp=monster_data["xp"]
        )
        
        # Generate encounter information
        encounters = EncounterGenerator.generate_encounter_info(
            monster_data["type"],
            monster_data["challengeRating"],
            monster_data["specialAbilities"],
            monster_data["environment"]
        )
        
        # Generate treasure
        if request.includeTreasure:
            individual_treasure = TreasureGenerator.generate_individual_treasure(monster_data["challengeRating"])
            lair_treasure = TreasureGenerator.generate_lair_treasure(monster_data["challengeRating"], monster_data["type"])
            # Combine treasures
            treasure = TreasureGenerator.generate_lair_treasure(monster_data["challengeRating"], monster_data["type"])
        else:
            from models.monster import TreasureInfo
            treasure = TreasureInfo(individual="None", lair="None")
        
        # Generate lair
        if request.includeLair:
            lair = LairGenerator.generate_lair(
                monster_data["type"],
                monster_data["environment"],
                monster_data["challengeRating"],
                monster_data["specialAbilities"]
            )
        else:
            from ..models.monster import LairInfo
            lair = LairInfo(description="No fixed lair", terrain=monster_data["environment"], size="none", defenses=[])
        
        return Monster(
            name=monster_data["name"],
            type=monster_data["type"],
            challengeRating=monster_data["challengeRating"],
            environment=monster_data["environment"],
            stats=stats,
            description=monster_data["description"],
            specialAbilities=monster_data["specialAbilities"],
            encounters=encounters,
            treasure=treasure,
            lair=lair,
            source="generated"
        )

    @staticmethod
    def _generate_stats_by_cr(cr: str) -> Dict[str, Any]:
        """Generate appropriate stats for challenge rating"""
        cr_stats = {
            '0': {'ac': random.randint(8, 10), 'hd': '1-1', 'base_hp': 2, 'attacks': '1', 'save': 'Normal Human', 'morale': random.randint(5, 7)},
            '1': {'ac': random.randint(6, 8), 'hd': '1', 'base_hp': 4, 'attacks': '1', 'save': 'Fighter 1', 'morale': random.randint(6, 8)},
            '2': {'ac': random.randint(5, 7), 'hd': '2', 'base_hp': 9, 'attacks': '1', 'save': 'Fighter 1', 'morale': random.randint(7, 9)},
            '3': {'ac': random.randint(4, 6), 'hd': '3', 'base_hp': 13, 'attacks': '1-2', 'save': 'Fighter 2', 'morale': random.randint(8, 10)},
            '4': {'ac': random.randint(3, 5), 'hd': '4', 'base_hp': 18, 'attacks': '2', 'save': 'Fighter 2', 'morale': random.randint(8, 11)},
            '5': {'ac': random.randint(2, 4), 'hd': '5', 'base_hp': 22, 'attacks': '2', 'save': 'Fighter 3', 'morale': random.randint(9, 12)},
            '6+': {'ac': random.randint(0, 3), 'hd': '6+', 'base_hp': 27, 'attacks': '2-3', 'save': 'Fighter 4', 'morale': random.randint(10, 12)}
        }
        
        base_stats = cr_stats.get(cr, cr_stats['1'])
        
        # Generate HP from HD
        hd_string = base_stats['hd']
        if hd_string == '1-1':
            hp = max(1, random.randint(1, 8) - 1)
        elif '+' in hd_string:
            dice, bonus = hd_string.split('+')
            hp = sum(random.randint(1, 8) for _ in range(int(dice))) + int(bonus)
        else:
            dice = int(hd_string) if hd_string.isdigit() else 1
            hp = sum(random.randint(1, 8) for _ in range(dice))
        
        # Generate movement
        base_move = random.choice([60, 90, 120, 150])
        movement = f"{base_move}' ({base_move//3}')"
        
        # Generate damage based on CR
        damage_by_cr = {
            '0': '1d4', '1': '1d6', '2': '1d8', '3': '2d4', '4': '1d10', '5': '2d6', '6+': '2d8'
        }
        damage = damage_by_cr.get(cr, '1d6')
        
        # Generate XP
        xp_by_cr = {
            '0': 5, '1': random.randint(10, 25), '2': random.randint(20, 50), 
            '3': random.randint(35, 75), '4': random.randint(50, 125), 
            '5': random.randint(75, 175), '6+': random.randint(100, 300)
        }
        xp = xp_by_cr.get(cr, 10)
        
        return {
            'ac': base_stats['ac'],
            'hd': hd_string,
            'hp': hp,
            'movement': movement,
            'attacks': base_stats['attacks'] + ' attack' + ('s' if '2' in base_stats['attacks'] else ''),
            'damage': damage,
            'save': base_stats['save'],
            'morale': base_stats['morale'],
            'xp': xp
        }

    @staticmethod
    def _generate_monster_name(monster_type: str) -> str:
        """Generate creative monster name"""
        use_prefix = random.random() > 0.4
        prefix = random.choice(AdvancedMonsterGenerator.NAME_PREFIXES) + " " if use_prefix else ""
        
        type_base_names = {
            'beast': ["Wolf", "Bear", "Spider", "Boar", "Eagle", "Serpent", "Lizard", "Rat", "Hawk", "Panther"],
            'undead': ["Skeleton", "Zombie", "Wraith", "Specter", "Ghoul", "Wight", "Shade", "Phantom", "Lich", "Revenant"],
            'humanoid': ["Goblin", "Orc", "Hobgoblin", "Kobold", "Gnoll", "Bugbear", "Troll", "Giant", "Ogre", "Minotaur"],
            'dragon': ["Drake", "Wyvern", "Dragon", "Wyrm", "Dragonling", "Serpent", "Basilisk", "Hydra"],
            'fey': ["Sprite", "Pixie", "Dryad", "Satyr", "Brownie", "Will-o'-wisp", "Nymph", "Treant"],
            'fiend': ["Demon", "Devil", "Imp", "Quasit", "Hellhound", "Incubus", "Succubus", "Balrog"],
            'construct': ["Golem", "Automaton", "Guardian", "Sentinel", "Statue", "Clockwork", "Homunculus"],
            'elemental': ["Elemental", "Mephit", "Salamander", "Sylph", "Gnome", "Djinn", "Efreet"],
            'giant': ["Giant", "Ogre", "Troll", "Ettin", "Cyclops", "Titan", "Colossus"],
            'aberration': ["Ooze", "Cube", "Horror", "Aberration", "Monstrosity", "Anomaly", "Beholder", "Mind Flayer"]
        }
        
        base_name = random.choice(type_base_names.get(monster_type, type_base_names['beast']))
        
        use_suffix = random.random() > 0.6
        suffix = " " + random.choice(AdvancedMonsterGenerator.NAME_ROOTS) if use_suffix else ""
        
        return prefix + base_name + suffix

    @staticmethod
    def _generate_special_abilities(cr: str, monster_type: str, complexity: str) -> List[str]:
        """Generate appropriate special abilities"""
        num_abilities_by_complexity = {
            'simple': 1,
            'moderate': random.randint(2, 3),
            'complex': random.randint(3, 5)
        }
        
        num_abilities = num_abilities_by_complexity.get(complexity, 2)
        
        # Increase abilities for higher CR
        cr_bonus = {'0': 0, '1': 0, '2': 1, '3': 1, '4': 2, '5': 2, '6+': 3}
        num_abilities += cr_bonus.get(cr, 0)
        
        abilities = []
        available_abilities = AdvancedMonsterGenerator.SPECIAL_ABILITIES.copy()
        
        # Add type-specific abilities
        type_abilities = {
            'undead': ['Immune to sleep/charm', 'Energy drain'],
            'dragon': ['Breath weapon', 'Magic resistance', 'Fear aura'],
            'fey': ['Invisible', 'Charm', 'Teleport'],
            'fiend': ['Magic resistance', 'Fear aura', 'Teleport'],
            'elemental': ['Fire immunity', 'Cold immunity', 'Lightning immunity'],
            'beast': ['Keen scent', 'Pack tactics', 'Tracking']
        }
        
        if monster_type in type_abilities:
            # Higher chance for type-specific abilities
            for ability in type_abilities[monster_type]:
                if len(abilities) < num_abilities and random.random() > 0.5:
                    abilities.append(ability)
                    if ability in available_abilities:
                        available_abilities.remove(ability)
        
        # Fill remaining slots with random abilities
        while len(abilities) < num_abilities and available_abilities:
            ability = random.choice(available_abilities)
            abilities.append(ability)
            available_abilities.remove(ability)
        
        return abilities

    @staticmethod
    def _generate_description(name: str, monster_type: str, environment: str) -> str:
        """Generate monster description"""
        descriptor1 = random.choice(AdvancedMonsterGenerator.DESCRIPTORS)
        descriptor2 = random.choice(AdvancedMonsterGenerator.DESCRIPTORS)
        
        templates = [
            f"A {descriptor1} creature that haunts the {environment}. This {monster_type} is known for its {descriptor2} nature and unpredictable behavior in combat.",
            f"These {descriptor1} beings are commonly found lurking in {environment} regions. They are {descriptor2} predators that strike fear into seasoned adventurers.",
            f"A {descriptor2} {monster_type} that has claimed the {environment} as its domain. Ancient tales speak of its {descriptor1} appetite and supernatural cunning.",
            f"This {descriptor1} monstrosity terrorizes the {environment}, leaving behind only whispered legends. Its {descriptor2} reputation is earned through countless deadly encounters."
        ]
        
        return random.choice(templates)

    @staticmethod
    def _add_moderate_variations(monster_data: Dict[str, Any]) -> Dict[str, Any]:
        """Add moderate variations to template monster"""
        # Slightly modify stats
        monster_data["hp"] = max(1, monster_data["hp"] + random.randint(-2, 2))
        monster_data["morale"] = max(2, min(12, monster_data["morale"] + random.randint(-1, 1)))
        
        # Maybe add an ability
        if random.random() > 0.6:
            new_ability = random.choice(AdvancedMonsterGenerator.SPECIAL_ABILITIES)
            if new_ability not in monster_data["specialAbilities"]:
                monster_data["specialAbilities"].append(new_ability)
        
        return monster_data

    @staticmethod
    def _add_complex_variations(monster_data: Dict[str, Any]) -> Dict[str, Any]:
        """Add complex variations to template monster"""
        # Modify stats more significantly
        monster_data["hp"] = max(1, monster_data["hp"] + random.randint(-3, 5))
        monster_data["ac"] = max(0, min(10, monster_data["ac"] + random.randint(-1, 1)))
        monster_data["morale"] = max(2, min(12, monster_data["morale"] + random.randint(-2, 2)))
        
        # Add 1-2 new abilities
        for _ in range(random.randint(1, 2)):
            new_ability = random.choice(AdvancedMonsterGenerator.SPECIAL_ABILITIES)
            if new_ability not in monster_data["specialAbilities"]:
                monster_data["specialAbilities"].append(new_ability)
        
        # Modify name
        if random.random() > 0.5:
            prefix = random.choice(AdvancedMonsterGenerator.NAME_PREFIXES)
            monster_data["name"] = f"{prefix} {monster_data['name']}"
        
        return monster_data