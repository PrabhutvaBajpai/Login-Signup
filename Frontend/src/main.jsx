import { Provider } from "./components/ui/provider.jsx"
import React from "react"

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider>
      <App />
    </Provider>  
  </StrictMode>
)
