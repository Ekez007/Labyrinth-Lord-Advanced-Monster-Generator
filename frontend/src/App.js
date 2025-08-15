import React, { useState } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MonsterCard from "./components/MonsterCard";
import GenerationControls from "./components/GenerationControls";
import SavedMonsters from "./components/SavedMonsters";
import { generateMonsters } from "./utils/monsterGenerator";
import { Toaster } from "./components/ui/toaster";
import { useToast } from "./hooks/use-toast";
import { Skull, Github, ExternalLink } from "lucide-react";

const Home = () => {
  const [generatedMonsters, setGeneratedMonsters] = useState([]);
  const [savedMonsters, setSavedMonsters] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleGenerate = async (filters) => {
    setIsGenerating(true);
    
    // Simulate generation delay for better UX
    setTimeout(() => {
      const monsters = generateMonsters(filters);
      setGeneratedMonsters(monsters);
      setIsGenerating(false);
      
      toast({
        title: "Monsters generated!",
        description: `Generated ${monsters.length} monster${monsters.length > 1 ? 's' : ''} successfully.`,
      });
    }, 800);
  };

  const handleSaveMonster = (monster) => {
    const isDuplicate = savedMonsters.some(saved => 
      saved.name === monster.name && saved.type === monster.type
    );
    
    if (!isDuplicate) {
      setSavedMonsters(prev => [...prev, monster]);
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
  };

  const handleRemoveSaved = (index) => {
    const monster = savedMonsters[index];
    setSavedMonsters(prev => prev.filter((_, i) => i !== index));
    toast({
      title: "Monster removed",
      description: `${monster.name} has been removed from your collection.`,
    });
  };

  const handleClearAll = () => {
    setSavedMonsters([]);
    toast({
      title: "Collection cleared",
      description: "All saved monsters have been removed.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
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
                <p className="text-slate-600 mt-1">
                  Generate unique monsters for your old-school adventures
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
              Stats are based on Labyrinth Lord rules and compatible with most OSR systems
            </p>
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
