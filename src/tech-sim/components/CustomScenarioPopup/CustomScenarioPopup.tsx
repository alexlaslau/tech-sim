import React, { useState } from 'react';
import { Scenario } from '../../gameLogic';
import './CustomScenarioPopup.css';

interface CustomScenarioPopupProps {
  onClose: () => void;
  onCreateScenario: (scenario: Scenario) => void;
}

const CustomScenarioPopup: React.FC<CustomScenarioPopupProps> = ({ onClose, onCreateScenario }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [initialCash, setInitialCash] = useState(1000000);
  const [initialEmployees, setInitialEmployees] = useState(1);
  const [productName, setProductName] = useState('');
  const [industryTrend, setIndustryTrend] = useState(1.5);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const customScenario: Scenario = {
      id: 'custom-' + Date.now(),
      name,
      description,
      initialCash,
      initialEmployees,
      productName,
      industryTrend
    };
    onCreateScenario(customScenario);
    onClose();
  };

  return (
    <div id="custom-scenario-popup" className="popup">
      <div className="popup-content">
        <span className="close" onClick={onClose}>&times;</span>
        <h2>Create Your Own Scenario</h2>
        <form id="custom-scenario-form" onSubmit={handleSubmit}>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Startup Name" required />
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" required />
          <input type="number" value={initialCash} onChange={(e) => setInitialCash(Number(e.target.value))} placeholder="Initial Cash" required min="0" />
          <input type="number" value={initialEmployees} onChange={(e) => setInitialEmployees(Number(e.target.value))} placeholder="Initial Employees" required min="1" />
          <input type="text" value={productName} onChange={(e) => setProductName(e.target.value)} placeholder="Product Name" required />
          <input type="number" value={industryTrend} onChange={(e) => setIndustryTrend(Number(e.target.value))} placeholder="Industry Trend (1.0 - 2.0)" required min="1.0" max="2.0" step="0.1" />
          <button type="submit">Create Scenario</button>
        </form>
      </div>
    </div>
  );
};

export default CustomScenarioPopup;