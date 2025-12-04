// import { useState } from 'react';
// import { Eye, EyeOff, Mail, Lock, User, ArrowRight } from 'lucide-react';
// import { supabase } from './supabaseClient';
// import { useNavigate } from 'react-router-dom';

// export default function AuthScreen() {
//   const [isLogin, setIsLogin] = useState(true);
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     password: '',
//     confirmPassword: '',
//     role: 'child' // default role for signup
//   });

//   const navigate = useNavigate();

//   const handleInputChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (isLogin) {
//       // --------------------
//       // LOGIN
//       // --------------------
//       const { data, error } = await supabase.auth.signInWithPassword({
//         email: formData.email,
//         password: formData.password
//       });

//       if (error) {
//         alert(error.message);
//         return;
//       }

//       // Fetch user profile to determine role
//       const { data: profileData, error: profileError } = await supabase
//         .from('user_profiles')
//         .select('role')
//         .eq('id', data.user.id)
//         .single();

//       if (profileError || !profileData) {
//         alert('Error fetching user profile');
//         return;
//       }

//       // Navigate based on role
//       if (profileData.role === 'child') {
//         navigate('/gaming'); // Show subject selection screen
//       } else if (profileData.role === 'parent') {
//         navigate('/dashboard');
//       } else {
//         navigate('/dashboard'); // fallback
//       }

//     } else {
//       // --------------------
//       // SIGNUP
//       // --------------------
//       if (formData.password !== formData.confirmPassword) {
//         alert("Passwords don't match!");
//         return;
//       }

//       const { data, error } = await supabase.auth.signUp({
//         email: formData.email,
//         password: formData.password
//       });

//       if (error) {
//         alert(error.message);
//         return;
//       }

//       const userId = data.user.id;

//       // Insert into user_profiles
//       const { error: profileError } = await supabase
//         .from('user_profiles')
//         .insert([
//           {
//             id: userId,
//             role: formData.role,
//             display_name: formData.name,
//             parent_id: null // adjust if parent creates child
//           }
//         ]);

//       if (profileError) {
//         console.error(profileError);
//         alert("Error creating user profile");
//         return;
//       }

//       alert("Account created! Please check your email to confirm.");
//       setIsLogin(true); // switch to login after sign-up
//     }
//   };

//   const toggleMode = (mode) => {
//     setIsLogin(mode === 'login');
//     setFormData({
//       name: '',
//       email: '',
//       password: '',
//       confirmPassword: '',
//       role: 'child'
//     });
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center p-3 bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600">
//       {/* Background animations */}
//       <div className="absolute inset-0 overflow-hidden">
//         <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
//         <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-orange-400 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
//         <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
//       </div>

//       <div className="relative w-full max-w-md">
//         <div className="bg-white/95 backdrop-blur-xl border border-white/30 rounded-3xl shadow-2xl p-6 relative overflow-hidden">
//           <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-400 via-blue-500 to-yellow-400"></div>
          
//           {/* Header */}
//           <div className="text-center mb-6">
//             <div className="w-16 h-16 mx-auto mb-3 flex items-center justify-center">
//               <img src="/quiztopia-logo.png" alt="QuizTopia Logo" className="w-full h-full object-contain rounded-2xl" />
//             </div>
//             <h1 className="text-2xl font-bold text-gray-800 mb-1">
//               {isLogin ? 'Welcome back to' : 'Join'}
//             </h1>
//             <h2 className="text-xl font-bold text-blue-600 mb-1">QuizTopia</h2>
//             <p className="text-sm text-gray-600">
//               {isLogin ? 'Sign in to continue learning' : 'Start your learning journey today'}
//             </p>
//           </div>

