import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import useAuth from "./hooks/useAuth";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { Toaster } from "react-hot-toast";
import Dashboard from "./pages/Dashboard";
import UploadPage from "./pages/uploadPage";  
import StudyMode from "./pages/StudyMode";
import AnalyticsPage from "./pages/AnalyticsPage";
import InterviewMode from "./pages/InterviewMode";
// Protected Route wrapper
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

const AppRoutes = () => {
  return (
    <>
      <Toaster position="top-right" />
      <Navbar />
      <div className="pt-20">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }/>

          {/*  Fixed: /upload → /upload/:deckId + UploadPage component */}
          <Route path="/upload/:deckId" element={
            <ProtectedRoute>
              <UploadPage />
            </ProtectedRoute>
          }/>

          <Route path="/study/:deckId" element={
            <ProtectedRoute>
              <StudyMode />
            </ProtectedRoute>
          }/>

          <Route path="/interview" element={
            <ProtectedRoute>
              <InterviewMode/>
            </ProtectedRoute>
          }/>

          <Route path="/analytics" element={
            <ProtectedRoute>
             <AnalyticsPage/>
            </ProtectedRoute>
          }/>
        </Routes>

      </div>
    </>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;