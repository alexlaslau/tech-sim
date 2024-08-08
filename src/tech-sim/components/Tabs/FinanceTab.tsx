import React from 'react';
import { Financials } from '../../gameLogic';
import './Tabs.css';

interface FinanceTabProps {
  financials: Financials;
  updateFinancials: (updates: Partial<Financials>) => void;
}

const FinanceTab: React.FC<FinanceTabProps> = ({ financials, updateFinancials }) => {
  const handleFinancialChange = (key: keyof Financials, value: number) => {
    updateFinancials({ [key]: value });
  };

  return (
    <div id="finance-tab" className="tab-content">
      <h2>Financial Decisions</h2>
      <div id="financial-decisions">
        {Object.entries(financials).map(([key, value]) => (
          <div key={key} className="financial-item">
            <h3>{key.split(/(?=[A-Z])/).join(' ')}</h3>
            <input
              type="range"
              id={key}
              min="0"
              max="100"
              value={value}
              onChange={(e) => handleFinancialChange(key as keyof Financials, Number(e.target.value))}
            />
            <span id={`${key}-percentage`}>{value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FinanceTab;