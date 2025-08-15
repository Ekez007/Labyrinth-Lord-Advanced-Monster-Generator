#!/usr/bin/env python3
"""
Comprehensive Backend API Tests for Labyrinth Lord Monster Generator
Tests all API endpoints with various scenarios and edge cases.
"""

import requests
import json
import sys
import os
from datetime import datetime

# Get the backend URL from frontend .env file
def get_backend_url():
    try:
        with open('/app/frontend/.env', 'r') as f:
            for line in f:
                if line.startswith('REACT_APP_BACKEND_URL='):
                    return line.split('=', 1)[1].strip()
    except FileNotFoundError:
        pass
    return "http://localhost:8001"

BASE_URL = get_backend_url()
API_URL = f"{BASE_URL}/api"

class MonsterAPITester:
    def __init__(self):
        self.passed_tests = 0
        self.failed_tests = 0
        self.test_results = []
        
    def log_test(self, test_name, passed, message="", response_data=None):
        """Log test result"""
        status = "✅ PASS" if passed else "❌ FAIL"
        print(f"{status}: {test_name}")
        if message:
            print(f"   {message}")
        if not passed and response_data:
            print(f"   Response: {response_data}")
        print()
        
        if passed:
            self.passed_tests += 1
        else:
            self.failed_tests += 1
            
        self.test_results.append({
            'test': test_name,
            'passed': passed,
            'message': message,
            'timestamp': datetime.now().isoformat()
        })
    
    def test_api_health(self):
        """Test basic API health endpoint"""
        print("🔍 Testing API Health...")
        try:
            response = requests.get(f"{API_URL}/", timeout=10)
            if response.status_code == 200:
                data = response.json()
                if "message" in data and "Labyrinth Lord" in data["message"]:
                    self.log_test("API Health Check", True, f"API is responding: {data['message']}")
                    return True
                else:
                    self.log_test("API Health Check", False, f"Unexpected response format: {data}")
            else:
                self.log_test("API Health Check", False, f"HTTP {response.status_code}: {response.text}")
        except Exception as e:
            self.log_test("API Health Check", False, f"Connection error: {str(e)}")
        return False
    
    def test_monster_generation_default(self):
        """Test default monster generation"""
        print("🔍 Testing Default Monster Generation...")
        try:
            payload = {
                "filters": {
                    "challengeRating": "any",
                    "type": "any", 
                    "environment": "any",
                    "count": 1
                },
                "algorithm": "balanced",
                "complexity": "moderate",
                "includeTreasure": True,
                "includeLair": True
            }
            
            response = requests.post(f"{API_URL}/monsters/generate", json=payload, timeout=15)
            
            if response.status_code == 200:
                data = response.json()
                if "monsters" in data and len(data["monsters"]) == 1:
                    monster = data["monsters"][0]
                    required_fields = ["id", "name", "type", "challengeRating", "environment", "stats", "description", "specialAbilities", "encounters", "treasure", "lair"]
                    
                    missing_fields = [field for field in required_fields if field not in monster]
                    if not missing_fields:
                        # Validate monster structure
                        stats_valid = all(key in monster["stats"] for key in ["ac", "hd", "hp", "movement", "attacks", "damage", "save", "morale", "xp"])
                        treasure_valid = all(key in monster["treasure"] for key in ["individual", "lair"])
                        lair_valid = all(key in monster["lair"] for key in ["description", "terrain", "size", "defenses"])
                        encounters_valid = all(key in monster["encounters"] for key in ["numberAppearing", "wildEncounter", "lairChance"])
                        
                        if stats_valid and treasure_valid and lair_valid and encounters_valid:
                            self.log_test("Default Monster Generation", True, f"Generated monster: {monster['name']} (CR {monster['challengeRating']})")
                            return monster
                        else:
                            self.log_test("Default Monster Generation", False, "Monster structure incomplete")
                    else:
                        self.log_test("Default Monster Generation", False, f"Missing fields: {missing_fields}")
                else:
                    self.log_test("Default Monster Generation", False, f"Expected 1 monster, got: {data}")
            else:
                self.log_test("Default Monster Generation", False, f"HTTP {response.status_code}: {response.text}")
        except Exception as e:
            self.log_test("Default Monster Generation", False, f"Error: {str(e)}")
        return None
    
    def test_monster_generation_specific_cr(self):
        """Test monster generation with specific challenge rating"""
        print("🔍 Testing Monster Generation with Specific CR...")
        try:
            payload = {
                "filters": {
                    "challengeRating": "3",
                    "type": "any",
                    "environment": "any", 
                    "count": 1
                },
                "algorithm": "balanced",
                "complexity": "moderate",
                "includeTreasure": True,
                "includeLair": True
            }
            
            response = requests.post(f"{API_URL}/monsters/generate", json=payload, timeout=15)
            
            if response.status_code == 200:
                data = response.json()
                if "monsters" in data and len(data["monsters"]) == 1:
                    monster = data["monsters"][0]
                    if monster["challengeRating"] == "3":
                        self.log_test("Specific CR Generation", True, f"Generated CR 3 monster: {monster['name']}")
                        return monster
                    else:
                        self.log_test("Specific CR Generation", False, f"Expected CR 3, got CR {monster['challengeRating']}")
                else:
                    self.log_test("Specific CR Generation", False, f"Unexpected response: {data}")
            else:
                self.log_test("Specific CR Generation", False, f"HTTP {response.status_code}: {response.text}")
        except Exception as e:
            self.log_test("Specific CR Generation", False, f"Error: {str(e)}")
        return None
    
    def test_monster_generation_specific_type(self):
        """Test monster generation with specific type"""
        print("🔍 Testing Monster Generation with Specific Type...")
        try:
            payload = {
                "filters": {
                    "challengeRating": "any",
                    "type": "dragon",
                    "environment": "any",
                    "count": 1
                },
                "algorithm": "balanced", 
                "complexity": "moderate",
                "includeTreasure": True,
                "includeLair": True
            }
            
            response = requests.post(f"{API_URL}/monsters/generate", json=payload, timeout=15)
            
            if response.status_code == 200:
                data = response.json()
                if "monsters" in data and len(data["monsters"]) == 1:
                    monster = data["monsters"][0]
                    if monster["type"] == "dragon":
                        self.log_test("Specific Type Generation", True, f"Generated dragon: {monster['name']}")
                        return monster
                    else:
                        self.log_test("Specific Type Generation", False, f"Expected dragon, got {monster['type']}")
                else:
                    self.log_test("Specific Type Generation", False, f"Unexpected response: {data}")
            else:
                self.log_test("Specific Type Generation", False, f"HTTP {response.status_code}: {response.text}")
        except Exception as e:
            self.log_test("Specific Type Generation", False, f"Error: {str(e)}")
        return None
    
    def test_monster_generation_multiple(self):
        """Test generating multiple monsters"""
        print("🔍 Testing Multiple Monster Generation...")
        try:
            payload = {
                "filters": {
                    "challengeRating": "any",
                    "type": "any",
                    "environment": "any",
                    "count": 3
                },
                "algorithm": "balanced",
                "complexity": "moderate", 
                "includeTreasure": True,
                "includeLair": True
            }
            
            response = requests.post(f"{API_URL}/monsters/generate", json=payload, timeout=20)
            
            if response.status_code == 200:
                data = response.json()
                if "monsters" in data and len(data["monsters"]) == 3:
                    monster_names = [m["name"] for m in data["monsters"]]
                    self.log_test("Multiple Monster Generation", True, f"Generated 3 monsters: {', '.join(monster_names)}")
                    return data["monsters"]
                else:
                    self.log_test("Multiple Monster Generation", False, f"Expected 3 monsters, got {len(data.get('monsters', []))}")
            else:
                self.log_test("Multiple Monster Generation", False, f"HTTP {response.status_code}: {response.text}")
        except Exception as e:
            self.log_test("Multiple Monster Generation", False, f"Error: {str(e)}")
        return None
    
    def test_advanced_generation_features(self):
        """Test advanced generation with treasure and lair features"""
        print("🔍 Testing Advanced Generation Features...")
        try:
            payload = {
                "filters": {
                    "challengeRating": "5",
                    "type": "dragon",
                    "environment": "mountain",
                    "count": 1
                },
                "algorithm": "complex",
                "complexity": "complex",
                "includeTreasure": True,
                "includeLair": True
            }
            
            response = requests.post(f"{API_URL}/monsters/generate", json=payload, timeout=15)
            
            if response.status_code == 200:
                data = response.json()
                if "monsters" in data and len(data["monsters"]) == 1:
                    monster = data["monsters"][0]
                    
                    # Check treasure generation
                    treasure = monster.get("treasure", {})
                    has_treasure = treasure.get("lair") != "None" or treasure.get("individual") != "None"
                    
                    # Check lair generation
                    lair = monster.get("lair", {})
                    has_lair = lair.get("description") != "No fixed lair" and len(lair.get("defenses", [])) > 0
                    
                    # Check encounter info
                    encounters = monster.get("encounters", {})
                    has_encounters = all(key in encounters for key in ["numberAppearing", "wildEncounter", "lairChance"])
                    
                    # Check special abilities
                    abilities = monster.get("specialAbilities", [])
                    has_abilities = len(abilities) > 0
                    
                    if has_treasure and has_lair and has_encounters and has_abilities:
                        self.log_test("Advanced Generation Features", True, 
                                    f"Generated advanced {monster['name']} with treasure, lair, encounters, and {len(abilities)} abilities")
                        return monster
                    else:
                        missing = []
                        if not has_treasure: missing.append("treasure")
                        if not has_lair: missing.append("lair")
                        if not has_encounters: missing.append("encounters")
                        if not has_abilities: missing.append("abilities")
                        self.log_test("Advanced Generation Features", False, f"Missing advanced features: {', '.join(missing)}")
                else:
                    self.log_test("Advanced Generation Features", False, f"Unexpected response: {data}")
            else:
                self.log_test("Advanced Generation Features", False, f"HTTP {response.status_code}: {response.text}")
        except Exception as e:
            self.log_test("Advanced Generation Features", False, f"Error: {str(e)}")
        return None
    
    def test_monster_saving(self, monster=None):
        """Test saving a monster"""
        print("🔍 Testing Monster Saving...")
        
        # Generate a monster if none provided
        if not monster:
            monster = self.test_monster_generation_default()
            if not monster:
                self.log_test("Monster Saving", False, "Could not generate monster to save")
                return None
        
        try:
            payload = {
                "monster": monster,
                "libraryId": None
            }
            
            response = requests.post(f"{API_URL}/monsters/save", json=payload, timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if data.get("success") and "monsterId" in data:
                    self.log_test("Monster Saving", True, f"Saved monster with ID: {data['monsterId']}")
                    return data["monsterId"]
                else:
                    self.log_test("Monster Saving", False, f"Unexpected response: {data}")
            else:
                self.log_test("Monster Saving", False, f"HTTP {response.status_code}: {response.text}")
        except Exception as e:
            self.log_test("Monster Saving", False, f"Error: {str(e)}")
        return None
    
    def test_monster_collection(self):
        """Test getting monster collection"""
        print("🔍 Testing Monster Collection...")
        try:
            response = requests.get(f"{API_URL}/monsters/my-collection", timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if "monsters" in data and "totalCount" in data and "libraries" in data:
                    total_count = data["totalCount"]
                    monsters_count = len(data["monsters"])
                    libraries_count = len(data["libraries"])
                    
                    self.log_test("Monster Collection", True, 
                                f"Retrieved collection: {monsters_count} monsters, {libraries_count} libraries (total: {total_count})")
                    return data
                else:
                    self.log_test("Monster Collection", False, f"Unexpected response format: {data}")
            else:
                self.log_test("Monster Collection", False, f"HTTP {response.status_code}: {response.text}")
        except Exception as e:
            self.log_test("Monster Collection", False, f"Error: {str(e)}")
        return None
    
    def test_monster_libraries(self):
        """Test getting monster libraries"""
        print("🔍 Testing Monster Libraries...")
        try:
            response = requests.get(f"{API_URL}/monsters/libraries", timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if "libraries" in data:
                    libraries = data["libraries"]
                    if len(libraries) > 0:
                        library_names = [lib["name"] for lib in libraries]
                        self.log_test("Monster Libraries", True, f"Retrieved {len(libraries)} libraries: {', '.join(library_names)}")
                    else:
                        self.log_test("Monster Libraries", True, "No libraries found (expected for new system)")
                    return data
                else:
                    self.log_test("Monster Libraries", False, f"Unexpected response format: {data}")
            else:
                self.log_test("Monster Libraries", False, f"HTTP {response.status_code}: {response.text}")
        except Exception as e:
            self.log_test("Monster Libraries", False, f"Error: {str(e)}")
        return None
    
    def test_monster_stats(self):
        """Test getting generation statistics"""
        print("🔍 Testing Monster Statistics...")
        try:
            response = requests.get(f"{API_URL}/monsters/stats", timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                required_stats = ["totalGenerated", "totalSaved", "totalShared"]
                if all(stat in data for stat in required_stats):
                    self.log_test("Monster Statistics", True, 
                                f"Stats - Generated: {data['totalGenerated']}, Saved: {data['totalSaved']}, Shared: {data['totalShared']}")
                    return data
                else:
                    missing_stats = [stat for stat in required_stats if stat not in data]
                    self.log_test("Monster Statistics", False, f"Missing stats: {missing_stats}")
            else:
                self.log_test("Monster Statistics", False, f"HTTP {response.status_code}: {response.text}")
        except Exception as e:
            self.log_test("Monster Statistics", False, f"Error: {str(e)}")
        return None
    
    def test_treasure_generation_validation(self):
        """Test that treasure generation is working properly"""
        print("🔍 Testing Treasure Generation Validation...")
        try:
            payload = {
                "filters": {
                    "challengeRating": "4",
                    "type": "dragon",
                    "environment": "mountain",
                    "count": 1
                },
                "algorithm": "balanced",
                "complexity": "complex",
                "includeTreasure": True,
                "includeLair": True
            }
            
            response = requests.post(f"{API_URL}/monsters/generate", json=payload, timeout=15)
            
            if response.status_code == 200:
                data = response.json()
                monster = data["monsters"][0]
                treasure = monster["treasure"]
                
                # Check treasure structure
                has_coins = bool(treasure.get("coins"))
                has_gems = bool(treasure.get("gems"))
                has_magic = bool(treasure.get("magicItems"))
                lair_treasure = treasure.get("lair", "None") != "None"
                
                treasure_features = []
                if has_coins: treasure_features.append("coins")
                if has_gems: treasure_features.append("gems") 
                if has_magic: treasure_features.append("magic items")
                if lair_treasure: treasure_features.append("lair treasure")
                
                if treasure_features:
                    self.log_test("Treasure Generation Validation", True, 
                                f"Treasure includes: {', '.join(treasure_features)}")
                    return True
                else:
                    self.log_test("Treasure Generation Validation", False, "No treasure features generated")
            else:
                self.log_test("Treasure Generation Validation", False, f"HTTP {response.status_code}: {response.text}")
        except Exception as e:
            self.log_test("Treasure Generation Validation", False, f"Error: {str(e)}")
        return False
    
    def test_lair_generation_validation(self):
        """Test that lair generation is working properly"""
        print("🔍 Testing Lair Generation Validation...")
        try:
            payload = {
                "filters": {
                    "challengeRating": "5",
                    "type": "dragon",
                    "environment": "mountain",
                    "count": 1
                },
                "algorithm": "balanced",
                "complexity": "complex",
                "includeTreasure": True,
                "includeLair": True
            }
            
            response = requests.post(f"{API_URL}/monsters/generate", json=payload, timeout=15)
            
            if response.status_code == 200:
                data = response.json()
                monster = data["monsters"][0]
                lair = monster["lair"]
                
                # Check lair structure
                has_description = lair.get("description", "No fixed lair") != "No fixed lair"
                has_terrain = bool(lair.get("terrain"))
                has_size = bool(lair.get("size"))
                has_defenses = len(lair.get("defenses", [])) > 0
                has_features = len(lair.get("features", [])) > 0
                
                lair_components = []
                if has_description: lair_components.append("description")
                if has_terrain: lair_components.append("terrain")
                if has_size: lair_components.append("size")
                if has_defenses: lair_components.append(f"{len(lair['defenses'])} defenses")
                if has_features: lair_components.append(f"{len(lair['features'])} features")
                
                if len(lair_components) >= 3:  # At least description, terrain, size
                    self.log_test("Lair Generation Validation", True, 
                                f"Lair includes: {', '.join(lair_components)}")
                    return True
                else:
                    self.log_test("Lair Generation Validation", False, f"Incomplete lair: {', '.join(lair_components)}")
            else:
                self.log_test("Lair Generation Validation", False, f"HTTP {response.status_code}: {response.text}")
        except Exception as e:
            self.log_test("Lair Generation Validation", False, f"Error: {str(e)}")
        return False
    
    def run_all_tests(self):
        """Run all tests in sequence"""
        print("🚀 Starting Labyrinth Lord Monster Generator Backend API Tests")
        print(f"🌐 Testing against: {API_URL}")
        print("=" * 80)
        
        # Test API health first
        if not self.test_api_health():
            print("❌ API is not responding. Stopping tests.")
            return False
        
        # Core generation tests
        default_monster = self.test_monster_generation_default()
        self.test_monster_generation_specific_cr()
        self.test_monster_generation_specific_type()
        self.test_monster_generation_multiple()
        
        # Advanced feature tests
        self.test_advanced_generation_features()
        self.test_treasure_generation_validation()
        self.test_lair_generation_validation()
        
        # Database operation tests
        self.test_monster_saving(default_monster)
        self.test_monster_collection()
        self.test_monster_libraries()
        self.test_monster_stats()
        
        # Print summary
        print("=" * 80)
        print("📊 TEST SUMMARY")
        print(f"✅ Passed: {self.passed_tests}")
        print(f"❌ Failed: {self.failed_tests}")
        print(f"📈 Success Rate: {(self.passed_tests / (self.passed_tests + self.failed_tests) * 100):.1f}%")
        
        if self.failed_tests > 0:
            print("\n❌ FAILED TESTS:")
            for result in self.test_results:
                if not result['passed']:
                    print(f"   • {result['test']}: {result['message']}")
        
        return self.failed_tests == 0

if __name__ == "__main__":
    tester = MonsterAPITester()
    success = tester.run_all_tests()
    sys.exit(0 if success else 1)