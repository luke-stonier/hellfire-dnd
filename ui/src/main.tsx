import { createRoot } from 'react-dom/client'
import './bootstrap-overrides.scss'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(<App />)
