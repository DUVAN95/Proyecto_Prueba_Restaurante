import logo from './logo.svg';
import './App.css';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Restaurantes from './Component/restaurantes';
import Reservas from './Component/reservas';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Reservas />} />
        <Route path="/restaurantes" element={<Restaurantes />} />
      </Routes>
    </Router>
  );
}


export default App;
