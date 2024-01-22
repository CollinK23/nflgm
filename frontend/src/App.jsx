import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { Home, Navbar, Trade, Roster, SideNav, Compare } from "./components";
import { BrowserRouter, Route, Routes } from "react-router-dom";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <BrowserRouter>
        <div className="sm:flex sm:flex-row">
          <SideNav className="absolute z-10 !important" />
          <Routes>
            <Route
              path="/"
              element={
                <div>
                  <Navbar></Navbar>
                  <Home></Home>
                </div>
              }
            />
            <Route path="/:id/trade" element={<Trade />} />
            <Route path="/:id/roster/:teamId" element={<Roster />} />
          </Routes>
        </div>
      </BrowserRouter>
    </>
  );
}

export default App;
