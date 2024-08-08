import React from 'react';
import { Company } from '../../gameLogic';
import './Tabs.css';

interface ProductTabProps {
  company: Company;
}

const ProductTab: React.FC<ProductTabProps> = ({ company }) => {
  return (
    <div id="product-tab" className="tab-content">
      <h2>Product Development</h2>
      <div id="product-development">
        <div className="product-item">
          <h3>Overall Progress</h3>
          <div className="progress-bar"><div id="product-progress" className="progress" style={{width: `${company.productProgress}%`}}></div></div>
        </div>
        <div className="product-item">
          <h3>Features</h3>
          <div className="progress-bar"><div id="features-progress" className="progress" style={{width: `${company.features}%`}}></div></div>
        </div>
        <div className="product-item">
          <h3>User Experience</h3>
          <div className="progress-bar"><div id="ux-progress" className="progress" style={{width: `${company.userExperience}%`}}></div></div>
        </div>
        <div className="product-item">
          <h3>Performance</h3>
          <div className="progress-bar"><div id="performance-progress" className="progress" style={{width: `${company.performance}%`}}></div></div>
        </div>
      </div>
    </div>
  );
};

export default ProductTab;