//           {/* Toggle buttons */}
//           <div className="relative bg-gray-100 rounded-2xl p-1 mb-6">
//             <div 
//               className={`absolute top-1 bottom-1 w-1/2 bg-blue-500 rounded-xl transition-transform duration-300 ease-out shadow-md ${
//                 isLogin ? 'translate-x-0' : 'translate-x-full'
//               }`}
//             ></div>
//             <div className="relative flex">
//               <button
//                 type="button"
//                 onClick={() => toggleMode('login')}
//                 className={`flex-1 py-2.5 text-sm font-semibold rounded-xl transition-colors duration-200 ${
//                   isLogin ? 'text-white' : 'text-gray-600'
//                 }`}
//               >
//                 Sign In
//               </button>
//               <button
//                 type="button"
//                 onClick={() => toggleMode('register')}
//                 className={`flex-1 py-2.5 text-sm font-semibold rounded-xl transition-colors duration-200 ${
//                   !isLogin ? 'text-white' : 'text-gray-600'
//                 }`}
//               >
//                 Sign Up
//               </button>
//             </div>
//           </div>

//           {/* Form */}
//           <div className="space-y-4">
//             {/* Name field (register only) */}
//             {!isLogin && (
//               <div className="relative">
//                 <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//                 <input
//                   type="text"
//                   name="name"
//                   placeholder="Full name"
//                   value={formData.name}
//                   onChange={handleInputChange}
//                   className="w-full pl-10 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
//                 />
//               </div>
//             )}

//             {/* Email */}
//             <div className="relative">
//               <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//               <input
//                 type="email"
//                 name="email"
//                 placeholder="Email address"
//                 value={formData.email}
//                 onChange={handleInputChange}
//                 required
//                 className="w-full pl-10 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
//               />
//             </div>

//             {/* Password */}
//             <div className="relative">
//               <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//               <input
//                 type={showPassword ? 'text' : 'password'}
//                 name="password"
//                 placeholder="Password"
//                 value={formData.password}
//                 onChange={handleInputChange}
//                 required
//                 className="w-full pl-10 pr-10 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowPassword(!showPassword)}
//                 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
//               >
//                 {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
//               </button>
//             </div>

//             {/* Confirm password (register only) */}
//             {!isLogin && (
//               <div className="relative">
//                 <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//                 <input
//                   type={showConfirmPassword ? 'text' : 'password'}
//                   name="confirmPassword"
//                   placeholder="Confirm password"
//                   value={formData.confirmPassword}
//                   onChange={handleInputChange}
//                   className="w-full pl-10 pr-10 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                   className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
//                 >
//                   {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
//                 </button>
//               </div>
//             )}

//             {/* Role selection (register only) */}
//             {!isLogin && (
//               <div>
//                 <label className="block text-gray-600 mb-1">Role:</label>
//                 <select
//                   name="role"
//                   value={formData.role}
//                   onChange={handleInputChange}
//                   className="w-full pl-3 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
//                 >
//                   <option value="child">Child</option>
//                   <option value="parent">Parent</option>
//                 </select>
//               </div>
//             )}

//             {/* Submit */}
//             <button
//               type="button"
//               onClick={handleSubmit}
//               className="w-full bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white py-3 rounded-xl font-semibold focus:outline-none focus:ring-4 focus:ring-orange-200 transition-all duration-200 flex items-center justify-center group shadow-lg"
//             >
//               {isLogin ? 'Sign In' : 'Create Account'}
//               <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


import { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, AlertCircle, CheckCircle } from 'lucide-react';
import { supabase } from './supabaseClient';
import { useNavigate } from 'react-router-dom';

