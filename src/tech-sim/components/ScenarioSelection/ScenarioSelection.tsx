import React from 'react';
import { Scenario } from '../../gameLogic';
import './ScenarioSelection.css';

interface ScenarioSelectionProps {
  scenarios: Scenario[];
  onStartGame: (scenario: Scenario) => void;
  onCreateCustom: () => void;
}

const ScenarioSelection: React.FC<ScenarioSelectionProps> = ({ scenarios, onStartGame, onCreateCustom }) => {
  console.log('Scenarios received:', scenarios); // Add this line for debugging

  return (
    <div id="scenario-selection">
      <h1>Choose your startup scenario</h1>
      <div id="scenario-list">
        {scenarios && scenarios.length > 0 ? (
          scenarios.map((scenario) => (
            <div key={scenario.id} className="scenario-card" onClick={() => onStartGame(scenario)}>
              <h2>{scenario.name}</h2>
              <p>{scenario.description}</p>
            </div>
          ))
        ) : (
          <div>No scenarios available</div>
        )}
        <div key="custom-scenario" className="scenario-card" onClick={onCreateCustom}>
          <h2>Create Your Own Scenario</h2>
          <p>Add your custom details and simulate that</p>
        </div>
      </div>
    </div>
  );
};

export default ScenarioSelection;