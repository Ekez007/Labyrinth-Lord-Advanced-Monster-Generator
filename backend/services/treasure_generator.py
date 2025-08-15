import random
from typing import Dict, List, Tuple
from models.monster import TreasureInfo

class TreasureGenerator:
    
    # Labyrinth Lord treasure type tables
    TREASURE_TYPES = {
        'A': {'coins': {'cp': (1000, 6000), 'sp': (1000, 6000), 'ep': (1000, 6000), 'gp': (1000, 6000), 'pp': (100, 600)}, 
              'gems': 60, 'jewelry': 50, 'magic': 30},
        'B': {'coins': {'cp': (1000, 8000), 'sp': (1000, 6000), 'ep': (1000, 4000), 'gp': (1000, 3000)}, 
              'gems': 30, 'jewelry': 25, 'magic': 10},
        'C': {'coins': {'cp': (1000, 12000), 'sp': (1000, 6000), 'ep': (1000, 4000)}, 
              'gems': 25, 'jewelry': 20, 'magic': 10},
        'D': {'coins': {'cp': (1000, 8000), 'sp': (1000, 12000), 'gp': (1000, 6000)}, 
              'gems': 15, 'jewelry': 10, 'magic': 15},
        'E': {'coins': {'cp': (1000, 10000), 'sp': (1000, 12000), 'ep': (1000, 4000), 'gp': (1000, 8000)}, 
              'gems': 10, 'jewelry': 5, 'magic': 25},
        'F': {'coins': {'sp': (2000, 20000), 'ep': (1000, 8000), 'gp': (1000, 10000), 'pp': (100, 800)}, 
              'gems': 20, 'jewelry': 10, 'magic': 30},
        'G': {'coins': {'gp': (1000, 4000), 'pp': (100, 400)}, 'gems': 35, 'jewelry': 25, 'magic': 35},
        'H': {'coins': {'cp': (5000, 30000), 'sp': (1000, 6000), 'ep': (1000, 6000), 'gp': (1000, 6000)}, 
              'gems': 50, 'jewelry': 50, 'magic': 15},
        'I': {'coins': {'pp': (200, 1200)}, 'gems': 30, 'jewelry': 50, 'magic': 15}
    }
    
    INDIVIDUAL_TREASURE = {
        '0': 'None',
        '1': 'P (1d6 cp)',
        '2': 'P (2d6 cp)',
        '3': 'P (3d6 cp, 10% 1d6 sp)',
        '4': 'Q (1d6 sp, 20% 1d4 gp)',
        '5': 'Q (2d6 sp, 30% 1d6 gp)',
        '6+': 'S (1d6 gp, 20% 1d4 pp)'
    }
    
    LAIR_TREASURE_BY_CR = {
        '0': 'P',
        '1': 'C',
        '2': 'C',
        '3': 'D',
        '4': 'D',
        '5': 'E',
        '6+': 'F'
    }

    GEM_VALUES = [10, 50, 100, 500, 1000, 5000]
    JEWELRY_VALUES = [100, 300, 1000, 2000, 3000, 5000]
    
    GEMS = [
        "Azurite", "Banded agate", "Blue quartz", "Eye agate", "Hematite", "Lapis lazuli",
        "Malachite", "Moss agate", "Obsidian", "Rhodochrosite", "Tiger eye", "Turquoise",
        "Bloodstone", "Carnelian", "Chalcedony", "Chrysoprase", "Citrine", "Jasper",
        "Moonstone", "Onyx", "Quartz", "Sardonyx", "Smoky quartz", "Zircon",
        "Amber", "Amethyst", "Chrysoberyl", "Coral", "Garnet", "Jade", "Jet",
        "Pearl", "Peridot", "Spinel", "Tourmaline", "Alexandrite", "Aquamarine",
        "Black pearl", "Blue spinel", "Emerald", "Fire opal", "Opal", "Ruby",
        "Sapphire", "Star ruby", "Star sapphire", "Topaz", "Black opal", "Diamond",
        "Jacinth", "Oriental amethyst", "Oriental emerald", "Oriental topaz"
    ]
    
    JEWELRY = [
        "Silver bracelet", "Gold ring", "Silver necklace", "Ornate dagger",
        "Gold bracelet", "Platinum ring", "Jeweled anklet", "Golden circlet",
        "Silver tiara", "Ornate belt", "Jeweled brooch", "Golden chain",
        "Platinum necklace", "Bejeweled crown", "Golden scepter", "Ornate chalice"
    ]

    @staticmethod
    def generate_individual_treasure(challenge_rating: str) -> TreasureInfo:
        """Generate individual monster treasure"""
        treasure_type = TreasureGenerator.INDIVIDUAL_TREASURE.get(challenge_rating, 'None')
        
        if treasure_type == 'None':
            return TreasureInfo(individual="None", lair="None", coins={})
        
        coins = {}
        if 'cp' in treasure_type:
            coins['cp'] = TreasureGenerator._roll_treasure_amount(treasure_type, 'cp')
        if 'sp' in treasure_type:
            coins['sp'] = TreasureGenerator._roll_treasure_amount(treasure_type, 'sp')
        if 'gp' in treasure_type:
            coins['gp'] = TreasureGenerator._roll_treasure_amount(treasure_type, 'gp')
        if 'pp' in treasure_type:
            coins['pp'] = TreasureGenerator._roll_treasure_amount(treasure_type, 'pp')
            
        return TreasureInfo(
            individual=treasure_type,
            lair="None",
            coins=coins
        )

    @staticmethod
    def generate_lair_treasure(challenge_rating: str, monster_type: str) -> TreasureInfo:
        """Generate lair treasure hoard"""
        base_treasure_type = TreasureGenerator.LAIR_TREASURE_BY_CR.get(challenge_rating, 'C')
        
        # Modify treasure type based on monster type
        treasure_type = TreasureGenerator._modify_treasure_by_type(base_treasure_type, monster_type)
        
        if treasure_type not in TreasureGenerator.TREASURE_TYPES:
            treasure_type = 'C'
            
        treasure_data = TreasureGenerator.TREASURE_TYPES[treasure_type]
        
        # Generate coins
        coins = {}
        for coin_type, (min_val, max_val) in treasure_data['coins'].items():
            if random.randint(1, 100) <= 60:  # 60% chance for each coin type
                coins[coin_type] = random.randint(min_val, max_val)
        
        # Generate gems
        gems = []
        if random.randint(1, 100) <= treasure_data['gems']:
            num_gems = random.randint(1, 4)
            for _ in range(num_gems):
                gem_value = random.choice(TreasureGenerator.GEM_VALUES)
                gem_name = random.choice(TreasureGenerator.GEMS)
                gems.append(f"{gem_name} ({gem_value} gp)")
        
        # Generate magic items (simplified)
        magic_items = []
        if random.randint(1, 100) <= treasure_data['magic']:
            num_items = random.randint(1, 2)
            magic_types = ["Potion", "Scroll", "Ring", "Wand", "Sword", "Armor", "Shield"]
            for _ in range(num_items):
                magic_items.append(f"Magic {random.choice(magic_types)}")
        
        return TreasureInfo(
            individual="None",
            lair=treasure_type,
            coins=coins,
            gems=gems,
            magicItems=magic_items
        )

    @staticmethod
    def _roll_treasure_amount(treasure_string: str, coin_type: str) -> int:
        """Parse treasure string and roll for amount"""
        # Simplified treasure rolling - would need more complex parsing in full implementation
        if coin_type == 'cp':
            return random.randint(1, 20)
        elif coin_type == 'sp':
            return random.randint(1, 12)
        elif coin_type == 'gp':
            return random.randint(1, 8)
        elif coin_type == 'pp':
            return random.randint(1, 4)
        return 0

    @staticmethod
    def _modify_treasure_by_type(base_type: str, monster_type: str) -> str:
        """Modify treasure type based on monster characteristics"""
        modifiers = {
            'dragon': 1,  # Dragons get better treasure
            'giant': 0,   # Giants get normal treasure
            'undead': -1, # Undead get worse treasure (but more coins)
            'beast': -1,  # Beasts get less treasure
            'humanoid': 0, # Humanoids get normal treasure
        }
        
        modifier = modifiers.get(monster_type, 0)
        
        treasure_order = ['P', 'Q', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'A', 'B']
        try:
            current_index = treasure_order.index(base_type)
            new_index = max(0, min(len(treasure_order) - 1, current_index + modifier))
            return treasure_order[new_index]
        except ValueError:
            return base_type