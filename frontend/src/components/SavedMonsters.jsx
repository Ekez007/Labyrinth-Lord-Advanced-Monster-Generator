import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import { BookOpen, Trash2, Download, Eye } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';

const SavedMonsters = ({ savedMonsters, onRemove, onClearAll }) => {
  const [selectedMonster, setSelectedMonster] = useState(null);

  const exportAllMonsters = () => {
    const dataStr = JSON.stringify(savedMonsters, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = 'saved_monsters.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  if (savedMonsters.length === 0) {
    return (
      <Card className="w-full max-w-md mx-auto shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-slate-800">
            <BookOpen className="w-5 h-5 text-emerald-600" />
            Saved Monsters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-500 text-center py-8">No monsters saved yet</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2 text-slate-800">
            <BookOpen className="w-5 h-5 text-emerald-600" />
            Saved Monsters
          </CardTitle>
          <Badge variant="secondary">{savedMonsters.length}</Badge>
        </div>
        <div className="flex gap-2 mt-2">
          <Button 
            size="sm" 
            variant="outline" 
            onClick={exportAllMonsters}
            className="flex-1"
          >
            <Download className="w-4 h-4 mr-1" />
            Export All
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={onClearAll}
            className="flex-1 text-red-600 hover:text-red-700"
          >
            <Trash2 className="w-4 h-4 mr-1" />
            Clear All
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        <ScrollArea className="h-96">
          <div className="space-y-2">
            {savedMonsters.map((monster, index) => (
              <div key={index} className="p-3 border rounded-lg hover:bg-slate-50 transition-colors">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-medium text-slate-800">{monster.name}</h4>
                    <div className="flex gap-1 mt-1">
                      <Badge variant="outline" className="text-xs">{monster.type}</Badge>
                      <Badge variant="secondary" className="text-xs">CR {monster.challengeRating}</Badge>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      AC {monster.ac} • HD {monster.hd} • HP {monster.hp}
                    </p>
                  </div>
                  <div className="flex gap-1 ml-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="ghost" onClick={() => setSelectedMonster(monster)}>
                          <Eye className="w-3 h-3" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle>{selectedMonster?.name}</DialogTitle>
                        </DialogHeader>
                        {selectedMonster && (
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div><span className="font-semibold">AC:</span> {selectedMonster.ac}</div>
                              <div><span className="font-semibold">HD:</span> {selectedMonster.hd}</div>
                              <div><span className="font-semibold">HP:</span> {selectedMonster.hp}</div>
                              <div><span className="font-semibold">Move:</span> {selectedMonster.movement}</div>
                              <div className="col-span-2"><span className="font-semibold">Attacks:</span> {selectedMonster.attacks}</div>
                              <div className="col-span-2"><span className="font-semibold">Damage:</span> {selectedMonster.damage}</div>
                            </div>
                            <Separator />
                            <div>
                              <h4 className="font-semibold mb-2">Description</h4>
                              <p className="text-sm text-slate-600">{selectedMonster.description}</p>
                            </div>
                            {selectedMonster.specialAbilities.length > 0 && (
                              <>
                                <Separator />
                                <div>
                                  <h4 className="font-semibold mb-2">Special Abilities</h4>
                                  <div className="flex flex-wrap gap-1">
                                    {selectedMonster.specialAbilities.map((ability, idx) => (
                                      <Badge key={idx} variant="outline" className="text-xs">
                                        {ability}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              </>
                            )}
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={() => onRemove(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default SavedMonsters;