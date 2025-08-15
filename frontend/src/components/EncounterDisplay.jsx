import React from 'react';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Users, Trees, Home, Percent } from 'lucide-react';

const EncounterDisplay = ({ encounters }) => {
  if (!encounters) {
    return (
      <div className="text-center py-4">
        <Users className="w-8 h-8 text-slate-300 mx-auto mb-2" />
        <p className="text-slate-500 text-sm">No encounter data</p>
      </div>
    );
  }

  const getLairChanceColor = (chance) => {
    if (chance >= 70) return 'bg-red-100 text-red-700';
    if (chance >= 40) return 'bg-orange-100 text-orange-700';
    if (chance >= 20) return 'bg-yellow-100 text-yellow-700';
    return 'bg-green-100 text-green-700';
  };

  const interpretEncounterNumbers = (numberStr) => {
    // Simple interpretation of dice expressions
    if (numberStr === '1') return '1 (Solitary)';
    if (numberStr.includes('d2')) return `${numberStr} (Pair)`;
    if (numberStr.includes('d4')) return `${numberStr} (Small Group)`;
    if (numberStr.includes('d6')) return `${numberStr} (Pack/Band)`;
    if (numberStr.includes('d10')) return `${numberStr} (Large Group)`;
    return numberStr;
  };

  return (
    <div className="space-y-4">
      {/* Number Appearing */}
      <div>
        <h4 className="font-semibold text-slate-700 mb-2 flex items-center gap-2">
          <Users className="w-4 h-4 text-blue-600" />
          Number Appearing
        </h4>
        <div className="grid grid-cols-1 gap-2">
          <div className="p-2 bg-slate-50 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-xs font-medium text-slate-500">In Lair</span>
              <Badge variant="outline" className="text-xs">
                {interpretEncounterNumbers(encounters.numberAppearing)}
              </Badge>
            </div>
          </div>
          <div className="p-2 bg-slate-50 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-xs font-medium text-slate-500">In Wild</span>
              <Badge variant="outline" className="text-xs">
                {interpretEncounterNumbers(encounters.wildEncounter)}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <Separator />

      {/* Lair Chance */}
      <div>
        <h4 className="font-semibold text-slate-700 mb-2 flex items-center gap-2">
          <Home className="w-4 h-4 text-emerald-600" />
          Lair Presence
        </h4>
        <div className="p-3 bg-slate-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Percent className="w-4 h-4 text-slate-500" />
              <span className="text-sm font-medium text-slate-700">Lair Chance</span>
            </div>
            <Badge variant="outline" className={`text-xs ${getLairChanceColor(encounters.lairChance)}`}>
              {encounters.lairChance}%
            </Badge>
          </div>
          <div className="mt-2">
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${
                  encounters.lairChance >= 70 ? 'bg-red-500' :
                  encounters.lairChance >= 40 ? 'bg-orange-500' :
                  encounters.lairChance >= 20 ? 'bg-yellow-500' : 'bg-green-500'
                }`}
                style={{ width: `${Math.min(encounters.lairChance, 100)}%` }}
              ></div>
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {encounters.lairChance >= 70 ? 'Very likely to have a permanent lair' :
             encounters.lairChance >= 40 ? 'Often found in established lairs' :
             encounters.lairChance >= 20 ? 'Sometimes has a lair or den' :
             'Rarely maintains a fixed lair'}
          </p>
        </div>
      </div>

      {/* Encounter Tips */}
      <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
        <h4 className="font-semibold text-blue-800 mb-1 text-sm">Encounter Tips</h4>
        <ul className="text-xs text-blue-700 space-y-1">
          <li>• Roll for lair presence when first encountered</li>
          <li>• Use "Number Appearing" for initial lair population</li>
          <li>• Use "In Wild" numbers for random encounters</li>
          {encounters.lairChance > 50 && (
            <li>• High lair chance suggests territorial behavior</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default EncounterDisplay;