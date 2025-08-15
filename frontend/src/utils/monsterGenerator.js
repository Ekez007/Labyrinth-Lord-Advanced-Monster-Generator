import { 
  monsterTemplates, 
  monsterTypes, 
  environments, 
  specialAbilities, 
  namePrefixes, 
  nameRoots, 
  descriptors 
} from '../data/mockMonsters';

// Utility functions for random generation
const randomChoice = (array) => array[Math.floor(Math.random() * array.length)];
const randomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const rollDice = (sides, count = 1) => {
  let total = 0;
  for (let i = 0; i < count; i++) {
    total += randomNumber(1, sides);
  }
  return total;
};

// Generate HP from HD string
const generateHP = (hdString) => {
  const match = hdString.match(/(\d+)([+-]\d+)?/);
  if (!match) return 4; // fallback
  
  const dice = parseInt(match[1]);
  const modifier = match[2] ? parseInt(match[2]) : 0;
  return rollDice(8, dice) + modifier;
};

// Generate XP based on challenge rating
const generateXP = (cr) => {
  const xpTable = {
    '0': 5,
    '1': randomNumber(10, 25),
    '2': randomNumber(20, 50),
    '3': randomNumber(35, 75),
    '4': randomNumber(50, 125),
    '5': randomNumber(75, 175),
    '6+': randomNumber(100, 300)
  };
  return xpTable[cr] || 10;
};

// Generate random monster name
const generateMonsterName = (type) => {
  const usePrefix = Math.random() > 0.4;
  const prefix = usePrefix ? randomChoice(namePrefixes) + " " : "";
  
  // Type-specific base names
  const typeNames = {
    beast: ["Wolf", "Bear", "Spider", "Boar", "Eagle", "Serpent", "Lizard", "Rat"],
    undead: ["Skeleton", "Zombie", "Wraith", "Specter", "Ghoul", "Wight", "Shade", "Phantom"],
    humanoid: ["Goblin", "Orc", "Hobgoblin", "Kobold", "Gnoll", "Bugbear", "Troll", "Giant"],
    dragon: ["Drake", "Wyvern", "Dragon", "Wyrm", "Dragonling", "Serpent"],
    fey: ["Sprite", "Pixie", "Dryad", "Satyr", "Brownie", "Will-o'-wisp"],
    fiend: ["Demon", "Devil", "Imp", "Quasit", "Hellhound", "Incubus"],
    construct: ["Golem", "Automaton", "Guardian", "Sentinel", "Statue"],
    elemental: ["Elemental", "Mephit", "Salamander", "Sylph", "Gnome"],
    giant: ["Giant", "Ogre", "Troll", "Ettin", "Cyclops", "Titan"],
    aberration: ["Ooze", "Cube", "Horror", "Aberration", "Monstrosity", "Anomaly"]
  };
  
  const baseName = randomChoice(typeNames[type] || typeNames.beast);
  const useSuffix = Math.random() > 0.6;
  const suffix = useSuffix ? " " + randomChoice(nameRoots) : "";
  
  return prefix + baseName + suffix;
};

// Generate monster description
const generateDescription = (monster) => {
  const descriptor1 = randomChoice(descriptors);
  const descriptor2 = randomChoice(descriptors);
  
  const templates = [
    `A ${descriptor1} creature that stalks the ${monster.environment}. This ${monster.type} is known for its ${descriptor2} nature and unpredictable behavior.`,
    `These ${descriptor1} beings are commonly found in ${monster.environment} regions. They are ${descriptor2} hunters that strike fear into travelers.`,
    `A ${descriptor2} ${monster.type} that makes its home in the ${monster.environment}. Local legends speak of its ${descriptor1} appetite and cunning intelligence.`,
    `This ${descriptor1} monstrosity haunts the ${monster.environment}, preying on the unwary. Its ${descriptor2} reputation is well-earned through countless encounters.`
  ];
  
  return randomChoice(templates);
};

