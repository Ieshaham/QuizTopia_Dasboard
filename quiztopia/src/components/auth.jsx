import { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight } from 'lucide-react';
import { supabase } from './supabaseClient';
import { useNavigate } from 'react-router-dom';

export default function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'child' // default role for signup
  });

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isLogin) {
      // --------------------
      // LOGIN
      // --------------------
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password
      });

      if (error) {
        alert(error.message);
        return;
      }

      // Fetch user profile to determine role
      const { data: profileData, error: profileError } = await supabase
        .from('user_profiles')
        .select('role')
        .eq('id', data.user.id)
        .single();

      if (profileError || !profileData) {
        alert('Error fetching user profile');
        return;
      }

      // Navigate based on role
      if (profileData.role === 'child') {
        navigate('/gaming'); // Show subject selection screen
      } else if (profileData.role === 'parent') {
        navigate('/dashboard');
      } else {
        navigate('/dashboard'); // fallback
      }

    } else {
      // --------------------
      // SIGNUP
      // --------------------
      if (formData.password !== formData.confirmPassword) {
        alert("Passwords don't match!");
        return;
      }

      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password
      });

      if (error) {
        alert(error.message);
        return;
      }

      const userId = data.user.id;

      // Insert into user_profiles
      const { error: profileError } = await supabase
        .from('user_profiles')
        .insert([
          {
            id: userId,
            role: formData.role,
            display_name: formData.name,
            parent_id: null // adjust if parent creates child
          }
        ]);

      if (profileError) {
        console.error(profileError);
        alert("Error creating user profile");
        return;
      }

      alert("Account created! Please check your email to confirm.");
      setIsLogin(true); // switch to login after sign-up
    }
  };

  const toggleMode = (mode) => {
    setIsLogin(mode === 'login');
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'child'
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-3 bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600">
      {/* Background animations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-orange-400 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
      </div>

      <div className="relative w-full max-w-md">
        <div className="bg-white/95 backdrop-blur-xl border border-white/30 rounded-3xl shadow-2xl p-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-400 via-blue-500 to-yellow-400"></div>
          
          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-16 h-16 mx-auto mb-3 flex items-center justify-center">
              <img src="/quiztopia-logo.png" alt="QuizTopia Logo" className="w-full h-full object-contain rounded-2xl" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-1">
              {isLogin ? 'Welcome back to' : 'Join'}
            </h1>
            <h2 className="text-xl font-bold text-blue-600 mb-1">QuizTopia</h2>
            <p className="text-sm text-gray-600">
              {isLogin ? 'Sign in to continue learning' : 'Start your learning journey today'}
            </p>
          </div>

          {/* Toggle buttons */}
          <div className="relative bg-gray-100 rounded-2xl p-1 mb-6">
            <div 
              className={`absolute top-1 bottom-1 w-1/2 bg-blue-500 rounded-xl transition-transform duration-300 ease-out shadow-md ${
                isLogin ? 'translate-x-0' : 'translate-x-full'
              }`}
            ></div>
            <div className="relative flex">
              <button
                type="button"
                onClick={() => toggleMode('login')}
                className={`flex-1 py-2.5 text-sm font-semibold rounded-xl transition-colors duration-200 ${
                  isLogin ? 'text-white' : 'text-gray-600'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => toggleMode('register')}
                className={`flex-1 py-2.5 text-sm font-semibold rounded-xl transition-colors duration-200 ${
                  !isLogin ? 'text-white' : 'text-gray-600'
                }`}
              >
                Sign Up
              </button>
            </div>
          </div>

          {/* Form */}
          <div className="space-y-4">
            {/* Name field (register only) */}
            {!isLogin && (
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  name="name"
                  placeholder="Full name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            )}

            {/* Email */}
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="email"
                name="email"
                placeholder="Email address"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                required
                className="w-full pl-10 pr-10 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Confirm password (register only) */}
            {!isLogin && (
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  placeholder="Confirm password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-10 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            )}

            {/* Role selection (register only) */}
            {!isLogin && (
              <div>
                <label className="block text-gray-600 mb-1">Role:</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="w-full pl-3 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="child">Child</option>
                  <option value="parent">Parent</option>
                </select>
              </div>
            )}

            {/* Submit */}
            <button
              type="button"
              onClick={handleSubmit}
              className="w-full bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white py-3 rounded-xl font-semibold focus:outline-none focus:ring-4 focus:ring-orange-200 transition-all duration-200 flex items-center justify-center group shadow-lg"
            >
              {isLogin ? 'Sign In' : 'Create Account'}
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}