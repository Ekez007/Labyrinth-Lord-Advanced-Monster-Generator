// Mock data for Labyrinth Lord monsters
export const monsterTemplates = [
  {
    name: "Goblin Warrior",
    type: "humanoid",
    challengeRating: "1",
    environment: "dungeon",
    ac: 6,
    hd: "1-1",
    hp: 3,
    movement: "60' (20')",
    attacks: "1 weapon",
    damage: "1d6 or by weapon",
    save: "Normal Human",
    morale: 7,
    xp: 5,
    description: "Small, malicious humanoids with yellow eyes and cruel expressions. They favor ambush tactics and overwhelming numbers. Goblins are cowardly but cunning, often serving more powerful creatures.",
    specialAbilities: ["Infravision 60'", "Sunlight Penalty -1"]
  },
  {
    name: "Orc Berserker",
    type: "humanoid",
    challengeRating: "1",
    environment: "dungeon",
    ac: 6,
    hd: "1",
    hp: 4,
    movement: "120' (40')",
    attacks: "1 weapon",
    damage: "1d8 or by weapon",
    save: "Fighter 1",
    morale: 8,
    xp: 10,
    description: "Brutish humanoids with pig-like features and a taste for violence. They live in tribes and raid civilized lands for plunder and slaves. In battle, they fight with savage fury.",
    specialAbilities: ["Infravision 60'", "Berserker Rage +2 to hit"]
  },
  {
    name: "Skeleton Guard",
    type: "undead",
    challengeRating: "1",
    environment: "dungeon",
    ac: 7,
    hd: "1",
    hp: 4,
    movement: "60' (20')",
    attacks: "1 weapon",
    damage: "1d6 or by weapon",
    save: "Fighter 1",
    morale: 12,
    xp: 10,
    description: "Animated bones of long-dead warriors, held together by dark magic. They guard ancient tombs and follow simple commands from their creators. Fearless and relentless in combat.",
    specialAbilities: ["Immune to sleep/charm", "Only damaged by magic weapons", "Sharp weapons do half damage"]
  },
  {
    name: "Giant Spider",
    type: "beast",
    challengeRating: "2",
    environment: "forest",
    ac: 6,
    hd: "2+2",
    hp: 11,
    movement: "120' (40') / Web 60' (20')",
    attacks: "1 bite",
    damage: "1d6 + poison",
    save: "Fighter 1",
    morale: 7,
    xp: 20,
    description: "Massive arachnids with bodies the size of dogs. They spin thick webs in dark corners and caves, waiting to ambush prey. Their bite injects a paralyzing venom.",
    specialAbilities: ["Web", "Poison (save or paralyzed 2d4 turns)", "Climb walls"]
  },
  {
    name: "Ogre Brute",
    type: "giant",
    challengeRating: "4",
    environment: "mountain",
    ac: 5,
    hd: "4+1",
    hp: 19,
    movement: "90' (30')",
    attacks: "1 weapon",
    damage: "1d10 or by weapon +2",
    save: "Fighter 4",
    morale: 10,
    xp: 75,
    description: "Huge, brutish humanoids standing 8-10 feet tall. They are dim-witted but incredibly strong, wielding massive clubs and wearing crude armor. They often serve as muscle for other creatures.",
    specialAbilities: ["Great strength +2 damage", "Infravision 60'"]
  },
  {
    name: "Zombie Shambler",
    type: "undead",
    challengeRating: "2",
    environment: "swamp",
    ac: 8,
    hd: "2",
    hp: 9,
    movement: "60' (20')",
    attacks: "1 fist",
    damage: "1d8",
    save: "Fighter 1",
    morale: 12,
    xp: 20,
    description: "Reanimated corpses that shamble forward with relentless hunger. They are slow but persistent, immune to most effects that target the living mind.",
    specialAbilities: ["Immune to sleep/charm", "Always lose initiative", "Immune to fear"]
  },
  {
    name: "Fire Beetle",
    type: "beast",
    challengeRating: "1",
    environment: "underground",
    ac: 4,
    hd: "1+2",
    hp: 6,
    movement: "120' (40')",
    attacks: "1 bite",
    damage: "2d4",
    save: "Fighter 1",
    morale: 7,
    xp: 15,
    description: "Large beetles with bioluminescent glands that glow with red light. They are surprisingly aggressive and their mandibles can crush bones. Valued for their light-producing organs.",
    specialAbilities: ["Light glands (10' radius)", "No damage from fire"]
  },
  {
    name: "Dire Wolf",
    type: "beast",
    challengeRating: "3",
    environment: "forest",
    ac: 6,
    hd: "3+3",
    hp: 16,
    movement: "150' (50')",
    attacks: "1 bite",
    damage: "2d4",
    save: "Fighter 2",
    morale: 8,
    xp: 50,
    description: "Enormous wolves with intelligence bordering on human-level cunning. They hunt in packs and are often companions to rangers or druids. Their howl can be heard for miles.",
    specialAbilities: ["Pack tactics", "Keen scent", "Howl summons other wolves"]
  },
  {
    name: "Gelatinous Cube",
    type: "aberration",
    challengeRating: "4",
    environment: "dungeon",
    ac: 8,
    hd: "4",
    hp: 18,
    movement: "60' (20')",
    attacks: "1 touch",
    damage: "2d4 + paralysis",
    save: "Fighter 2",
    morale: 12,
    xp: 75,
    description: "A translucent cube of acidic protoplasm that fills entire dungeon corridors. It slowly digests organic matter, leaving behind treasure and bones of previous victims.",
    specialAbilities: ["Paralysis (save or paralyzed 2d4 turns)", "Immune to cold/lightning", "Transparent", "Engulf"]
  },
  {
    name: "Hobgoblin Captain",
    type: "humanoid",
    challengeRating: "2",
    environment: "dungeon",
    ac: 5,
    hd: "1+1",
    hp: 6,
    movement: "90' (30')",
    attacks: "1 weapon",
    damage: "1d8 or by weapon",
    save: "Fighter 1",
    morale: 9,
    xp: 15,
    description: "Larger and more disciplined cousins of goblins. They are militaristic by nature, organizing into strict hierarchies and employing battlefield tactics. This captain leads lesser goblinoids.",
    specialAbilities: ["Infravision 60'", "Leadership (nearby goblins +1 morale)"]
  }
];

