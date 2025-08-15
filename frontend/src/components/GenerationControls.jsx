import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { Dice6, Shuffle, Zap } from 'lucide-react';

const GenerationControls = ({ onGenerate, isGenerating }) => {
  const [filters, setFilters] = useState({
    challengeRating: 'any',
    type: 'any',
    environment: 'any',
    count: 1
  });

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

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleGenerate = () => {
    onGenerate(filters);
  };

  const handleRandomAll = () => {
    const randomFilters = {
      challengeRating: challengeRatings[Math.floor(Math.random() * challengeRatings.length)].value,
      type: monsterTypes[Math.floor(Math.random() * monsterTypes.length)].value,
      environment: environments[Math.floor(Math.random() * environments.length)].value,
      count: Math.floor(Math.random() * 3) + 1
    };
    setFilters(randomFilters);
    onGenerate(randomFilters);
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
      </CardContent>
    </Card>
  );
};

export default GenerationControls;