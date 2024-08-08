import React, { useState, useEffect } from 'react';
import { Scenario, GameConfig, Company, Allocation, Financials } from '../../gameLogic';
import CompanyTab from '../Tabs/CompanyTab';
import TeamTab from '../Tabs/TeamTab';
import ProductTab from '../Tabs/ProductTab';
import FinanceTab from '../Tabs/FinanceTab';
import EventsContainer from '../EventsContainer/EventsContainer';
import './GameContainer.css';

interface GameContainerProps {
  scenario: Scenario;
  gameConfig: GameConfig;
}

const GameContainer: React.FC<GameContainerProps> = ({ scenario, gameConfig }) => {
  const [company, setCompany] = useState<Company>({
    cash: scenario.initialCash,
    revenue: 0,
    burnRate: scenario.initialEmployees * gameConfig.burnRatePerEmployee,
    employees: scenario.initialEmployees,
    productProgress: 0,
    features: 0,
    userExperience: 0,
    performance: 0,
    marketingEffectiveness: 0,
    customerSatisfaction: 70,
    productName: scenario.productName,
    industryTrend: scenario.industryTrend,
    allocation: {
      engineering: 25,
      marketing: 25,
      sales: 25,
      support: 25
    }
  });

  const [financials, setFinancials] = useState<Financials>({
    rdInvestment: 20,
    marketingBudget: 30,
    employeeBenefits: 25
  });

  const [activeTab, setActiveTab] = useState('company');
  const [events, setEvents] = useState<string[]>([]);

  useEffect(() => {
    const gameLoop = setInterval(() => {
      processMonthlyResults();
      if (Math.random() < gameConfig.randomEventProbability) {
        triggerRandomEvent();
      }
    }, 1000);

    return () => clearInterval(gameLoop);
  }, [company, gameConfig]);

  const updateCompany = (updates: Partial<Company>) => {
    setCompany(prev => {
      const updatedCompany: Company = {
        ...prev,
        ...updates,
        allocation: {
          ...prev.allocation,
          ...(updates.allocation || {})
        }
      };
      return updatedCompany;
    });
  };

  const updateAllocation = (updates: Partial<Allocation>) => {
    setCompany(prev => ({ ...prev, allocation: { ...prev.allocation, ...updates } }));
  };

  const updateFinancials = (updates: Partial<Financials>) => {
    setFinancials(prev => ({ ...prev, ...updates }));
  };

  const addEvent = (message: string) => {
    setEvents(prev => [message, ...prev].slice(0, 10));
  };

  const processMonthlyResults = () => {
    const newCash = company.cash + company.revenue - company.burnRate;
    const newRevenue = company.revenue + (company.allocation.sales / 100) * company.employees * gameConfig.baseRevenuePerEmployee * company.industryTrend;
    const newCustomerSatisfaction = Math.max(0, Math.min(100, company.customerSatisfaction + (company.allocation.support / 100) * 2 - 1));
    
    let finalRevenue = newRevenue;
    if (newCustomerSatisfaction < gameConfig.customerSatisfactionThreshold) {
      finalRevenue *= gameConfig.customerSatisfactionPenalty;
    }

    updateCompany({
      cash: newCash,
      revenue: finalRevenue,
      customerSatisfaction: newCustomerSatisfaction
    });

    addEvent('Monthly results processed.');
  };

  const triggerRandomEvent = () => {
    // Implement random event logic here
    addEvent('A random event occurred!');
  };

  return (
    <div id="game-container">
      <h1>TechStartup Simulator Pro</h1>
      {activeTab === 'company' && (
        <CompanyTab 
          company={company} 
          gameConfig={gameConfig} 
          updateCompany={updateCompany}
          addEvent={addEvent}
        />
      )}
      {activeTab === 'team' && (
        <TeamTab 
          allocation={company.allocation} 
          updateAllocation={updateAllocation} 
        />
      )}
      {activeTab === 'product' && (
        <ProductTab 
          company={company} 
        />
      )}
      {activeTab === 'finance' && (
        <FinanceTab 
          financials={financials} 
          updateFinancials={updateFinancials} 
        />
      )}
      <EventsContainer events={events} />
      <div className="tab-container">
        <div className={`tab ${activeTab === 'company' ? 'active' : ''}`} onClick={() => setActiveTab('company')}>Company</div>
        <div className={`tab ${activeTab === 'team' ? 'active' : ''}`} onClick={() => setActiveTab('team')}>Team</div>
        <div className={`tab ${activeTab === 'product' ? 'active' : ''}`} onClick={() => setActiveTab('product')}>Product</div>
        <div className={`tab ${activeTab === 'finance' ? 'active' : ''}`} onClick={() => setActiveTab('finance')}>Finance</div>
      </div>
    </div>
  );
};

export default GameContainer;