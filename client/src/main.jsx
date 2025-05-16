import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import 'virtual:uno.css'
import '@ant-design/v5-patch-for-react-19'

createRoot(document.getElementById('root')).render(<App />);
