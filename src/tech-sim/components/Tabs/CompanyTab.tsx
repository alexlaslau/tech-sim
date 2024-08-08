import React from 'react';
import { Company, GameConfig, hireEmployee, developProduct, launchMarketingCampaign, seekInvestment } from '../../gameLogic';
import './CompanyTab.css';

interface CompanyTabProps {
  company: Company;
  gameConfig: GameConfig;
  updateCompany: (updates: Partial<Company>) => void;
  addEvent: (message: string) => void;
}

const CompanyTab: React.FC<CompanyTabProps> = ({ company, gameConfig, updateCompany, addEvent }) => {
  const handleHireEmployee = () => {
    const result = hireEmployee(company, gameConfig);
    if (result.success) {
      updateCompany(result.companyUpdates);
      addEvent(result.message);
    } else {
      addEvent(result.message);
    }
  };

  const handleDevelopProduct = () => {
    const result = developProduct(company, gameConfig);
    updateCompany(result.companyUpdates);
    addEvent(result.message);
  };

  const handleLaunchMarketingCampaign = () => {
    const result = launchMarketingCampaign(company, gameConfig);
    if (result.success) {
      updateCompany(result.companyUpdates);
      addEvent(result.message);
    } else {
      addEvent(result.message);
    }
  };

  const handleSeekInvestment = () => {
    const result = seekInvestment(company, gameConfig);
    if (result.success) {
      updateCompany(result.companyUpdates);
      addEvent(result.message);
    } else {
      addEvent(result.message);
    }
  };

  return (
    <div id="company-tab" className="tab-content active">
      <div id="company-stats">
        <div className="stat">
          <h3>Cash</h3>
          <p id="cash">${company.cash.toLocaleString()}</p>
        </div>
        <div className="stat">
          <h3>Revenue</h3>
          <p id="revenue">${company.revenue.toLocaleString()}</p>
        </div>
        <div className="stat">
          <h3>Burn Rate</h3>
          <p id="burn-rate">${company.burnRate.toLocaleString()}</p>
        </div>
        <div className="stat">
          <h3>Employees</h3>
          <p id="employees">{company.employees}</p>
        </div>
      </div>

      <h2>Actions</h2>
      <div className="actions">
        <button onClick={handleHireEmployee}>Hire Employee</button>
        <button onClick={handleDevelopProduct}>Develop Product</button>
        <button onClick={handleLaunchMarketingCampaign}>Marketing Campaign</button>
        <button onClick={handleSeekInvestment}>Seek Investment</button>
      </div>
    </div>
  );
};

export default CompanyTab;