import React from 'react';
import { Allocation } from '../../gameLogic';
import './Tabs.css';

interface TeamTabProps {
  allocation: Allocation;
  updateAllocation: (updates: Partial<Allocation>) => void;
}

const TeamTab: React.FC<TeamTabProps> = ({ allocation, updateAllocation }) => {
  const handleAllocationChange = (key: keyof Allocation, value: number) => {
    updateAllocation({ [key]: value });
  };

  return (
    <div id="team-tab" className="tab-content">
      <h2>Team Allocation</h2>
      <div id="team-allocation">
        {Object.entries(allocation).map(([key, value]) => (
          <div key={key} className="allocation-item">
            <h3>{key.charAt(0).toUpperCase() + key.slice(1)}</h3>
            <input
              type="range"
              id={`${key}-allocation`}
              min="0"
              max="100"
              value={value}
              onChange={(e) => handleAllocationChange(key as keyof Allocation, Number(e.target.value))}
            />
            <span id={`${key}-percentage`}>{value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamTab;