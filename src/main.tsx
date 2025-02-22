import { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import RHFExample from './Rhfrom.tsx';
import App from './App.tsx';

function AppSwitcher() {
  const [showRHF, setShowRHF] = useState(false);

  const toggleComponent = () => {
    setShowRHF((prev) => !prev);
  };

  return (
    <>
    <div>
      {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
      <button onClick={toggleComponent} style={{
        background: '#e0e0e0',
        borderRadius: '12px',
        boxShadow: '7px 7px 14px #bebebe, -7px -7px 14px #ffffff',
        border: 'none',
        padding: '10px 20px',
        fontSize: '16px',
        cursor: 'pointer',
        outline: 'none'
      }}>
        {showRHF ? 'In-built useForm hook' : 'Show React Hook form Example'}
      </button>
      {showRHF ? <RHFExample /> : <App />}
    </div>
    <br/>
        </>
  );
}

// biome-ignore lint/style/noNonNullAssertion: <explanation>
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppSwitcher />
  </StrictMode>
);