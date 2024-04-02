import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Computer from "./pages/computer/Computer";
import Phone from "./pages/phone/Phone";
import Mirror from "./pages/mirror/Mirror";

// import Call from './pages/computer/Call';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/computer/*" element={<Computer />} />
        <Route path="/phone/*" element={<Phone />} />
        <Route path="/mirror/*" element={<Mirror />} />
      </Routes>
    </Router>
  );
}

export default App;
