import React, { useState } from "react";
import { ColorModeContext, useMode } from "../../../theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { Outlet } from "react-router-dom";
import Topbar from "./Topbar";
import Sidebar from "./Sidebar";
import img from "/images/dashboard.jpg";
import "./dashboardlayout.css";

const Dashboardlayout = () => {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);
  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div>
          <div className="headerimages">
            <img
              src={img}
              alt="dashboard"
              loading="lazy"
              className="detailImg"
            />
          </div>
          <div className="home">
            <Sidebar />
            <main className="homeContainer">
              <Topbar />

              <Outlet />
            </main>
          </div>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};

export default Dashboardlayout;
