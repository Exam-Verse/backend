import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Input, Select } from '../components/ui';
import { authAPI } from '../services/api';
import { useAuthStore } from '../store/authStore';

export const Register = () => {
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);
  
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    role: 'student',
    college: '',
    course: '',
    year: '',
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error for this field
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };
  
  const validate = () => {
    const newErrors = {};
    
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    
    if (!formData.username) newErrors.username = 'Username is required';
    else if (formData.username.length < 3) newErrors.username = 'Username must be at least 3 characters';
    
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (formData.role === 'student') {
      if (!formData.college) newErrors.college = 'College is required';
      if (!formData.course) newErrors.course = 'Course is required';
      if (!formData.year) newErrors.year = 'Year is required';
    }
    
    return newErrors;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await authAPI.register(formData);
      const { user, token } = response.data;
      setUser(user, token);
      navigate(`/${user.role}/dashboard`);
    } catch (error) {
      setErrors({
        submit: error.response?.data?.detail || 'Registration failed. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen py-20">
      <div className="container-brutal">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Create Your <span className="text-primary">Account</span>
            </h1>
            <p className="text-gray-700">
              Join ExamVerse and start accessing previous-year papers today!
            </p>
          </div>
          
          <div className="card-brutal bg-white">
            <form onSubmit={handleSubmit} className="space-y-6">
              {errors.submit && (
                <div className="bg-danger text-white p-4 border-3 border-black font-bold">
                  ⚠ {errors.submit}
                </div>
              )}
              
              {/* Role Selection */}
              <Select
                label="I am a"
                name="role"
                value={formData.role}
                onChange={handleChange}
                options={[
                  { value: 'student', label: 'Student' },
                  { value: 'faculty', label: 'Faculty' },
                ]}
                required
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Email"
                  type="email"
                  name="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  error={errors.email}
                  required
                />
                
                <Input
                  label="Username"
                  type="text"
                  name="username"
                  placeholder="Choose a username"
                  value={formData.username}
                  onChange={handleChange}
                  error={errors.username}
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Password"
                  type="password"
                  name="password"
                  placeholder="Minimum 6 characters"
                  value={formData.password}
                  onChange={handleChange}
                  error={errors.password}
                  required
                />
                
                <Input
                  label="Confirm Password"
                  type="password"
                  name="confirmPassword"
                  placeholder="Re-enter password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  error={errors.confirmPassword}
                  required
                />
              </div>
              
              {formData.role === 'student' && (
                <>
                  <div className="border-t-3 border-black pt-6">
                    <h3 className="font-bold text-lg uppercase mb-4">Student Details</h3>
                    <div className="space-y-6">
                      <Input
                        label="College"
                        type="text"
                        name="college"
                        placeholder="Your college name"
                        value={formData.college}
                        onChange={handleChange}
                        error={errors.college}
                        required
                      />
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input
                          label="Course"
                          type="text"
                          name="course"
                          placeholder="e.g., B.Tech CSE"
                          value={formData.course}
                          onChange={handleChange}
                          error={errors.course}
                          required
                        />
                        
                        <Select
                          label="Year"
                          name="year"
                          value={formData.year}
                          onChange={handleChange}
                          options={[
                            { value: '1', label: '1st Year' },
                            { value: '2', label: '2nd Year' },
                            { value: '3', label: '3rd Year' },
                            { value: '4', label: '4th Year' },
                          ]}
                          error={errors.year}
                          required
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}
              
              {formData.role === 'faculty' && (
                <div className="bg-secondary p-4 border-3 border-black">
                  <p className="font-bold text-sm">
                    📝 Note: Faculty accounts require admin verification. You'll need to upload your college ID after registration.
                  </p>
                </div>
              )}
              
              <Button
                type="submit"
                variant="primary"
                className="w-full"
                disabled={loading}
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </Button>
              
              <div className="text-center">
                <p className="text-sm">
                  Already have an account?{' '}
                  <Link to="/login" className="font-bold text-primary hover:underline">
                    Login here
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
