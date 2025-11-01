import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../ui';

export const Navbar = ({ user, onLogout }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  
  const handleLogout = () => {
    onLogout();
    navigate('/');
  };
  
  return (
    <nav className="bg-white border-b-4 border-black sticky top-0 z-40">
      <div className="container-brutal">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-12 h-12 bg-primary border-3 border-black flex items-center justify-center font-bold text-2xl text-white group-hover:rotate-12 transition-transform">
              E
            </div>
            <span className="text-2xl font-bold uppercase">
              Exam<span className="text-primary">Verse</span>
            </span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {!user ? (
              <>
                <Link to="/about" className="font-bold hover:text-primary transition-colors uppercase text-sm">
                  About
                </Link>
                <Link to="/login" className="font-bold hover:text-primary transition-colors uppercase text-sm">
                  Login
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="sm">Get Started</Button>
                </Link>
              </>
            ) : (
              <>
                <Link to={`/${user.role}/dashboard`} className="font-bold hover:text-primary transition-colors uppercase text-sm">
                  Dashboard
                </Link>
                {user.role === 'student' && (
                  <>
                    <Link to="/papers" className="font-bold hover:text-primary transition-colors uppercase text-sm">
                      Papers
                    </Link>
                    <Link to="/saved" className="font-bold hover:text-primary transition-colors uppercase text-sm">
                      Saved
                    </Link>
                  </>
                )}
                {user.role === 'faculty' && (
                  <>
                    <Link to="/faculty/upload" className="font-bold hover:text-primary transition-colors uppercase text-sm">
                      Upload
                    </Link>
                    <Link to="/faculty/papers" className="font-bold hover:text-primary transition-colors uppercase text-sm">
                      My Papers
                    </Link>
                  </>
                )}
                <div className="flex items-center space-x-3 pl-3 border-l-3 border-black">
                  <div className="text-sm">
                    <p className="font-bold">{user.username}</p>
                    <p className="text-xs uppercase text-gray-600">{user.role}</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={handleLogout}>
                    Logout
                  </Button>
                </div>
              </>
            )}
          </div>
          
          {/* Mobile Menu Button */}
          <button
            className="md:hidden border-3 border-black p-2 bg-primary text-white font-bold"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>
        
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t-3 border-black bg-gray py-4 space-y-3">
            {!user ? (
              <>
                <Link to="/about" className="block font-bold hover:text-primary uppercase text-sm py-2">
                  About
                </Link>
                <Link to="/login" className="block font-bold hover:text-primary uppercase text-sm py-2">
                  Login
                </Link>
                <Link to="/register" className="block">
                  <Button variant="primary" size="sm" className="w-full">Get Started</Button>
                </Link>
              </>
            ) : (
              <>
                <Link to={`/${user.role}/dashboard`} className="block font-bold hover:text-primary uppercase text-sm py-2">
                  Dashboard
                </Link>
                {user.role === 'student' && (
                  <>
                    <Link to="/papers" className="block font-bold hover:text-primary uppercase text-sm py-2">
                      Papers
                    </Link>
                    <Link to="/saved" className="block font-bold hover:text-primary uppercase text-sm py-2">
                      Saved
                    </Link>
                  </>
                )}
                {user.role === 'faculty' && (
                  <>
                    <Link to="/faculty/upload" className="block font-bold hover:text-primary uppercase text-sm py-2">
                      Upload
                    </Link>
                    <Link to="/faculty/papers" className="block font-bold hover:text-primary uppercase text-sm py-2">
                      My Papers
                    </Link>
                  </>
                )}
                <div className="pt-3 border-t-3 border-black">
                  <p className="font-bold mb-2">{user.username}</p>
                  <Button variant="outline" size="sm" onClick={handleLogout} className="w-full">
                    Logout
                  </Button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
