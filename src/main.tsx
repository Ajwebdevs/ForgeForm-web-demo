import { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import RHFExample from './Rhfrom.tsx';
import App from './App.tsx';
import WizardFormDemo from './WizardFrom.tsx';

function AppSwitcher() {
  const [activeComponent, setActiveComponent] = useState('App');

  const renderComponent = () => {
    switch (activeComponent) {
      case 'App':
        return <App />;
      case 'RHFExample':
        return <RHFExample />;
      case 'WizardFormDemo':
        return <WizardFormDemo />;
      default:
        return <App />;
    }
  };

  return (
    <>
      <nav className="neumorphic-nav">
        <button className="neumorphic-button" onClick={() => setActiveComponent('App')}>App</button>
        <button className="neumorphic-button" onClick={() => setActiveComponent('RHFExample')}>RHF Example</button>
        <button className="neumorphic-button" onClick={() => setActiveComponent('WizardFormDemo')}>Wizard Form Demo</button>
      </nav>
      {renderComponent()}
    </>
  );
}

// biome-ignore lint/style/noNonNullAssertion: <explanation>
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppSwitcher />
  </StrictMode>
);
