import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';

// Layouts
import StudentLayout from './components/StudentLayout';
import AdminLayout from './components/AdminLayout';

// Student Pages
import Home from './pages/student/Home';
import TestLibrary from './pages/student/TestLibrary';
import TestPage from './pages/student/TestPage';
import ResultPage from './pages/student/ResultPage';

// Admin Pages
import CreateTest from './pages/admin/CreateTest';
import AllTests from './pages/admin/AllTests';
import Login from './pages/admin/Login';

const ProtectedRoute = ({ children, user, authLoading }) => {
  if (authLoading) {
    return <div className="h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div></div>;
  }
  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
};

function App() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });
    return unsubscribe;
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* Student Routes */}
        <Route path="/" element={<StudentLayout />}>
          <Route index element={<Home />} />
          <Route path="tests" element={<TestLibrary />} />
          <Route path="test/:id" element={<TestPage />} />
          <Route path="result/:id" element={<ResultPage />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin" element={
          <ProtectedRoute user={user} authLoading={authLoading}>
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="tests" replace />} />
          <Route path="create-test" element={<CreateTest />} />
          <Route path="tests" element={<AllTests />} />
        </Route>
        
        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
