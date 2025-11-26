import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import StoryDetail from './pages/StoryDetail';
import Admin from './pages/Admin';
import Profile from './pages/Profile';
import AuthorDashboard from './pages/AuthorDashboard';
import AuthorRegister from './pages/AuthorRegister';
import Wallet from './pages/Wallet';
import ReadChapter from './pages/ReadChapter';
import Search from './pages/Search';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="search" element={<Search />} />
          <Route path="story/:id" element={<StoryDetail />} />
          <Route path="read/:storyId/:chapterId" element={<ReadChapter />} />
          <Route path="admin" element={<Admin />} />
          <Route path="profile" element={<Profile />} />
          <Route path="author" element={<AuthorDashboard />} />
          <Route path="author/register" element={<AuthorRegister />} />
          <Route path="wallet" element={<Wallet />} />
          
          {/* Placeholders */}
          <Route path="library" element={<div className="p-4">Thư viện (Đang phát triển)</div>} />
          <Route path="history" element={<div className="p-4">Lịch sử đọc (Đang phát triển)</div>} />
          <Route path="genres" element={<div className="p-4">Thể loại (Đang phát triển)</div>} />
          <Route path="login" element={<div className="p-4">Vui lòng đăng nhập qua Youware Platform</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
