import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import ProtectedRoute from './components/ProtectedRoute';

import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import HangHoaPage from './pages/HangHoaPage';
import NhaCungCapPage from './pages/NhaCungCapPage';
import PhieuNhapPage from './pages/PhieuNhapPage';
import PhieuXuatPage from './pages/PhieuXuatPage';
import KiemKePage from './pages/KiemKePage';
import BaoCaoPage from './pages/BaoCaoPage';
import DuBaoPage from './pages/DuBaoPage';
import DeNghiXuatPage from './pages/DeNghiXuatPage';
import LichSuTonKhoPage from './pages/LichSuTonKhoPage';
import ProfilePage from './pages/ProfilePage';

const MainLayout = () => {
  return (
    <div className="app-container">
      <Sidebar />
      <main className="main-content">
        <Header />
        <div className="page-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      
      {/* Protected Routes using MainLayout */}
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/nhacungcap" element={<NhaCungCapPage />} />
          <Route path="/hanghoa" element={<HangHoaPage />} />
          <Route path="/nhapkho" element={<PhieuNhapPage />} />
          <Route path="/xuatkho" element={<PhieuXuatPage />} />
          <Route path="/kiemke" element={<KiemKePage />} />
          <Route path="/baocao" element={<BaoCaoPage />} />
          <Route path="/dubao" element={<DuBaoPage />} />
          <Route path="/denghi" element={<DeNghiXuatPage />} />
          <Route path="/lichsu-tonkho" element={<LichSuTonKhoPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
      </Route>
      
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
