import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { PlayerProvider } from "./context/PlayerContext";
import { AuthProvider } from "./context/AuthContext";
import Sidebar from "./components/Sidebar";
import MusicPlayer from "./components/MusicPlayer";
import YouTubePlayer from "./components/YouTubePlayer";
import KaraokeDisplay from "./components/KaraokeDisplay";
import AuthCallback from "./components/AuthCallback";
import Home from "./pages/Home";
import Search from "./pages/Search";
import Library from "./pages/Library";
import Playlist from "./pages/Playlist";

function AppRouter() {
  const location = useLocation();
  
  // Check URL fragment for session_id synchronously during render
  if (location.hash?.includes('session_id=')) {
    return <AuthCallback />;
  }
  
  return (
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
      <YouTubePlayer />
      <KaraokeDisplay />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <PlayerProvider>
        <BrowserRouter>
          <AppRouter />
        </BrowserRouter>
      </PlayerProvider>
    </AuthProvider>
  );
}

export default App;
