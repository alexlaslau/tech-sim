import React, { useState, useEffect } from 'react';
import './TechSim.css';

interface Scenario {
  id: string;
  name: string;
  description: string;
  initialCash: number;
  initialEmployees: number;
  productName: string;
  industryTrend: number;
}

interface RandomEvent {
  message: string;
  effect: {
    [key: string]: number | ((value: number) => number);
  };
}

interface GameConfig {
  burnRatePerEmployee: number;
  hireCost: number;
  marketingCampaignCost: number;
  baseRevenuePerEmployee: number;
  monthlyTimeIncrement: number;
  maxVisibleEvents: number;
  randomEventProbability: number;
  customerSatisfactionThreshold: number;
  customerSatisfactionPenalty: number;
}

interface GameState {
  cash: number;
  revenue: number;
  burnRate: number;
  employees: number;
  productProgress: number;
  features: number;
  userExperience: number;
  performance: number;
  marketingEffectiveness: number;
  customerSatisfaction: number;
  productName: string;
  industryTrend: number;
  currentDate: Date;
  events: Array<{date: string; message: string}>;
}

interface Allocation {
  engineering: number;
  marketing: number;
  sales: number;
  support: number;
}

interface Financials {
  rdInvestment: number;
  marketingBudget: number;
  employeeBenefits: number;
}

