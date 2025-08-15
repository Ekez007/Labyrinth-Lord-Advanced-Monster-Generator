import React, { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MonsterCard from "./components/MonsterCard";
import GenerationControls from "./components/GenerationControls";
import SavedMonsters from "./components/SavedMonsters";
import MonsterAPI from "./services/monsterApi";
import { Toaster } from "./components/ui/toaster";
import { useToast } from "./hooks/use-toast";
import { Alert, AlertDescription } from "./components/ui/alert";
import { Skull, Github, ExternalLink, AlertCircle, Wifi, WifiOff } from "lucide-react";

const Home = () => {
  const [generatedMonsters, setGeneratedMonsters] = useState([]);
  const [savedMonsters, setSavedMonsters] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isConnected, setIsConnected] = useState(true);
  const [stats, setStats] = useState({ totalGenerated: 0, totalSaved: 0, totalShared: 0 });
  const { toast } = useToast();

  // Test API connection on startup
  useEffect(() => {
    const testConnection = async () => {
      try {
        await MonsterAPI.testConnection();
        setIsConnected(true);
        // Load initial data
        await loadSavedMonsters();
        await loadStats();
      } catch (error) {
        console.error('API connection failed:', error);
        setIsConnected(false);
        toast({
          title: "API Connection Failed",
          description: "Using offline mode. Some features may be limited.",
          variant: "destructive",
        });
      }
    };

    testConnection();
  }, [toast]);

  const loadSavedMonsters = async () => {
    if (!isConnected) return;
    
    try {
      const data = await MonsterAPI.getMyCollection();
      setSavedMonsters(data.monsters || []);
    } catch (error) {
      console.error('Failed to load saved monsters:', error);
    }
  };

  const loadStats = async () => {
    if (!isConnected) return;
    
    try {
      const data = await MonsterAPI.getStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const handleGenerate = async (request) => {
    setIsGenerating(true);
    
    try {
      const data = await MonsterAPI.generateMonsters(request);
      setGeneratedMonsters(data.monsters || []);
      
      // Update stats
      await loadStats();
      
      toast({
        title: "Monsters generated!",
        description: `Generated ${data.monsters?.length || 0} monster${data.monsters?.length !== 1 ? 's' : ''} successfully.`,
      });
    } catch (error) {
      console.error('Generation failed:', error);
      toast({
        title: "Generation failed",
        description: error.message || "Failed to generate monsters. Please try again.",
        variant: "destructive",
      });
      
      // Fallback to mock generation in offline mode
      if (!isConnected) {
        generateMockMonster(request);
      }
    } finally {
      setIsGenerating(false);
    }
  };

  // Fallback mock generation for offline mode
  const generateMockMonster = (request) => {
    const mockMonster = {
      id: `mock-${Date.now()}`,
      name: "Offline Test Monster",
      type: request.filters.type !== 'any' ? request.filters.type : 'beast',
      challengeRating: request.filters.challengeRating !== 'any' ? request.filters.challengeRating : '1',
      environment: request.filters.environment !== 'any' ? request.filters.environment : 'dungeon',
      stats: {
        ac: 6,
        hd: "1",
        hp: 4,
        movement: "90' (30')",
        attacks: "1 bite",
        damage: "1d6",
        save: "Fighter 1",
        morale: 7,
        xp: 10
      },
      description: "This is a test monster generated in offline mode.",
      specialAbilities: ["Test Ability"],
      encounters: {
        numberAppearing: "1d4",
        wildEncounter: "1d2",
        lairChance: 25
      },
      treasure: {
        individual: "None",
        lair: "None",
        coins: {},
        gems: [],
        magicItems: []
      },
      lair: {
        description: "A simple den in the rocks.",
        terrain: request.filters.environment !== 'any' ? request.filters.environment : 'dungeon',
        size: "small",
        defenses: ["Hidden entrance"],
        features: ["Rocky outcropping"]
      },
      source: "mock"
    };

    setGeneratedMonsters([mockMonster]);
    toast({
      title: "Offline mode",
      description: "Generated test monster. Connect to API for full features.",
      variant: "default",
    });
  };

  const handleSaveMonster = async (monster) => {
    if (!isConnected) {
      toast({
        title: "Offline mode",
        description: "Cannot save monsters while offline.",
        variant: "destructive",
      });
      return;
    }

    try {
      const isDuplicate = savedMonsters.some(saved => 
        saved.name === monster.name && saved.type === monster.type
      );
      
      if (!isDuplicate) {
        const result = await MonsterAPI.saveMonster(monster);
        
        // Add the saved monster ID to the monster object
        const savedMonster = { ...monster, id: result.monsterId };
        setSavedMonsters(prev => [...prev, savedMonster]);
        
        // Update stats
        await loadStats();
        
        toast({
          title: "Monster saved!",
          description: `${monster.name} has been added to your collection.`,
        });
      } else {
        toast({
          title: "Monster already saved",
          description: `${monster.name} is already in your collection.`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Failed to save monster:', error);
      toast({
        title: "Save failed",
        description: error.message || "Failed to save monster. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleRemoveSaved = async (index) => {
    const monster = savedMonsters[index];
    
    if (!isConnected) {
      toast({
        title: "Offline mode",
        description: "Cannot delete monsters while offline.",
        variant: "destructive",
      });
      return;
    }

    try {
      if (monster.id) {
        await MonsterAPI.deleteSavedMonster(monster.id);
      }
      
      setSavedMonsters(prev => prev.filter((_, i) => i !== index));
      
      // Update stats
      await loadStats();
      
      toast({
        title: "Monster removed",
        description: `${monster.name} has been removed from your collection.`,
      });
    } catch (error) {
      console.error('Failed to delete monster:', error);
      toast({
        title: "Delete failed",
        description: error.message || "Failed to delete monster.",
        variant: "destructive",
      });
    }
  };

  const handleClearAll = async () => {
    if (!isConnected) {
      toast({
        title: "Offline mode",
        description: "Cannot clear collection while offline.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Delete all saved monsters
      await Promise.all(
        savedMonsters
          .filter(monster => monster.id)
          .map(monster => MonsterAPI.deleteSavedMonster(monster.id))
      );
      
      setSavedMonsters([]);
      
      // Update stats
      await loadStats();
      
      toast({
        title: "Collection cleared",
        description: "All saved monsters have been removed.",
      });
    } catch (error) {
      console.error('Failed to clear collection:', error);
      toast({
        title: "Clear failed",
        description: error.message || "Failed to clear collection.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Connection Status Alert */}
      {!isConnected && (
        <Alert className="mx-4 mt-4 border-orange-200 bg-orange-50">
          <WifiOff className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            API connection lost. Running in offline mode with limited functionality.
          </AlertDescription>
        </Alert>
      )}

      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <Skull className="w-8 h-8 text-emerald-700" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900">
                  Labyrinth Lord Monster Generator
                </h1>
                <p className="text-slate-600 mt-1 flex items-center gap-2">
                  Generate unique monsters for your old-school adventures
                  {isConnected ? (
                    <Wifi className="w-4 h-4 text-green-600" title="Connected" />
                  ) : (
                    <WifiOff className="w-4 h-4 text-orange-600" title="Offline" />
                  )}
                </p>
              </div>
            </div>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
            >
              <Github className="w-5 h-5" />
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
          
          {/* Stats Bar */}
          {isConnected && (
            <div className="mt-4 flex gap-6 text-sm text-slate-600">
              <div>Generated: <span className="font-semibold text-emerald-600">{stats.totalGenerated}</span></div>
              <div>Saved: <span className="font-semibold text-blue-600">{stats.totalSaved}</span></div>
              <div>Shared: <span className="font-semibold text-purple-600">{stats.totalShared}</span></div>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Generation Controls */}
          <div className="lg:col-span-1">
            <GenerationControls 
              onGenerate={handleGenerate} 
              isGenerating={isGenerating} 
            />
          </div>

          {/* Generated Monsters */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
                <Skull className="w-5 h-5 text-emerald-600" />
                Generated Monsters
                {generatedMonsters.length > 0 && (
                  <span className="text-sm bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">
                    {generatedMonsters.length}
                  </span>
                )}
              </h2>
              
              {generatedMonsters.length === 0 ? (
                <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                  <Skull className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-500">No monsters generated yet</p>
                  <p className="text-sm text-slate-400 mt-1">
                    Use the generator to create your first monster
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {generatedMonsters.map((monster, index) => (
                    <MonsterCard
                      key={`${monster.name}-${index}`}
                      monster={monster}
                      onSave={handleSaveMonster}
                      showAdvanced={true}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Saved Monsters */}
          <div className="lg:col-span-1">
            <SavedMonsters
              savedMonsters={savedMonsters}
              onRemove={handleRemoveSaved}
              onClearAll={handleClearAll}
            />
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-slate-200">
          <div className="text-center">
            <p className="text-slate-500 text-sm">
              Built for Labyrinth Lord RPG • Generate endless monsters for your campaigns
            </p>
            <p className="text-slate-400 text-xs mt-2">
              Features advanced generation algorithms with treasure, lair, and encounter systems
            </p>
            {!isConnected && (
              <p className="text-orange-500 text-xs mt-1 flex items-center justify-center gap-1">
                <AlertCircle className="w-3 h-3" />
                Some features require API connection
              </p>
            )}
          </div>
        </footer>
      </main>

      <Toaster />
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
