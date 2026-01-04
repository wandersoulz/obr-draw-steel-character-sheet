import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@/action/index.css';
import { RulesView } from './rules-view';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <RulesView />
    </StrictMode>,
);
