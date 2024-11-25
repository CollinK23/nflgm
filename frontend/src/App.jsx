import "./App.css";
import { Home, Navbar, Trade, Dashboard } from "./components";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "./components/theme-provider";

function App() {
  return (
    <>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <BrowserRouter>
          <div className="">
            <Routes>
              <Route
                path="/"
                element={
                  <div className="mx-auto">
                    <Navbar></Navbar>
                    <Home></Home>
                  </div>
                }
              />
              <Route path="/trade/:id" element={<Trade />} />
              <Route
                path="/dashboard/:id?/:teamId?/:page?"
                element={<Dashboard />}
              />
            </Routes>
          </div>
        </BrowserRouter>
      </ThemeProvider>
    </>
  );
}

export default App;
