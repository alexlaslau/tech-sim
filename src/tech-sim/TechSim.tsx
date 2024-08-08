import React, { useState, useEffect } from 'react';
import ScenarioSelection from './components/ScenarioSelection/ScenarioSelection';
import CustomScenarioPopup from './components/CustomScenarioPopup/CustomScenarioPopup';
import GameContainer from './components/GameContainer/GameContainer';
import EventsContainer from './components/EventsContainer/EventsContainer';
import TabContainer from './components/TabContainer/TabContainer';
import { loadGameData, Scenario, RandomEvent, GameConfig } from './gameLogic';
import './TechSim.css';

const TechSim: React.FC = () => {
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [randomEvents, setRandomEvents] = useState<RandomEvent[]>([]);
  const [gameConfig, setGameConfig] = useState<GameConfig | null>(null);
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);
  const [showCustomPopup, setShowCustomPopup] = useState(false);
  const [activeTab, setActiveTab] = useState('company');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { scenarios, randomEvents, gameConfig } = await loadGameData();
        console.log('Loaded scenarios:', scenarios); // Add this line for debugging
        setScenarios(scenarios);
        setRandomEvents(randomEvents);
        setGameConfig(gameConfig);
      } catch (error) {
        console.error('Error loading game data:', error);
      }
    };
    fetchData();
  }, []);

  const startGame = (scenario: Scenario) => {
    setSelectedScenario(scenario);
  };

  return (
    <div>
      {!selectedScenario && scenarios.length > 0 && (
        <ScenarioSelection 
          scenarios={scenarios} 
          onStartGame={startGame}
          onCreateCustom={() => setShowCustomPopup(true)}
        />
      )}
      {showCustomPopup && (
        <CustomScenarioPopup
          onClose={() => setShowCustomPopup(false)}
          onCreateScenario={startGame}
        />
      )}
      {selectedScenario && gameConfig && (
        <>
          <GameContainer scenario={selectedScenario} gameConfig={gameConfig} />
          <EventsContainer events={[]} />
          <TabContainer activeTab={activeTab} setActiveTab={setActiveTab} />
        </>
      )}
    </div>
  );
};

export default TechSim;