import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

console.log('main.jsx is loading...');
console.log('React:', React);
console.log('ReactDOM:', ReactDOM);

const rootElement = document.getElementById('root');
console.log('Root element:', rootElement);

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  console.log('App rendered successfully');
} else {
  console.error('Root element not found!');
  document.body.innerHTML = '<div style="padding: 20px; color: red; font-size: 20px;">Error: Root element #root not found in HTML</div>';
}