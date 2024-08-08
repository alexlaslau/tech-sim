export interface Scenario {
  id: string;
  name: string;
  description: string;
  initialCash: number;
  initialEmployees: number;
  productName: string;
  industryTrend: number;
}

export interface RandomEvent {
  message: string;
  effect: {
    [key: string]: number | ((value: number) => number);
  };
}

export interface GameConfig {
  burnRatePerEmployee: number;
  maxVisibleEvents: number;
  monthlyTimeIncrement: number;
  customerSatisfactionThreshold: number;
  customerSatisfactionPenalty: number;
  randomEventProbability: number;
  marketingCampaignCost: number;
  hireCost: number;
  baseRevenuePerEmployee: number;
}

export interface Company {
  allocation: Allocation;
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
  [key: string]: number | string | Allocation;
}

export interface Allocation {
  engineering: number;
  marketing: number;
  sales: number;
  support: number;
}

export interface Financials {
  rdInvestment: number;
  marketingBudget: number;
  employeeBenefits: number;
}

export async function loadGameData(): Promise<{ scenarios: Scenario[], randomEvents: RandomEvent[], gameConfig: GameConfig }> {
  try {
    const [scenariosResponse, eventsResponse, configResponse] = await Promise.all([
      fetch('/public/assets/scenarios.json'),
      fetch('/public/assets/events.json'),
      fetch('/public/assets/game-config.json')
    ]);

    if (!scenariosResponse.ok || !eventsResponse.ok || !configResponse.ok) {
      throw new Error('Failed to fetch game data');
    }

    const scenarios: Scenario[] = await scenariosResponse.json();
    const randomEvents: RandomEvent[] = await eventsResponse.json();
    const gameConfig: GameConfig = await configResponse.json();

    console.log('Loaded scenarios:', scenarios);

    return { scenarios, randomEvents, gameConfig };
  } catch (error) {
    console.error("Error loading game data:", error);
    throw new Error("Failed to load game data. Please ensure you're running the game on a local server.");
  }
}

export function hireEmployee(company: Company, gameConfig: GameConfig): { company: Company, event: string } {
  if (company.cash >= gameConfig.hireCost) {
    company.cash -= gameConfig.hireCost;
    company.employees++;
    company.burnRate += gameConfig.burnRatePerEmployee;
    return { company, event: 'Hired a new employee. Team is growing!' };
  } else {
    return { company, event: 'Not enough cash to hire an employee.' };
  }
}

export function developProduct(company: Company): { company: Company, event: string } {
  let developmentPoints = (company.allocation.engineering / 100) * company.employees * 5;
  company.productProgress = Math.min(100, company.productProgress + developmentPoints);
  company.features = Math.min(100, company.features + developmentPoints * 0.5);
  company.userExperience = Math.min(100, company.userExperience + developmentPoints * 0.3);
  company.performance = Math.min(100, company.performance + developmentPoints * 0.2);
  return { company, event: `${company.productName} development progressed. Keep pushing!` };
}

export function launchMarketingCampaign(company: Company, gameConfig: GameConfig): { company: Company, event: string } {
  if (company.cash >= gameConfig.marketingCampaignCost) {
    company.cash -= gameConfig.marketingCampaignCost;
    company.marketingEffectiveness += 10;
    company.revenue += 50000 * (company.marketingEffectiveness / 100) * company.industryTrend;
    return { company, event: `Marketing campaign for ${company.productName} launched. Brand awareness increased!` };
  } else {
    return { company, event: 'Not enough cash for a marketing campaign.' };
  }
}

export function seekInvestment(company: Company): { company: Company, event: string } {
  let chance = Math.random();
  if (chance > 0.7) {
    let investment = Math.floor(Math.random() * 5000000) + 1000000;
    company.cash += investment;
    return { company, event: `Secured an investment of $${investment.toLocaleString()}!` };
  } else {
    return { company, event: 'Investment pitch unsuccessful. Keep trying!' };
  }
}

export function processMonthlyResults(company: Company, gameConfig: GameConfig): { company: Company, event: string } {
  company.cash += company.revenue;
  company.cash -= company.burnRate;
  company.revenue += (company.allocation.sales / 100) * company.employees * gameConfig.baseRevenuePerEmployee * company.industryTrend;
  company.customerSatisfaction += (company.allocation.support / 100) * 2 - 1;
  company.customerSatisfaction = Math.max(0, Math.min(100, company.customerSatisfaction));
  if (company.customerSatisfaction < gameConfig.customerSatisfactionThreshold) {
    company.revenue *= gameConfig.customerSatisfactionPenalty;
  }
  return { company, event: 'Monthly results processed.' };
}

export function triggerRandomEvent(company: Company, randomEvents: RandomEvent[]): { company: Company, event: string } {
  const event = randomEvents[Math.floor(Math.random() * randomEvents.length)];
  Object.entries(event.effect).forEach(([key, value]) => {
    if (typeof company[key] === 'number') {
      if (typeof value === 'number') {
        company[key] += value;
      } else if (typeof value === 'function') {
        company[key] = value(company[key]);
      }
    }
  });
  return { company, event: event.message };
}