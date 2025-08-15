import React from 'react';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { ScrollArea } from './ui/scroll-area';
import { Home, Shield, MapPin, Ruler } from 'lucide-react';

const LairDisplay = ({ lair, isExpanded = false }) => {
  if (!lair || lair.description === "No fixed lair") {
    return (
      <div className="text-center py-4">
        <Home className="w-8 h-8 text-slate-300 mx-auto mb-2" />
        <p className="text-slate-500 text-sm">No fixed lair</p>
      </div>
    );
  }

  const sizeLabels = {
    'tiny': { label: 'Tiny', color: 'bg-green-100 text-green-700' },
    'small': { label: 'Small', color: 'bg-blue-100 text-blue-700' },
    'medium': { label: 'Medium', color: 'bg-yellow-100 text-yellow-700' },
    'large': { label: 'Large', color: 'bg-orange-100 text-orange-700' },
    'huge': { label: 'Huge', color: 'bg-red-100 text-red-700' },
    'none': { label: 'Variable', color: 'bg-slate-100 text-slate-700' }
  };

  const sizeInfo = sizeLabels[lair.size] || sizeLabels['none'];

  const terrainColors = {
    'dungeon': 'bg-slate-100 text-slate-700',
    'forest': 'bg-green-100 text-green-700',
    'swamp': 'bg-emerald-100 text-emerald-700',
    'mountain': 'bg-stone-100 text-stone-700',
    'desert': 'bg-amber-100 text-amber-700',
    'arctic': 'bg-cyan-100 text-cyan-700',
    'coastal': 'bg-blue-100 text-blue-700',
    'urban': 'bg-gray-100 text-gray-700',
    'underground': 'bg-purple-100 text-purple-700',
    'planar': 'bg-indigo-100 text-indigo-700'
  };

  const terrainColor = terrainColors[lair.terrain] || 'bg-slate-100 text-slate-700';

  return (
    <div className="space-y-4">
      {/* Lair Metadata */}
      <div className="flex flex-wrap gap-2">
        <Badge variant="outline" className={`text-xs ${terrainColor}`}>
          <MapPin className="w-3 h-3 mr-1" />
          {lair.terrain}
        </Badge>
        <Badge variant="outline" className={`text-xs ${sizeInfo.color}`}>
          <Ruler className="w-3 h-3 mr-1" />
          {sizeInfo.label}
        </Badge>
      </div>

      {/* Description */}
      <div>
        <h4 className="font-semibold text-slate-700 mb-2 flex items-center gap-2">
          <Home className="w-4 h-4 text-emerald-600" />
          Description
        </h4>
        <ScrollArea className={isExpanded ? "h-auto" : "h-16"}>
          <p className="text-sm text-slate-600 leading-relaxed">
            {lair.description}
          </p>
        </ScrollArea>
      </div>

      {/* Features */}
      {lair.features && lair.features.length > 0 && (
        <>
          <Separator />
          <div>
            <h4 className="font-semibold text-slate-700 mb-2">Notable Features</h4>
            <div className="flex flex-wrap gap-1">
              {lair.features.slice(0, isExpanded ? lair.features.length : 4).map((feature, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {feature}
                </Badge>
              ))}
              {!isExpanded && lair.features.length > 4 && (
                <Badge variant="secondary" className="text-xs">
                  +{lair.features.length - 4} more
                </Badge>
              )}
            </div>
          </div>
        </>
      )}

      {/* Defenses */}
      {lair.defenses && lair.defenses.length > 0 && (
        <>
          <Separator />
          <div>
            <h4 className="font-semibold text-slate-700 mb-2 flex items-center gap-2">
              <Shield className="w-4 h-4 text-red-600" />
              Defenses
            </h4>
            <div className="flex flex-wrap gap-1">
              {lair.defenses.slice(0, isExpanded ? lair.defenses.length : 3).map((defense, index) => (
                <Badge key={index} variant="outline" className="text-xs border-red-200 text-red-700">
                  {defense}
                </Badge>
              ))}
              {!isExpanded && lair.defenses.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{lair.defenses.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default LairDisplay;