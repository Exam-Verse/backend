import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Input } from '../components/ui';
import { authAPI } from '../services/api';
import { useAuthStore } from '../store/authStore';

export const Login = () => {
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await authAPI.login(formData);
      const { user, token } = response.data;
      setUser(user, token);
      navigate(`/${user.role}/dashboard`);
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen py-20">
      <div className="container-brutal">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Welcome <span className="text-primary">Back</span>
            </h1>
            <p className="text-gray-700">
              Login to access your dashboard and saved papers
            </p>
          </div>
          
          <div className="card-brutal bg-white">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-danger text-white p-4 border-3 border-black font-bold">
                  ⚠ {error}
                </div>
              )}
              
              <Input
                label="Email"
                type="email"
                name="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
              
              <Input
                label="Password"
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              
              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 border-2 border-black" />
                  <span className="text-sm font-bold">Remember me</span>
                </label>
                <a href="#" className="text-sm font-bold text-primary hover:underline">
                  Forgot password?
                </a>
              </div>
              
              <Button
                type="submit"
                variant="primary"
                className="w-full"
                disabled={loading}
              >
                {loading ? 'Logging in...' : 'Login'}
              </Button>
              
              <div className="text-center">
                <p className="text-sm">
                  Don't have an account?{' '}
                  <Link to="/register" className="font-bold text-primary hover:underline">
                    Sign up here
                  </Link>
                </p>
              </div>
            </form>
          </div>
          
          {/* Quick Login Options */}
          <div className="mt-8 grid grid-cols-2 gap-4">
            <div className="card-brutal bg-secondary p-4 text-center">
              <p className="font-bold text-sm mb-2">For Students</p>
              <Link to="/register" className="text-xs font-bold underline">
                Create Account →
              </Link>
            </div>
            <div className="card-brutal bg-accent p-4 text-center">
              <p className="font-bold text-sm mb-2">For Faculty</p>
              <Link to="/faculty/register" className="text-xs font-bold underline">
                Register Here →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
