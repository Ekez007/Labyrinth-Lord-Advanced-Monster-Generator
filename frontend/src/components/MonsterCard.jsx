import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { ScrollArea } from './ui/scroll-area';
import { Save, Download, Copy } from 'lucide-react';
import { useToast } from '../hooks/use-toast';

const MonsterCard = ({ monster, onSave }) => {
  const { toast } = useToast();

  const copyToClipboard = () => {
    const monsterText = `${monster.name} (${monster.type})
AC: ${monster.ac}, HD: ${monster.hd}, HP: ${monster.hp}
Move: ${monster.movement}, Attacks: ${monster.attacks}
Damage: ${monster.damage}, Save: ${monster.save}
Morale: ${monster.morale}, XP: ${monster.xp}

${monster.description}

Special Abilities: ${monster.specialAbilities.join(', ')}`;

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

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl font-bold text-slate-800">{monster.name}</CardTitle>
            <div className="flex gap-2 mt-2">
              <Badge variant="secondary" className="text-xs">{monster.type}</Badge>
              <Badge variant="outline" className="text-xs">{monster.environment}</Badge>
              <Badge variant="default" className="text-xs bg-emerald-600">CR {monster.challengeRating}</Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-semibold text-slate-600">AC:</span> {monster.ac}
          </div>
          <div>
            <span className="font-semibold text-slate-600">HD:</span> {monster.hd}
          </div>
          <div>
            <span className="font-semibold text-slate-600">HP:</span> {monster.hp}
          </div>
          <div>
            <span className="font-semibold text-slate-600">Move:</span> {monster.movement}
          </div>
          <div className="col-span-2">
            <span className="font-semibold text-slate-600">Attacks:</span> {monster.attacks}
          </div>
          <div className="col-span-2">
            <span className="font-semibold text-slate-600">Damage:</span> {monster.damage}
          </div>
          <div>
            <span className="font-semibold text-slate-600">Save:</span> {monster.save}
          </div>
          <div>
            <span className="font-semibold text-slate-600">Morale:</span> {monster.morale}
          </div>
          <div className="col-span-2">
            <span className="font-semibold text-slate-600">XP:</span> {monster.xp}
          </div>
        </div>

        <Separator />

        <div>
          <h4 className="font-semibold text-slate-700 mb-2">Description</h4>
          <ScrollArea className="h-20">
            <p className="text-sm text-slate-600 leading-relaxed">{monster.description}</p>
          </ScrollArea>
        </div>

        {monster.specialAbilities.length > 0 && (
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

        <Separator />

        <div className="flex gap-2 pt-2">
          <Button 
            size="sm" 
            variant="outline" 
            onClick={copyToClipboard}
            className="flex-1"
          >
            <Copy className="w-4 h-4 mr-1" />
            Copy
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={exportMonster}
            className="flex-1"
          >
            <Download className="w-4 h-4 mr-1" />
            Export
          </Button>
          <Button 
            size="sm" 
            onClick={() => onSave(monster)}
            className="flex-1 bg-emerald-600 hover:bg-emerald-700"
          >
            <Save className="w-4 h-4 mr-1" />
            Save
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MonsterCard;