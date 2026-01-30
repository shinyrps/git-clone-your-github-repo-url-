import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PlayerProvider } from "./context/PlayerContext";
import Sidebar from "./components/Sidebar";
import MusicPlayer from "./components/MusicPlayer";
import Home from "./pages/Home";
import Search from "./pages/Search";
import Library from "./pages/Library";
import Playlist from "./pages/Playlist";

function App() {
  return (
    <PlayerProvider>
      <BrowserRouter>
        <div className="flex h-screen bg-black overflow-hidden">
          <Sidebar />
          <div className="flex-1 ml-64">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/search" element={<Search />} />
              <Route path="/library" element={<Library />} />
              <Route path="/playlist/:id" element={<Playlist />} />
            </Routes>
          </div>
          <MusicPlayer />
        </div>
      </BrowserRouter>
    </PlayerProvider>
  );
}

export default App;