const TechSim: React.FC = () => {
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [randomEvents, setRandomEvents] = useState<RandomEvent[]>([]);
  const [gameConfig, setGameConfig] = useState<GameConfig>({} as GameConfig);
  const [gameState, setGameState] = useState<GameState>({
    cash: 0,
    revenue: 0,
    burnRate: 0,
    employees: 0,
    productProgress: 0,
    features: 0,
    userExperience: 0,
    performance: 0,
    marketingEffectiveness: 0,
    customerSatisfaction: 70,
    productName: '',
    industryTrend: 1,
    currentDate: new Date(),
    events: []
  });
  const [allocation, setAllocation] = useState<Allocation>({
    engineering: 25,
    marketing: 25,
    sales: 25,
    support: 25
  });
  const [financials, setFinancials] = useState<Financials>({
    rdInvestment: 20,
    marketingBudget: 30,
    employeeBenefits: 25
  });
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);
  const [activeTab, setActiveTab] = useState<string>('company');

  useEffect(() => {
    loadGameData();
  }, []);

  async function loadGameData() {
    try {
      const [scenariosResponse, eventsResponse, configResponse] = await Promise.all([
        fetch('/assets/scenarios.json'),
        fetch('/assets/events.json'),
        fetch('/assets/game-config.json')
      ]);

      setScenarios(await scenariosResponse.json());
      setRandomEvents(await eventsResponse.json());
      setGameConfig(await configResponse.json());
    } catch (error) {
      console.error("Error loading game data:", error);
      alert("Failed to load game data. Please ensure you're running the game on a local server.");
    }
  }

  function startGame(scenario: Scenario) {
    setSelectedScenario(scenario);
    setGameState({
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
      currentDate: new Date(),
      events: []
    });
    addEvent(`Welcome to your ${scenario.name}! Your journey with ${scenario.productName} begins today.`);
    gameLoop();
  }

  function addEvent(message: string) {
    setGameState(prevState => ({
      ...prevState,
      events: [
        { date: prevState.currentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), message },
        ...prevState.events.slice(0, gameConfig.maxVisibleEvents - 1)
      ]
    }));
  }

  function advanceTime(days: number) {
    setGameState(prevState => ({
      ...prevState,
      currentDate: new Date(prevState.currentDate.getTime() + days * 24 * 60 * 60 * 1000)
    }));
  }

  function hireEmployee() {
    if (gameState.cash >= gameConfig.hireCost) {
      setGameState(prev => ({
        ...prev,
        cash: prev.cash - gameConfig.hireCost,
        employees: prev.employees + 1,
        burnRate: prev.burnRate + gameConfig.burnRatePerEmployee
      }));
      addEvent('Hired a new employee. Team is growing!');
      advanceTime(7);
    } else {
      addEvent('Not enough cash to hire an employee.');
    }
  }

  function developProduct() {
    const developmentPoints = (allocation.engineering / 100) * gameState.employees * 5;
    setGameState(prev => ({
      ...prev,
      productProgress: Math.min(100, prev.productProgress + developmentPoints),
      features: Math.min(100, prev.features + developmentPoints * 0.5),
      userExperience: Math.min(100, prev.userExperience + developmentPoints * 0.3),
      performance: Math.min(100, prev.performance + developmentPoints * 0.2)
    }));
    addEvent(`${gameState.productName} development progressed. Keep pushing!`);
    advanceTime(14);
  }

  function launchMarketingCampaign() {
    if (gameState.cash >= gameConfig.marketingCampaignCost) {
      setGameState(prev => ({
        ...prev,
        cash: prev.cash - gameConfig.marketingCampaignCost,
        marketingEffectiveness: prev.marketingEffectiveness + 10,
        revenue: prev.revenue + 50000 * (prev.marketingEffectiveness / 100) * prev.industryTrend
      }));
      addEvent(`Marketing campaign for ${gameState.productName} launched. Brand awareness increased!`);
      advanceTime(30);
    } else {
      addEvent('Not enough cash for a marketing campaign.');
    }
  }

  function seekInvestment() {
    const chance = Math.random();
    if (chance > 0.7) {
      const investment = Math.floor(Math.random() * 5000000) + 1000000;
      setGameState(prev => ({
        ...prev,
        cash: prev.cash + investment
      }));
      addEvent(`Secured an investment of $${investment.toLocaleString()}!`);
    } else {
      addEvent('Investment pitch unsuccessful. Keep trying!');
    }
    advanceTime(21);
  }

  function processMonthlyResults() {
    setGameState(prev => {
      let newRevenue = prev.revenue + (allocation.sales / 100) * prev.employees * gameConfig.baseRevenuePerEmployee * prev.industryTrend;
      let newCustomerSatisfaction = Math.max(0, Math.min(100, prev.customerSatisfaction + (allocation.support / 100) * 2 - 1));
      
      if (newCustomerSatisfaction < gameConfig.customerSatisfactionThreshold) {
        newRevenue *= gameConfig.customerSatisfactionPenalty;
      }

      return {
        ...prev,
        cash: prev.cash + newRevenue - prev.burnRate,
        revenue: newRevenue,
        customerSatisfaction: newCustomerSatisfaction
      };
    });
    addEvent('Monthly results processed.');
    advanceTime(gameConfig.monthlyTimeIncrement);
  }

  function gameLoop() {
    processMonthlyResults();
    if (Math.random() < gameConfig.randomEventProbability) {
      triggerRandomEvent();
    }
    setTimeout(gameLoop, 60000);
  }

  function triggerRandomEvent() {
    const event = randomEvents[Math.floor(Math.random() * randomEvents.length)];
    setGameState(prev => {
      const newState = { ...prev };
      Object.entries(event.effect).forEach(([key, value]) => {
        if (typeof newState[key as keyof GameState] === 'number') {
          if (typeof value === 'number') {
            (newState[key as keyof GameState] as number) += value;
          } else if (typeof value === 'function') {
            (newState[key as keyof GameState] as number) = value(newState[key as keyof GameState] as number);
          }
        }
      });
      return newState;
    });
    addEvent(event.message);
  }

  function updateTeamAllocation(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setAllocation(prev => {
      const newAllocation = { ...prev, [name]: parseInt(value) };
      const total = Object.values(newAllocation).reduce((sum, val) => sum + val, 0);
      if (total > 100) {
        newAllocation[name as keyof Allocation] = parseInt(value) - (total - 100);
      }
      return newAllocation;
    });
  }

  function updateFinancialDecisions(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setFinancials(prev => {
      const newFinancials = { ...prev, [name]: parseInt(value) };
      const total = Object.values(newFinancials).reduce((sum, val) => sum + val, 0);
      if (total > 100) {
        newFinancials[name as keyof Financials] = parseInt(value) - (total - 100);
      }
      return newFinancials;
    });
  }

  return (
    <div className="game-container">
      {!selectedScenario ? (
        <div id="scenario-selection">
          <h1>Choose your startup scenario</h1>
          <div id="scenario-list">
            {scenarios.map(scenario => (
              <div key={scenario.id} className="scenario-card" onClick={() => startGame(scenario)}>
                <h2>{scenario.name}</h2>
                <p>{scenario.description}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <>
          <h1>TechStartup Simulator Pro</h1>
          
          <div className="tab-container">
            <button className={activeTab === 'company' ? 'active' : ''} onClick={() => setActiveTab('company')}>Company</button>
            <button className={activeTab === 'team' ? 'active' : ''} onClick={() => setActiveTab('team')}>Team</button>
            <button className={activeTab === 'product' ? 'active' : ''} onClick={() => setActiveTab('product')}>Product</button>
            <button className={activeTab === 'finance' ? 'active' : ''} onClick={() => setActiveTab('finance')}>Finance</button>
          </div>

          <div className={`tab-content ${activeTab === 'company' ? 'active' : ''}`}>
            <div className="company-stats">
              <div className="stat">
                <h3>Cash</h3>
                <p>${gameState.cash.toLocaleString()}</p>
              </div>
              <div className="stat">
                <h3>Revenue</h3>
                <p>${gameState.revenue.toLocaleString()}</p>
              </div>
              <div className="stat">
                <h3>Burn Rate</h3>
                <p>${gameState.burnRate.toLocaleString()}</p>
              </div>
              <div className="stat">
                <h3>Employees</h3>
                <p>{gameState.employees}</p>
              </div>
            </div>
            
            <h2>Actions</h2>
            <div className="actions">
              <button onClick={hireEmployee}>Hire Employee</button>
              <button onClick={developProduct}>Develop Product</button>
              <button onClick={launchMarketingCampaign}>Marketing Campaign</button>
              <button onClick={seekInvestment}>Seek Investment</button>
            </div>
          </div>

          <div className={`tab-content ${activeTab === 'team' ? 'active' : ''}`}>
            <h2>Team Allocation</h2>
            <div className="team-allocation">
              {Object.entries(allocation).map(([key, value]) => (
                <div key={key} className="allocation-item">
                  <label htmlFor={key}>{key.charAt(0).toUpperCase() + key.slice(1)}</label>
                  <input
                    type="range"
                    id={key}
                    name={key}
                    min="0"
                    max="100"
                    value={value}
                    onChange={updateTeamAllocation}
                  />
                  <span>{value}%</span>
                </div>
              ))}
            </div>
          </div>

          <div className={`tab-content ${activeTab === 'product' ? 'active' : ''}`}>
            <h2>Product Development</h2>
            <div className="product-development">
              <div className="product-item">
                <h3>Overall Progress</h3>
                <div className="progress-bar">
                  <div className="progress" style={{width: `${gameState.productProgress}%`}}></div>
                </div>
              </div>
              <div className="product-item">
                <h3>Features</h3>
                <div className="progress-bar">
                  <div className="progress" style={{width: `${gameState.features}%`}}></div>
                </div>
              </div>
              <div className="product-item">
                <h3>User Experience</h3>
                <div className="progress-bar">
                  <div className="progress" style={{width: `${gameState.userExperience}%`}}></div>
                </div>
              </div>
              <div className="product-item">
                <h3>Performance</h3>
                <div className="progress-bar">
                  <div className="progress" style={{width: `${gameState.performance}%`}}></div>
                </div>
              </div>
            </div>
          </div>
          <div className={`tab-content ${activeTab === 'finance' ? 'active' : ''}`}>
            <h2>Financial Decisions</h2>
            <div className="financial-decisions">
              {Object.entries(financials).map(([key, value]) => (
                <div key={key} className="financial-item">
                  <label htmlFor={key}>{key.split(/(?=[A-Z])/).join(" ")}</label>
                  <input
                    type="range"
                    id={key}
                    name={key}
                    min="0"
                    max="100"
                    value={value}
                    onChange={updateFinancialDecisions}
                  />
                  <span>{value}%</span>
                </div>
              ))}
            </div>
          </div>

          <div className="events-container">
            <h2>Events</h2>
            <p className="current-time">{gameState.currentDate.toLocaleDateString()}</p>
            <ul className="event-list">
              {gameState.events.map((event, index) => (
                <li key={index}>{event.date}: {event.message}</li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}

export default TechSim;