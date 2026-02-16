import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import './i18n.ts'
import { AppProvider } from './components/context/globalContext'
import { ThemeProvider } from "../src/components/context/ThemeContext"
import CustomCursor from './components/CustomCursor'

createRoot(document.getElementById('root')!).render(
  <StrictMode >
    <ThemeProvider>
      <AppProvider>
        <CustomCursor src={undefined} size={30} />
        <App />
      </AppProvider>
    </ThemeProvider>
  </StrictMode>,
)
