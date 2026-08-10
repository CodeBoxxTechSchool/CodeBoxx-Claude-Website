import React from 'react';
import ReactDOM from 'react-dom/client';
import './design-system/tokens/fonts.css';
import './design-system/tokens/fig-tokens.css';
import './design-system/tokens/fig-typography.css';
import './design-system/tokens/ui-scale.css';
import './design-system/tokens/typography.css';
import './design-system/tokens/elevation.css';
import './design-system/tokens/motion.css';
import './design-system/tokens/base.css';
import './design-system/styles.css';
import './styles/main.scss';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
