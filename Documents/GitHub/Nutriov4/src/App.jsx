import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard';
import MealAnalyzer from './pages/MealAnalyzer';
import History from './pages/History';
import Favourites from './pages/Favourites';
import Achievements from './pages/Achievements';
import Account from './pages/Account';
import Onboarding from './pages/Onboarding';
import MealPlanner from './pages/MealPlanner';
import Goals from './pages/Goals';

function App() {
  return (
    <Routes>
      <Route path="/onboarding" element={<Onboarding />} />
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="analyze" element={<MealAnalyzer />} />
        <Route path="meal-planner" element={<MealPlanner />} />
        <Route path="goals" element={<Goals />} />
        <Route path="history" element={<History />} />
        <Route path="favourites" element={<Favourites />} />
        <Route path="achievements" element={<Achievements />} />
        <Route path="account" element={<Account />} />
      </Route>
    </Routes>
  );
}

export default App;
