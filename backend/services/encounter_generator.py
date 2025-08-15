import random
from typing import Tuple
from ..models.monster import EncounterInfo

class EncounterGenerator:
    
    # Social structure based encounter numbers
    SOCIAL_STRUCTURES = {
        'solitary': {
            'numberAppearing': '1',
            'wildEncounter': '1',
            'lairChance': 10
        },
        'pair': {
            'numberAppearing': '1d2',
            'wildEncounter': '1d2', 
            'lairChance': 15
        },
        'family': {
            'numberAppearing': '1d4+1',
            'wildEncounter': '1d3',
            'lairChance': 25
        },
        'pack': {
            'numberAppearing': '2d4',
            'wildEncounter': '1d4',
            'lairChance': 30
        },
        'small_group': {
            'numberAppearing': '2d6',
            'wildEncounter': '1d6',
            'lairChance': 25
        },
        'band': {
            'numberAppearing': '3d6',
            'wildEncounter': '2d4',
            'lairChance': 40
        },
        'tribe': {
            'numberAppearing': '4d10',
            'wildEncounter': '2d6',
            'lairChance': 50
        },
        'horde': {
            'numberAppearing': '10d10',
            'wildEncounter': '3d6',
            'lairChance': 60
        }
    }
    
    # Monster type to typical social structure mapping
    TYPE_SOCIAL_STRUCTURE = {
        'beast': {
            'predator': ['solitary', 'pair', 'family'],
            'pack_hunter': ['pack', 'small_group'],
            'herd': ['band', 'tribe']
        },
        'undead': {
            'mindless': ['solitary', 'small_group', 'band'],
            'intelligent': ['solitary', 'pair', 'family']
        },
        'humanoid': {
            'primitive': ['family', 'pack', 'band', 'tribe'],
            'civilized': ['pair', 'family', 'small_group'],
            'warrior': ['band', 'tribe', 'horde']
        },
        'dragon': ['solitary', 'pair'],
        'giant': ['solitary', 'pair', 'family'],
        'fey': ['solitary', 'pair', 'small_group'],
        'fiend': ['solitary', 'pair', 'family'],
        'construct': ['solitary', 'small_group'],
        'elemental': ['solitary', 'pair'],
        'aberration': ['solitary', 'pair', 'small_group']
    }
    
    # Challenge rating modifiers for encounter numbers
    CR_MODIFIERS = {
        '0': {'mult': 2.0, 'lair_bonus': 5},
        '1': {'mult': 1.5, 'lair_bonus': 10},
        '2': {'mult': 1.2, 'lair_bonus': 15},
        '3': {'mult': 1.0, 'lair_bonus': 20},
        '4': {'mult': 0.8, 'lair_bonus': 25},
        '5': {'mult': 0.6, 'lair_bonus': 30},
        '6+': {'mult': 0.4, 'lair_bonus': 35}
    }

    @staticmethod
    def generate_encounter_info(monster_type: str, challenge_rating: str, special_abilities: list, environment: str) -> EncounterInfo:
        """Generate encounter information based on monster characteristics"""
        
        # Determine social structure
        social_structure = EncounterGenerator._determine_social_structure(monster_type, special_abilities)
        
        # Get base encounter data
        base_data = EncounterGenerator.SOCIAL_STRUCTURES[social_structure]
        
        # Apply CR modifiers
        cr_data = EncounterGenerator.CR_MODIFIERS.get(challenge_rating, EncounterGenerator.CR_MODIFIERS['3'])
        
        # Modify encounter numbers based on CR
        number_appearing = EncounterGenerator._modify_dice_expression(
            base_data['numberAppearing'], 
            cr_data['mult']
        )
        
        wild_encounter = EncounterGenerator._modify_dice_expression(
            base_data['wildEncounter'],
            cr_data['mult']
        )
        
        # Calculate lair chance
        lair_chance = min(95, base_data['lairChance'] + cr_data['lair_bonus'])
        
        # Environmental modifiers
        env_modifiers = EncounterGenerator._get_environment_modifiers(environment)
        lair_chance = max(5, min(95, lair_chance + env_modifiers['lair_bonus']))
        
        return EncounterInfo(
            numberAppearing=number_appearing,
            wildEncounter=wild_encounter,
            lairChance=lair_chance
        )

    @staticmethod
    def _determine_social_structure(monster_type: str, special_abilities: list) -> str:
        """Determine social structure based on monster type and abilities"""
        
        # Special ability modifiers
        if 'Leadership' in special_abilities or 'Charm' in special_abilities:
            # Leaders tend to have larger groups
            social_weights = {'band': 3, 'tribe': 2, 'small_group': 1}
        elif 'Invisible' in special_abilities or 'Phase' in special_abilities:
            # Sneaky creatures are often solitary
            social_weights = {'solitary': 3, 'pair': 2, 'family': 1}
        elif 'Pack tactics' in special_abilities:
            # Pack hunters
            social_weights = {'pack': 3, 'small_group': 2, 'band': 1}
        else:
            social_weights = {}
        
        # Get type-based options
        if monster_type in EncounterGenerator.TYPE_SOCIAL_STRUCTURE:
            type_data = EncounterGenerator.TYPE_SOCIAL_STRUCTURE[monster_type]
            
            if isinstance(type_data, dict):
                # Complex type with subtypes - choose randomly
                subtype_options = random.choice(list(type_data.values()))
            else:
                # Simple list
                subtype_options = type_data
                
            # Weight the options
            if not social_weights:
                return random.choice(subtype_options)
            else:
                # Prefer options that match abilities
                weighted_options = []
                for option in subtype_options:
                    weight = social_weights.get(option, 1)
                    weighted_options.extend([option] * weight)
                return random.choice(weighted_options)
        
        # Default fallback
        return random.choice(['solitary', 'pair', 'family', 'pack'])

    @staticmethod
    def _modify_dice_expression(dice_expr: str, multiplier: float) -> str:
        """Modify a dice expression by a multiplier"""
        if dice_expr == '1':
            return '1'
            
        # Simple modification - would need more complex parsing for full implementation
        if 'd' in dice_expr:
            if multiplier > 1.0:
                if '+' in dice_expr:
                    base, bonus = dice_expr.split('+')
                    new_bonus = int(int(bonus) * multiplier)
                    return f"{base}+{new_bonus}"
                else:
                    num_dice, die_size = dice_expr.split('d')
                    new_num_dice = max(1, int(int(num_dice) * multiplier))
                    return f"{new_num_dice}d{die_size}"
            elif multiplier < 1.0:
                # Reduce dice or add negative modifier
                if 'd' in dice_expr and int(dice_expr.split('d')[0]) > 1:
                    num_dice, die_size = dice_expr.split('d')
                    new_num_dice = max(1, int(int(num_dice) * multiplier))
                    return f"{new_num_dice}d{die_size}"
        
        return dice_expr

    @staticmethod
    def _get_environment_modifiers(environment: str) -> dict:
        """Get environment-specific modifiers"""
        modifiers = {
            'dungeon': {'lair_bonus': 20},
            'forest': {'lair_bonus': 10},
            'swamp': {'lair_bonus': 15},
            'mountain': {'lair_bonus': 25},
            'desert': {'lair_bonus': 5},
            'arctic': {'lair_bonus': 15},
            'coastal': {'lair_bonus': 10},
            'urban': {'lair_bonus': -10},
            'underground': {'lair_bonus': 30},
            'planar': {'lair_bonus': 0}
        }
        return modifiers.get(environment, {'lair_bonus': 0})