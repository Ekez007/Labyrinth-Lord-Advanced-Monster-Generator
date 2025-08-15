import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Coins, Gem, Wand2, Package } from 'lucide-react';

const TreasureDisplay = ({ treasure, isExpanded = false }) => {
  const hasTreasure = treasure && (
    treasure.individual !== "None" || 
    treasure.lair !== "None" ||
    (treasure.coins && Object.keys(treasure.coins).length > 0) ||
    (treasure.gems && treasure.gems.length > 0) ||
    (treasure.magicItems && treasure.magicItems.length > 0)
  );

  if (!hasTreasure) {
    return (
      <div className="text-center py-4">
        <Package className="w-8 h-8 text-slate-300 mx-auto mb-2" />
        <p className="text-slate-500 text-sm">No treasure</p>
      </div>
    );
  }

  const formatCoinAmount = (amount) => {
    if (amount >= 1000) {
      return `${(amount / 1000).toFixed(1)}k`;
    }
    return amount.toString();
  };

  const coinLabels = {
    cp: 'Copper',
    sp: 'Silver', 
    ep: 'Electrum',
    gp: 'Gold',
    pp: 'Platinum'
  };

  const coinColors = {
    cp: 'bg-amber-600',
    sp: 'bg-slate-400',
    ep: 'bg-yellow-500',
    gp: 'bg-yellow-400',
    pp: 'bg-indigo-400'
  };

  return (
    <div className="space-y-4">
      {/* Treasure Types */}
      <div className="flex gap-2">
        {treasure.individual !== "None" && (
          <Badge variant="outline" className="text-xs">
            Individual: {treasure.individual}
          </Badge>
        )}
        {treasure.lair !== "None" && (
          <Badge variant="outline" className="text-xs">
            Lair: {treasure.lair}
          </Badge>
        )}
      </div>

      {/* Coins */}
      {treasure.coins && Object.keys(treasure.coins).length > 0 && (
        <div>
          <h4 className="font-semibold text-slate-700 mb-2 flex items-center gap-2">
            <Coins className="w-4 h-4 text-amber-600" />
            Coins
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {Object.entries(treasure.coins).map(([type, amount]) => (
              <div key={type} className="flex items-center gap-2 p-2 bg-slate-50 rounded">
                <div className={`w-3 h-3 rounded-full ${coinColors[type]}`}></div>
                <span className="text-sm font-medium">{formatCoinAmount(amount)} {type}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Gems */}
      {treasure.gems && treasure.gems.length > 0 && (
        <>
          <Separator />
          <div>
            <h4 className="font-semibold text-slate-700 mb-2 flex items-center gap-2">
              <Gem className="w-4 h-4 text-emerald-600" />
              Gems ({treasure.gems.length})
            </h4>
            <div className="space-y-1">
              {treasure.gems.slice(0, isExpanded ? treasure.gems.length : 3).map((gem, index) => (
                <Badge key={index} variant="outline" className="text-xs mr-2 mb-1">
                  {gem}
                </Badge>
              ))}
              {!isExpanded && treasure.gems.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{treasure.gems.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        </>
      )}

      {/* Magic Items */}
      {treasure.magicItems && treasure.magicItems.length > 0 && (
        <>
          <Separator />
          <div>
            <h4 className="font-semibold text-slate-700 mb-2 flex items-center gap-2">
              <Wand2 className="w-4 h-4 text-purple-600" />
              Magic Items ({treasure.magicItems.length})
            </h4>
            <div className="space-y-1">
              {treasure.magicItems.slice(0, isExpanded ? treasure.magicItems.length : 2).map((item, index) => (
                <Badge key={index} variant="outline" className="text-xs mr-2 mb-1 border-purple-200 text-purple-700">
                  {item}
                </Badge>
              ))}
              {!isExpanded && treasure.magicItems.length > 2 && (
                <Badge variant="secondary" className="text-xs">
                  +{treasure.magicItems.length - 2} more
                </Badge>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default TreasureDisplay;