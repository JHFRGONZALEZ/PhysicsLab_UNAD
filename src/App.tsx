import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { Home } from './components/Home';
import MRUPractice from './pages/MRUPractice';
import MRUVPractice from './pages/MRUVPractice';
import FreeFallPractice from './pages/FreeFallPractice';
import ProjectilePractice from './pages/ProjectilePractice';
import PendulumPractice from './pages/PendulumPractice';
import NewtonPractice from './pages/NewtonPractice';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/practica/mru" element={<MRUPractice />} />
        <Route path="/practica/mruv" element={<MRUVPractice />} />
        <Route path="/practica/caida-libre" element={<FreeFallPractice />} />
        <Route path="/practica/tiro-parabolico" element={<ProjectilePractice />} />
        <Route path="/practica/pendulo" element={<PendulumPractice />} />
        <Route path="/practica/newton" element={<NewtonPractice />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
