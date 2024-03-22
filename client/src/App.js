import './App.css';
import { BrowserRouter as Router, Routes, Route, Switch } from 'react-router-dom';
import Home from './pages/Home';
import Computer from './pages/computer/Computer';
import Email from './pages/computer/Email';
// import Call from './pages/computer/Call';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/computer" element={<Computer />} />
        <Route path="/email" element={<Email />} />
      </Routes>
    </Router>

  );
}

export default App;
