import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Welcome from "./pages/Welcome";
import User from "./pages/User";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import Register from "./pages/Register";

function App() {
  const ProtectedRoute = ({ children }) => {
    const { user } = useContext(AuthContext);
    if (!user) {
      return <Navigate to='/welcome' />;
    }
    return children;
  };

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/welcome' element={<Welcome />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route
            index
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path='/user'
            element={
              <ProtectedRoute>
                <User />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
