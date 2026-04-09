import React from 'react';
import ReactDOM from 'react-dom/client';
import '../action/index.css';
import GroupEnemiesView from './GroupEnemiesView';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <GroupEnemiesView />
    </React.StrictMode>
);