// Filter monsters based on criteria
const filterMonsters = (filters) => {
  return monsterTemplates.filter(monster => {
    if (filters.challengeRating !== 'any' && monster.challengeRating !== filters.challengeRating) {
      if (filters.challengeRating !== '6+' || parseInt(monster.challengeRating) < 6) {
        return false;
      }
    }
    if (filters.type !== 'any' && monster.type !== filters.type) return false;
    if (filters.environment !== 'any' && monster.environment !== filters.environment) return false;
    return true;
  });
};

// Generate completely random monster
const generateRandomMonster = (filters = {}) => {
  const cr = filters.challengeRating !== 'any' ? filters.challengeRating : randomChoice(['0', '1', '2', '3', '4', '5']);
  const type = filters.type !== 'any' ? filters.type : randomChoice(monsterTypes);
  const environment = filters.environment !== 'any' ? filters.environment : randomChoice(environments);
  
  // Base stats based on CR
  const crStats = {
    '0': { ac: randomNumber(8, 10), hd: '1-1', baseHP: 2, attacks: '1', save: 'Normal Human', morale: randomNumber(5, 7) },
    '1': { ac: randomNumber(6, 8), hd: '1', baseHP: 4, attacks: '1', save: 'Fighter 1', morale: randomNumber(6, 8) },
    '2': { ac: randomNumber(5, 7), hd: '2', baseHP: 9, attacks: '1', save: 'Fighter 1', morale: randomNumber(7, 9) },
    '3': { ac: randomNumber(4, 6), hd: '3', baseHP: 13, attacks: '1-2', save: 'Fighter 2', morale: randomNumber(8, 10) },
    '4': { ac: randomNumber(3, 5), hd: '4', baseHP: 18, attacks: '2', save: 'Fighter 2', morale: randomNumber(8, 11) },
    '5': { ac: randomNumber(2, 4), hd: '5', baseHP: 22, attacks: '2', save: 'Fighter 3', morale: randomNumber(9, 12) },
    '6+': { ac: randomNumber(0, 3), hd: '6+', baseHP: 27, attacks: '2-3', save: 'Fighter 4', morale: randomNumber(10, 12) }
  };
  
  const stats = crStats[cr] || crStats['1'];
  const name = generateMonsterName(type);
  
  // Generate abilities (1-4 abilities)
  const numAbilities = randomNumber(1, Math.min(4, parseInt(cr) + 2));
  const monsterAbilities = [];
  for (let i = 0; i < numAbilities; i++) {
    const ability = randomChoice(specialAbilities);
    if (!monsterAbilities.includes(ability)) {
      monsterAbilities.push(ability);
    }
  }
  
  // Generate damage based on CR and type
  const damageTable = {
    '0': '1d4',
    '1': '1d6',
    '2': '1d8',
    '3': '2d4',
    '4': '1d10',
    '5': '2d6',
    '6+': '2d8'
  };
  
  const monster = {
    name,
    type,
    challengeRating: cr,
    environment,
    ac: stats.ac,
    hd: stats.hd,
    hp: generateHP(stats.hd) || stats.baseHP,
    movement: `${randomNumber(60, 150)}'(${randomNumber(20, 50)}')`,
    attacks: stats.attacks + ' attack' + (stats.attacks.includes('2') ? 's' : ''),
    damage: damageTable[cr] || '1d6',
    save: stats.save,
    morale: stats.morale,
    xp: generateXP(cr),
    description: '',
    specialAbilities: monsterAbilities
  };
  
  monster.description = generateDescription(monster);
  return monster;
};

// Main generation function
export const generateMonsters = (filters) => {
  const { count = 1, ...otherFilters } = filters;
  const monsters = [];
  
  for (let i = 0; i < count; i++) {
    // 70% chance to use template, 30% chance for completely random
    if (Math.random() > 0.3) {
      const availableTemplates = filterMonsters(otherFilters);
      if (availableTemplates.length > 0) {
        const template = randomChoice(availableTemplates);
        // Add some variation to template
        const monster = {
          ...template,
          hp: generateHP(template.hd),
          xp: generateXP(template.challengeRating)
        };
        monsters.push(monster);
      } else {
        monsters.push(generateRandomMonster(otherFilters));
      }
    } else {
      monsters.push(generateRandomMonster(otherFilters));
    }
  }
  
  return monsters;
};