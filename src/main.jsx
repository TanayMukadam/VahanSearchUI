// main.jsx
import { createRoot } from 'react-dom/client';
import { StrictMode } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import Search from './Component/Search/Search';
import ResultsPage from './Component/Result/ResultPage';
import ProtectedRoute from './Component/ProtectedRoute';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Public route - Login page */}
        <Route path='/' element={<App />} />
        
        {/* Protected routes */}
        <Route path='/search' element={
          <ProtectedRoute>
            <Search />
          </ProtectedRoute>
        } />
        
        <Route path='/:regNo/results' element={
          <ProtectedRoute>
            <ResultsPage />
          </ProtectedRoute>
        } />
        
        {/* Catch-all route for 404 */}
        <Route path='*' element={
          <ProtectedRoute>
            <div>Page Not Found</div>
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
