import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BookList from './components/BookList';
import BookDetail from './components/BookDetail';

const App: React.FC = () => (
  <Router>
    <Routes>
      <Route path="/" element={<BookList />} />
      <Route path="/book/:id" element={<BookDetail />} />
    </Routes>
  </Router>
);

export default App;
