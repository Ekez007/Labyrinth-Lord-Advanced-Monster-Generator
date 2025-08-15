import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { ScrollArea } from './ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Save, Download, Copy, ChevronDown, ChevronUp, Coins, Home, Users } from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import TreasureDisplay from './TreasureDisplay';
import LairDisplay from './LairDisplay';
import EncounterDisplay from './EncounterDisplay';
import ShareMonster from './ShareMonster';

const MonsterCard = ({ monster, onSave, showAdvanced = true }) => {
  const { toast } = useToast();
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState('stats');

  const copyToClipboard = () => {
    const monsterText = `${monster.name} (${monster.type})
AC: ${monster.stats.ac}, HD: ${monster.stats.hd}, HP: ${monster.stats.hp}
Move: ${monster.stats.movement}, Attacks: ${monster.stats.attacks}
Damage: ${monster.stats.damage}, Save: ${monster.stats.save}
Morale: ${monster.stats.morale}, XP: ${monster.stats.xp}

${monster.description}

Special Abilities: ${monster.specialAbilities.join(', ')}

Encounters:
- Number Appearing: ${monster.encounters?.numberAppearing || 'Unknown'}
- In Wild: ${monster.encounters?.wildEncounter || 'Unknown'}
- Lair Chance: ${monster.encounters?.lairChance || 0}%

Treasure: Individual ${monster.treasure?.individual || 'None'}, Lair ${monster.treasure?.lair || 'None'}

Lair: ${monster.lair?.description || 'No fixed lair'}`;

    navigator.clipboard.writeText(monsterText);
    toast({
      title: "Copied to clipboard!",
      description: `${monster.name} stats copied successfully.`,
    });
  };

  const exportMonster = () => {
    const dataStr = JSON.stringify(monster, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `${monster.name.toLowerCase().replace(/\s+/g, '_')}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleSave = () => {
    onSave(monster);
  };

  return (
    <Card className="w-full max-w-lg mx-auto shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-xl font-bold text-slate-800">{monster.name}</CardTitle>
            <div className="flex flex-wrap gap-2 mt-2">
              <Badge variant="secondary" className="text-xs">{monster.type}</Badge>
              <Badge variant="outline" className="text-xs">{monster.environment}</Badge>
              <Badge variant="default" className="text-xs bg-emerald-600">CR {monster.challengeRating}</Badge>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="ml-2"
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {showAdvanced && isExpanded ? (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="stats" className="text-xs">Stats</TabsTrigger>
              <TabsTrigger value="encounters" className="text-xs">
                <Users className="w-3 h-3 mr-1" />
                Encounters
              </TabsTrigger>
              <TabsTrigger value="treasure" className="text-xs">
                <Coins className="w-3 h-3 mr-1" />
                Treasure
              </TabsTrigger>
              <TabsTrigger value="lair" className="text-xs">
                <Home className="w-3 h-3 mr-1" />
                Lair
              </TabsTrigger>
            </TabsList>

            <TabsContent value="stats" className="space-y-4 mt-4">
              {/* Basic Stats */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-semibold text-slate-600">AC:</span> {monster.stats.ac}
                </div>
                <div>
                  <span className="font-semibold text-slate-600">HD:</span> {monster.stats.hd}
                </div>
                <div>
                  <span className="font-semibold text-slate-600">HP:</span> {monster.stats.hp}
                </div>
                <div>
                  <span className="font-semibold text-slate-600">Move:</span> {monster.stats.movement}
                </div>
                <div className="col-span-2">
                  <span className="font-semibold text-slate-600">Attacks:</span> {monster.stats.attacks}
                </div>
                <div className="col-span-2">
                  <span className="font-semibold text-slate-600">Damage:</span> {monster.stats.damage}
                </div>
                <div>
                  <span className="font-semibold text-slate-600">Save:</span> {monster.stats.save}
                </div>
                <div>
                  <span className="font-semibold text-slate-600">Morale:</span> {monster.stats.morale}
                </div>
                <div className="col-span-2">
                  <span className="font-semibold text-slate-600">XP:</span> {monster.stats.xp}
                </div>
              </div>

              <Separator />

              {/* Description */}
              <div>
                <h4 className="font-semibold text-slate-700 mb-2">Description</h4>
                <ScrollArea className="h-24">
                  <p className="text-sm text-slate-600 leading-relaxed">{monster.description}</p>
                </ScrollArea>
              </div>

              {/* Special Abilities */}
              {monster.specialAbilities && monster.specialAbilities.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <h4 className="font-semibold text-slate-700 mb-2">Special Abilities</h4>
                    <div className="flex flex-wrap gap-1">
                      {monster.specialAbilities.map((ability, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {ability}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </TabsContent>

            <TabsContent value="encounters" className="mt-4">
              <EncounterDisplay encounters={monster.encounters} />
            </TabsContent>

            <TabsContent value="treasure" className="mt-4">
              <TreasureDisplay treasure={monster.treasure} isExpanded={true} />
            </TabsContent>

            <TabsContent value="lair" className="mt-4">
              <LairDisplay lair={monster.lair} isExpanded={true} />
            </TabsContent>
          </Tabs>
        ) : (
          /* Compact view */
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-semibold text-slate-600">AC:</span> {monster.stats.ac}
              </div>
              <div>
                <span className="font-semibold text-slate-600">HD:</span> {monster.stats.hd}
              </div>
              <div>
                <span className="font-semibold text-slate-600">HP:</span> {monster.stats.hp}
              </div>
              <div>
                <span className="font-semibold text-slate-600">Move:</span> {monster.stats.movement}
              </div>
              <div className="col-span-2">
                <span className="font-semibold text-slate-600">Attacks:</span> {monster.stats.attacks}
              </div>
              <div className="col-span-2">
                <span className="font-semibold text-slate-600">Damage:</span> {monster.stats.damage}
              </div>
            </div>

            <Separator />

            <div>
              <h4 className="font-semibold text-slate-700 mb-2">Description</h4>
              <ScrollArea className="h-16">
                <p className="text-sm text-slate-600 leading-relaxed">{monster.description}</p>
              </ScrollArea>
            </div>

            {monster.specialAbilities && monster.specialAbilities.length > 0 && (
              <>
                <Separator />
                <div>
                  <h4 className="font-semibold text-slate-700 mb-2">Special Abilities</h4>
                  <div className="flex flex-wrap gap-1">
                    {monster.specialAbilities.slice(0, 4).map((ability, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {ability}
                      </Badge>
                    ))}
                    {monster.specialAbilities.length > 4 && (
                      <Badge variant="secondary" className="text-xs">
                        +{monster.specialAbilities.length - 4} more
                      </Badge>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        <Separator />

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2 pt-2">
          <Button 
            size="sm" 
            variant="outline" 
            onClick={copyToClipboard}
            className="flex-1 min-w-0"
          >
            <Copy className="w-4 h-4 mr-1" />
            Copy
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={exportMonster}
            className="flex-1 min-w-0"
          >
            <Download className="w-4 h-4 mr-1" />
            Export
          </Button>
        </div>
        
        <div className="flex gap-2">
          <Button 
            size="sm" 
            onClick={handleSave}
            className="flex-1 bg-emerald-600 hover:bg-emerald-700"
          >
            <Save className="w-4 h-4 mr-1" />
            Save
          </Button>
          {monster.id && <ShareMonster monster={monster} />}
        </div>
      </CardContent>
    </Card>
  );
};

export default MonsterCard;