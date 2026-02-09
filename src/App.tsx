import { Navigate, Route, Routes } from "react-router-dom";
import AppLayout from "./components/AppLayout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UploadDocs from "./pages/UploadDocs";
import Vendors from "./pages/Vendors";
import VendorDetail from "./pages/VendorDetail";
import Team from "./pages/Team";
import Documents from "./pages/Documents";
import { useAuth } from "./lib/useAuth";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" replace />;
};

const App = () => {
  const { token } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={token ? <Navigate to="/vendors" replace /> : <Login />} />
      <Route path="/register" element={token ? <Navigate to="/vendors" replace /> : <Register />} />
      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Navigate to="/vendors" replace />} />
        <Route path="/vendors" element={<Vendors />} />
        <Route path="/vendors/:id" element={<VendorDetail />} />
        <Route path="/team" element={<Team />} />
        <Route path="/documents" element={<Documents />} />
        <Route path="/upload" element={<UploadDocs />} />
      </Route>
      <Route path="*" element={<Navigate to="/vendors" replace />} />
    </Routes>
  );
};

export default App;
