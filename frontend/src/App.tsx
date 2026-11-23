import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import { useAuth } from './context/AuthContext';
import { Forgot, Intro, Register, SignIn } from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Capture from './pages/Capture';
import Result, { LatestResult } from './pages/Result';
import History from './pages/History';
import Training from './pages/Training';
import { Profile, Roadmap } from './pages/Profile';

function Protected() {
  const { user } = useAuth();
  if (!user) {
    let seen = false;
    try { seen = !!localStorage.getItem('mycoshield.intro'); } catch { /* ignore */ }
    return <Navigate to={seen ? '/signin' : '/intro'} replace />;
  }
  return <Layout />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/intro" element={<Intro />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot" element={<Forgot />} />
      <Route element={<Protected />}>
        <Route index element={<Dashboard />} />
        <Route path="capture" element={<Capture />} />
        <Route path="data" element={<History />} />
        <Route path="training" element={<Training />} />
        <Route path="results" element={<LatestResult />} />
        <Route path="results/:id" element={<Result />} />
        <Route path="profile" element={<Profile />} />
        <Route path="roadmap" element={<Roadmap />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
