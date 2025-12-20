import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function MainLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      {/* pt-16 agar konten tidak ketutup Navbar yang fixed */}
      <main className="flex-1 pt-16">
        <Outlet /> 
      </main>
      <Footer />
    </div>
  );
}