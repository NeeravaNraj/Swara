import "./Stylesheets/App.css";
import Bottombar from "./Components/Bottombar/Bottombar";
import SidbarLeft from "./Components/SibebarLeft/SidebarLeft";
import Mainview from "./Components/Main/Mainview";
import axios from "axios";
import React from "react";
import { useState, useEffect } from "react";
import { SongContextProvider } from "./Hooks/SongProvider";
import { useSongContext } from './Hooks/SongProvider'


function App() {
  // console.log(useSongContext, "from Provider")

  return (
    <div className="App">
      <header className="App-header"></header>
      <main className="main-view">
        <div className="grid-container">
          <SongContextProvider>
            <SidbarLeft className="sidebar-left" />
            <Mainview className="mainview" />
            <Bottombar className="bottom-bar" />
          </SongContextProvider>
        </div>
      </main>
    </div>
  );
}

export default App;