export const monsterTypes = ["beast", "undead", "humanoid", "dragon", "fey", "fiend", "construct", "elemental", "giant", "aberration"];
export const environments = ["dungeon", "forest", "swamp", "mountain", "desert", "arctic", "coastal", "urban", "underground", "planar"];
export const challengeRatings = ["0", "1", "2", "3", "4", "5", "6+"];

export const specialAbilities = [
  "Infravision 60'", "Infravision 90'", "Immune to sleep/charm", "Poison immunity", "Fire immunity", "Cold immunity",
  "Lightning immunity", "Magic resistance", "Spell turning", "Regeneration", "Flight", "Burrow", "Swim", "Climb walls",
  "Web", "Paralysis", "Charm", "Fear aura", "Death gaze", "Breath weapon", "Spellcasting", "Pack tactics",
  "Berserker rage", "Leadership", "Keen scent", "Tracking", "Invisible", "Phase", "Teleport", "Shapeshifting"
];

export const namePrefixes = [
  "Ancient", "Dire", "Giant", "Lesser", "Greater", "Elder", "Young", "Feral", "Savage", "Wild",
  "Shadow", "Frost", "Fire", "Stone", "Iron", "Blood", "Death", "Bone", "Dark", "Pale"
];

export const nameRoots = [
  "Fang", "Claw", "Horn", "Wing", "Eye", "Maw", "Stalker", "Hunter", "Reaper", "Slayer",
  "Beast", "Fiend", "Wraith", "Shade", "Spirit", "Guardian", "Warden", "Sentinel", "Keeper", "Lord"
];

export const descriptors = [
  "malevolent", "cunning", "brutal", "savage", "ancient", "mysterious", "terrifying", "relentless",
  "crafty", "vicious", "deadly", "fearsome", "monstrous", "otherworldly", "predatory", "aggressive"
];