import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
// import ForgeFormDemo from './App.tsx'
// biome-ignore lint/style/noNonNullAssertion: <explanation>
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
    {/* <ForgeFormDemo/> */}
  </StrictMode>,
)
