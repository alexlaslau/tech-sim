import React from 'react';
import './TabContainer.css';

interface TabContainerProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const TabContainer: React.FC<TabContainerProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'company', label: 'Company', icon: 'M9 9h6M9 13h6M9 17h6' },
    { id: 'team', label: 'Team', icon: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75' },
    { id: 'product', label: 'Product', icon: 'M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z' },
    { id: 'finance', label: 'Finance', icon: 'M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6' },
  ];

  return (
    <div className="subtab-container">
      {tabs.map(tab => (
        <div
          key={tab.id}
          className={`subtab ${activeTab === tab.id ? 'active' : ''}`}
          onClick={() => setActiveTab(tab.id)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d={tab.icon} />
          </svg>
          <span className="subtab-label">{tab.label}</span>
        </div>
      ))}
    </div>
  );
};

export default TabContainer;