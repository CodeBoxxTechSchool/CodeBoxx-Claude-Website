import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import Financing from './pages/Financing';
import Ventures from './pages/Ventures';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="/financing" element={<Financing />} />
        <Route path="/ventures" element={<Ventures />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}
