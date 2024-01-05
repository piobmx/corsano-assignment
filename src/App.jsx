import "./App.css";

import { Link, Route, Routes } from "react-router-dom";

import AuthPage from "./components/AuthPage";
import DataPage from "./components/DataPage";
import HomePage from "./components/Home";
import Sidebar from "./components/Sidebar";
import SummaryPage from "./components/Summary";
import { useState } from "react";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <Sidebar />
      <div className="main-component">
        <Routes>
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/data" element={<DataPage />} />
          <Route path="/summary" element={<SummaryPage />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