export default function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, text: '', color: '' });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'child'
  });

  const navigate = useNavigate();

  // ============================================
  // PASSWORD STRENGTH CHECKER
  // ============================================
  const checkPasswordStrength = (password) => {
    let score = 0;
    const checks = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[^A-Za-z0-9]/.test(password)
    };

    if (checks.length) score++;
    if (checks.uppercase) score++;
    if (checks.lowercase) score++;
    if (checks.number) score++;
    if (checks.special) score++;

    if (password.length >= 12) score++;

    let strengthText = '';
    let strengthColor = '';

    if (score <= 2) {
      strengthText = 'Weak';
      strengthColor = 'text-red-500';
    } else if (score <= 4) {
      strengthText = 'Fair';
      strengthColor = 'text-yellow-500';
    } else if (score <= 5) {
      strengthText = 'Good';
      strengthColor = 'text-blue-500';
    } else {
      strengthText = 'Strong';
      strengthColor = 'text-green-500';
    }

    return { score, text: strengthText, color: strengthColor, checks };
  };

  // ============================================
  // INPUT VALIDATION & SANITIZATION
  // ============================================
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const sanitizeInput = (input) => {
    // Remove potential XSS characters
    return input.replace(/[<>]/g, '');
  };

  const validatePassword = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length < minLength) {
      return { valid: false, message: 'Password must be at least 8 characters long' };
    }
    if (!hasUpperCase) {
      return { valid: false, message: 'Password must contain at least one uppercase letter' };
    }
    if (!hasLowerCase) {
      return { valid: false, message: 'Password must contain at least one lowercase letter' };
    }
    if (!hasNumbers) {
      return { valid: false, message: 'Password must contain at least one number' };
    }
    if (!hasSpecialChar) {
      return { valid: false, message: 'Password must contain at least one special character' };
    }

    return { valid: true, message: '' };
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Sanitize input
    const sanitizedValue = name === 'email' ? value.toLowerCase().trim() : sanitizeInput(value);

    setFormData({
      ...formData,
      [name]: sanitizedValue
    });

    // Clear errors when user starts typing
    if (error) setError('');
    if (success) setSuccess('');

    // Check password strength in real-time
    if (name === 'password' && !isLogin) {
      const strength = checkPasswordStrength(sanitizedValue);
      setPasswordStrength(strength);
    }
  };

  // ============================================
  // RATE LIMITING (Client-side)
  // ============================================
  const [attemptCount, setAttemptCount] = useState(0);
  const [lastAttemptTime, setLastAttemptTime] = useState(0);

  const checkRateLimit = () => {
    const now = Date.now();
    const timeWindow = 60000; // 1 minute
    const maxAttempts = 5;

    if (now - lastAttemptTime > timeWindow) {
      // Reset counter after time window
      setAttemptCount(1);
      setLastAttemptTime(now);
      return true;
    }

    if (attemptCount >= maxAttempts) {
      setError('Too many attempts. Please wait a minute before trying again.');
      return false;
    }

    setAttemptCount(attemptCount + 1);
    setLastAttemptTime(now);
    return true;
  };

  // ============================================
  // FORM SUBMISSION WITH VALIDATION
  // ============================================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Rate limiting check
    if (!checkRateLimit()) {
      return;
    }

    // Validate email
    if (!validateEmail(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    // Validate password length
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    if (isLogin) {
      // --------------------
      // LOGIN
      // --------------------
      setLoading(true);

      try {
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password
        });

        if (signInError) {
          // Generic error message to prevent user enumeration
          setError('Invalid email or password');
          setLoading(false);
          return;
        }

        // Fetch user profile to determine role
        const { data: profileData, error: profileError } = await supabase
          .from('user_profiles')
          .select('role, display_name')
          .eq('id', data.user.id)
          .single();

        if (profileError || !profileData) {
          setError('Error loading profile. Please try again.');
          setLoading(false);
          return;
        }

        // Log successful login (optional - for audit trail)
        await supabase.from('audit_logs').insert({
          user_id: data.user.id,
          action: 'login',
          ip_address: 'client', // In production, get actual IP from backend
          timestamp: new Date().toISOString()
        });

        // Navigate based on role
        if (profileData.role === 'child') {
          navigate('/gaming');
        } else if (profileData.role === 'parent') {
          navigate('/dashboard');
        } else {
          navigate('/dashboard');
        }

      } catch (err) {
        console.error('Login error:', err);
        setError('An unexpected error occurred. Please try again.');
      } finally {
        setLoading(false);
      }

    } else {
      // --------------------
      // SIGNUP
      // --------------------
      
      // Additional validation for signup
      const passwordValidation = validatePassword(formData.password);
      if (!passwordValidation.valid) {
        setError(passwordValidation.message);
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        setError("Passwords don't match!");
        return;
      }

      if (!formData.name || formData.name.length < 2) {
        setError('Please enter a valid name (at least 2 characters)');
        return;
      }

      // Check password strength
      if (passwordStrength.score < 3) {
        setError('Please choose a stronger password');
        return;
      }

      setLoading(true);

      try {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              display_name: formData.name,
              role: formData.role
            }
          }
        });

        if (signUpError) {
          // Check for specific errors
          if (signUpError.message.includes('already registered')) {
            setError('An account with this email already exists');
          } else {
            setError(signUpError.message);
          }
          setLoading(false);
          return;
        }

        const userId = data.user.id;

        // Insert into user_profiles with additional security
        const { error: profileError } = await supabase
          .from('user_profiles')
          .insert([
            {
              id: userId,
              role: formData.role,
              display_name: formData.name,
              parent_id: null,
              created_at: new Date().toISOString()
            }
          ]);

        if (profileError) {
          console.error(profileError);
          setError("Error creating user profile. Please contact support.");
          setLoading(false);
          return;
        }

        // Log successful signup
        await supabase.from('audit_logs').insert({
          user_id: userId,
          action: 'signup',
          ip_address: 'client',
          timestamp: new Date().toISOString()
        });

        setSuccess("Account created! Please check your email to confirm.");
        
        // Clear form and switch to login
        setTimeout(() => {
          setIsLogin(true);
          setFormData({
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
            role: 'child'
          });
          setSuccess('');
        }, 3000);

      } catch (err) {
        console.error('Signup error:', err);
        setError('An unexpected error occurred. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  const toggleMode = (mode) => {
    setIsLogin(mode === 'login');
    setError('');
    setSuccess('');
    setPasswordStrength({ score: 0, text: '', color: '' });
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

          {/* Error Alert */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2 animate-shake">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Success Alert */}
          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-green-700">{success}</p>
            </div>
          )}

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
                disabled={loading}
                className={`flex-1 py-2.5 text-sm font-semibold rounded-xl transition-colors duration-200 ${
                  isLogin ? 'text-white' : 'text-gray-600'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => toggleMode('register')}
                disabled={loading}
                className={`flex-1 py-2.5 text-sm font-semibold rounded-xl transition-colors duration-200 ${
                  !isLogin ? 'text-white' : 'text-gray-600'
                }`}
              >
                Sign Up
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
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
                  required={!isLogin}
                  minLength={2}
                  maxLength={50}
                  disabled={loading}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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
                disabled={loading}
                autoComplete="email"
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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
                minLength={8}
                disabled={loading}
                autoComplete={isLogin ? "current-password" : "new-password"}
                className="w-full pl-10 pr-10 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors disabled:cursor-not-allowed"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Password Strength Indicator (register only) */}
            {!isLogin && formData.password && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600">Password Strength:</span>
                  <span className={`font-semibold ${passwordStrength.color}`}>
                    {passwordStrength.text}
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      passwordStrength.score <= 2
                        ? 'bg-red-500'
                        : passwordStrength.score <= 4
                        ? 'bg-yellow-500'
                        : passwordStrength.score <= 5
                        ? 'bg-blue-500'
                        : 'bg-green-500'
                    }`}
                    style={{ width: `${(passwordStrength.score / 6) * 100}%` }}
                  ></div>
                </div>
                <div className="text-xs text-gray-500 space-y-1">
                  <p className={passwordStrength.checks?.length ? 'text-green-600' : ''}>
                    ✓ At least 8 characters
                  </p>
                  <p className={passwordStrength.checks?.uppercase ? 'text-green-600' : ''}>
                    ✓ One uppercase letter
                  </p>
                  <p className={passwordStrength.checks?.number ? 'text-green-600' : ''}>
                    ✓ One number
                  </p>
                  <p className={passwordStrength.checks?.special ? 'text-green-600' : ''}>
                    ✓ One special character
                  </p>
                </div>
              </div>
            )}

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
                  required={!isLogin}
                  disabled={loading}
                  autoComplete="new-password"
                  className="w-full pl-10 pr-10 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={loading}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors disabled:cursor-not-allowed"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            )}

            {/* Role selection (register only) */}
            {!isLogin && (
              <div>
                <label className="block text-gray-600 mb-2 text-sm font-medium">Account Type:</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  disabled={loading}
                  className="w-full pl-3 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="child">Child Account</option>
                  <option value="parent">Parent Account</option>
                </select>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white py-3 rounded-xl font-semibold focus:outline-none focus:ring-4 focus:ring-orange-200 transition-all duration-200 flex items-center justify-center group shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  {isLogin ? 'Sign In' : 'Create Account'}
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Security Notice */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              🔒 Your data is encrypted and secure
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}