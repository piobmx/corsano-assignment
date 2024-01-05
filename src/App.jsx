import "./App.css";

import { Route, Routes } from "react-router-dom";

import AuthPage from "./components/AuthPage";
import DataPage from "./components/DataPage";
import HomePage from "./components/Home";
import Sidebar from "./components/Sidebar";
import SummaryPage from "./components/Summary";

function App() {
  return (
    <div className="flex">
      <Sidebar />
      <div className="main-component">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/data" element={<DataPage />} />
          <Route path="/summary" element={<SummaryPage />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
