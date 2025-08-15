import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Separator } from './ui/separator';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import { Dice6, Shuffle, Zap, Settings, ChevronDown, ChevronUp, Coins, Home } from 'lucide-react';

const GenerationControls = ({ onGenerate, isGenerating }) => {
  const [filters, setFilters] = useState({
    challengeRating: 'any',
    type: 'any',
    environment: 'any',
    count: 1
  });

  const [advancedSettings, setAdvancedSettings] = useState({
    algorithm: 'balanced',
    complexity: 'moderate',
    includeTreasure: true,
    includeLair: true,
    customRules: {}
  });

  const [showAdvanced, setShowAdvanced] = useState(false);

  const challengeRatings = [
    { value: 'any', label: 'Any CR' },
    { value: '0', label: 'CR 0' },
    { value: '1', label: 'CR 1' },
    { value: '2', label: 'CR 2' },
    { value: '3', label: 'CR 3' },
    { value: '4', label: 'CR 4' },
    { value: '5', label: 'CR 5' },
    { value: '6+', label: 'CR 6+' }
  ];

  const monsterTypes = [
    { value: 'any', label: 'Any Type' },
    { value: 'beast', label: 'Beast' },
    { value: 'undead', label: 'Undead' },
    { value: 'humanoid', label: 'Humanoid' },
    { value: 'dragon', label: 'Dragon' },
    { value: 'fey', label: 'Fey' },
    { value: 'fiend', label: 'Fiend' },
    { value: 'construct', label: 'Construct' },
    { value: 'elemental', label: 'Elemental' },
    { value: 'giant', label: 'Giant' },
    { value: 'aberration', label: 'Aberration' }
  ];

  const environments = [
    { value: 'any', label: 'Any Environment' },
    { value: 'dungeon', label: 'Dungeon' },
    { value: 'forest', label: 'Forest' },
    { value: 'swamp', label: 'Swamp' },
    { value: 'mountain', label: 'Mountain' },
    { value: 'desert', label: 'Desert' },
    { value: 'arctic', label: 'Arctic' },
    { value: 'coastal', label: 'Coastal' },
    { value: 'urban', label: 'Urban' },
    { value: 'underground', label: 'Underground' },
    { value: 'planar', label: 'Planar' }
  ];

  const algorithms = [
    { value: 'balanced', label: 'Balanced', description: '70% templates, 30% random' },
    { value: 'template-based', label: 'Template-Based', description: 'Based on existing monsters' },
    { value: 'random', label: 'Random', description: 'Completely procedural' }
  ];

  const complexityLevels = [
    { value: 'simple', label: 'Simple', description: 'Basic stats and abilities' },
    { value: 'moderate', label: 'Moderate', description: 'Standard complexity' },
    { value: 'complex', label: 'Complex', description: 'Advanced features and abilities' }
  ];

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleAdvancedChange = (key, value) => {
    setAdvancedSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleGenerate = () => {
    const request = {
      filters,
      ...advancedSettings
    };
    onGenerate(request);
  };

  const handleRandomAll = () => {
    const randomFilters = {
      challengeRating: challengeRatings[Math.floor(Math.random() * challengeRatings.length)].value,
      type: monsterTypes[Math.floor(Math.random() * monsterTypes.length)].value,
      environment: environments[Math.floor(Math.random() * environments.length)].value,
      count: Math.floor(Math.random() * 3) + 1
    };
    
    const randomAdvanced = {
      algorithm: algorithms[Math.floor(Math.random() * algorithms.length)].value,
      complexity: complexityLevels[Math.floor(Math.random() * complexityLevels.length)].value,
      includeTreasure: Math.random() > 0.3,
      includeLair: Math.random() > 0.3,
      customRules: {}
    };

    setFilters(randomFilters);
    setAdvancedSettings(randomAdvanced);
    
    const request = {
      filters: randomFilters,
      ...randomAdvanced
    };
    onGenerate(request);
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-slate-800">
          <Dice6 className="w-5 h-5 text-emerald-600" />
          Monster Generator
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Basic Filters */}
        <div className="space-y-3">
          <div>
            <Label htmlFor="challenge-rating" className="text-sm font-medium text-slate-700">
              Challenge Rating
            </Label>
            <Select value={filters.challengeRating} onValueChange={(value) => handleFilterChange('challengeRating', value)}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select CR" />
              </SelectTrigger>
              <SelectContent>
                {challengeRatings.map((cr) => (
                  <SelectItem key={cr.value} value={cr.value}>
                    {cr.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="monster-type" className="text-sm font-medium text-slate-700">
              Monster Type
            </Label>
            <Select value={filters.type} onValueChange={(value) => handleFilterChange('type', value)}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {monsterTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="environment" className="text-sm font-medium text-slate-700">
              Environment
            </Label>
            <Select value={filters.environment} onValueChange={(value) => handleFilterChange('environment', value)}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select environment" />
              </SelectTrigger>
              <SelectContent>
                {environments.map((env) => (
                  <SelectItem key={env.value} value={env.value}>
                    {env.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="count" className="text-sm font-medium text-slate-700">
              Number of Monsters
            </Label>
            <Input
              type="number"
              min="1"
              max="5"
              value={filters.count}
              onChange={(e) => handleFilterChange('count', parseInt(e.target.value) || 1)}
              className="mt-1"
            />
          </div>
        </div>

        <Separator />

        {/* Advanced Settings */}
        <Collapsible open={showAdvanced} onOpenChange={setShowAdvanced}>
          <CollapsibleTrigger asChild>
            <Button variant="outline" className="w-full justify-between">
              <div className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Advanced Settings
              </div>
              {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-3 mt-3">
            <div>
              <Label className="text-sm font-medium text-slate-700">
                Generation Algorithm
              </Label>
              <Select value={advancedSettings.algorithm} onValueChange={(value) => handleAdvancedChange('algorithm', value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {algorithms.map((algo) => (
                    <SelectItem key={algo.value} value={algo.value}>
                      <div>
                        <div className="font-medium">{algo.label}</div>
                        <div className="text-xs text-slate-500">{algo.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm font-medium text-slate-700">
                Complexity Level
              </Label>
              <Select value={advancedSettings.complexity} onValueChange={(value) => handleAdvancedChange('complexity', value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {complexityLevels.map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      <div>
                        <div className="font-medium">{level.label}</div>
                        <div className="text-xs text-slate-500">{level.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Coins className="w-4 h-4 text-amber-600" />
                  <Label className="text-sm font-medium text-slate-700">
                    Include Treasure
                  </Label>
                </div>
                <Switch
                  checked={advancedSettings.includeTreasure}
                  onCheckedChange={(checked) => handleAdvancedChange('includeTreasure', checked)}
                />
              </div>
              <p className="text-xs text-slate-500 ml-6">
                Generate coin hoards, gems, and magic items
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Home className="w-4 h-4 text-emerald-600" />
                  <Label className="text-sm font-medium text-slate-700">
                    Include Lair
                  </Label>
                </div>
                <Switch
                  checked={advancedSettings.includeLair}
                  onCheckedChange={(checked) => handleAdvancedChange('includeLair', checked)}
                />
              </div>
              <p className="text-xs text-slate-500 ml-6">
                Generate detailed lair descriptions and defenses
              </p>
            </div>
          </CollapsibleContent>
        </Collapsible>

        <Separator />

        {/* Action Buttons */}
        <div className="space-y-2">
          <Button 
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            <Zap className="w-4 h-4 mr-2" />
            {isGenerating ? 'Generating...' : 'Generate Monsters'}
          </Button>
          
          <Button 
            onClick={handleRandomAll}
            disabled={isGenerating}
            variant="outline"
            className="w-full"
          >
            <Shuffle className="w-4 h-4 mr-2" />
            Random Everything
          </Button>
        </div>

        {/* Quick Presets */}
        <div className="pt-2">
          <Label className="text-xs font-medium text-slate-600 mb-2 block">Quick Presets:</Label>
          <div className="grid grid-cols-2 gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setFilters({ challengeRating: '1', type: 'humanoid', environment: 'dungeon', count: 1 });
                setAdvancedSettings({ ...advancedSettings, complexity: 'simple' });
              }}
              className="text-xs"
            >
              Dungeon Dweller
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setFilters({ challengeRating: '6+', type: 'dragon', environment: 'mountain', count: 1 });
                setAdvancedSettings({ ...advancedSettings, complexity: 'complex', includeTreasure: true });
              }}
              className="text-xs"
            >
              Ancient Wyrm
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GenerationControls;