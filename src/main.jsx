import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App.jsx';

// Encontra o elemento 'root' no HTML
const container = document.getElementById('root');

// Cria a raiz do React
const root = createRoot(container);

// Renderiza a aplicação
root.render(
    <StrictMode>
        {/* O BrowserRouter envolve toda a aplicação */}
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </StrictMode>
);