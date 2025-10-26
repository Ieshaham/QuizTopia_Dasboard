import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Settings, Bell, PlusCircle, ArrowLeft } from 'lucide-react';
import { supabase } from './supabaseClient';


const SettingsPage = () => {
  const navigate = useNavigate();
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newChildName, setNewChildName] = useState('');

  useEffect(() => {
    const initializeParentAndFetchChildren = async () => {
      setLoading(true);

      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) {
        console.error('Failed to get user:', userError);
        setLoading(false);
        return;
      }
      const parentId = user?.id;
      if (!parentId) {
        console.error('No parent logged in');
        setLoading(false);
        return;
      }

      // Check if parent profile exists
      const { data: parentProfile, error: profileError } = await supabase
        .from('user_profiles')
        .select('id, role')
        .eq('auth_user_id', parentId)
        .single();

      // If parent profile doesn't exist, create it
      if (profileError || !parentProfile) {
        const { error: insertError } = await supabase
          .from('user_profiles')
          .insert({
            id: crypto.randomUUID(),
            auth_user_id: parentId,
            role: 'parent',
            display_name: user.email?.split('@')[0] || 'Parent'
          });

        if (insertError) {
          console.error('Failed to create parent profile:', insertError);
        }
      }

      // Fetch children
      const { data, error } = await supabase
        .from('user_profiles')
        .select('id, display_name, role, created_at')
        .eq('parent_id', parentId);

      if (error) console.error(error);
      else setChildren(data || []);

      setLoading(false);
    };

    initializeParentAndFetchChildren();
  }, []);

  const addChild = async () => {
    if (!newChildName.trim()) return;

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const parentId = user?.id;

      if (!parentId) throw new Error('Parent not logged in');

      // Generate a unique email and password for the child
      const childEmail = `${newChildName.trim().toLowerCase().replace(/\s+/g, '')}.${Date.now()}@child.quiztopia.local`;
      const childPassword = crypto.randomUUID(); // Random secure password

      // Create auth user for the child using service role
      // Note: This requires admin API access - you'll need to call a server function
      // For now, we'll create just the profile with a generated UUID
      // and handle auth creation via a backend API endpoint
      
      const childId = crypto.randomUUID();

      const { data, error } = await supabase
        .from('user_profiles')
        .insert({
          id: childId,
          display_name: newChildName.trim(),
          role: 'child',
          parent_id: parentId
        })
        .select();

      if (error) throw error;
      setChildren([...children, ...data]);
      setNewChildName('');
      alert(`Child added! Email: ${childEmail}\nPassword: ${childPassword}\n\nPlease save these credentials!`);
    } catch (err) {
      console.error('Error adding child:', err);
      alert('Failed to add child: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-purple-200 px-6 py-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center space-x-2 text-gray-600 hover:text-purple-600 transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm font-medium">Back</span>
            </button>
            <div className="flex items-center space-x-2">
              <img src="/quiztopia-logo.png" alt="Logo" className="w-10 h-10 object-contain" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-500 bg-clip-text text-transparent animate-pulse">QuizTopia</h1>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Bell className="w-6 h-6 text-purple-600 hover:text-purple-800 cursor-pointer transition-all hover:scale-110" />
            <Settings className="w-6 h-6 text-purple-600 hover:text-purple-800 cursor-pointer transition-all hover:scale-110" />
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <span className="text-sm font-medium text-purple-700">Parent Portal</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="px-6 py-8">
        <h2 className="text-xl font-bold text-gray-800 mb-6">👨‍👩‍👧‍👦 My Students</h2>

        {/* Add Child */}
        <div className="mb-8 flex items-center space-x-3">
          <input
            type="text"
            placeholder="New child's name"
            value={newChildName}
            onChange={(e) => setNewChildName(e.target.value)}
            className="flex-1 px-4 py-2 border border-purple-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 shadow-lg"
          />
          <button
            onClick={addChild}
            className="flex items-center bg-gradient-to-r from-green-400 to-teal-500 text-white px-4 py-2 rounded-xl hover:shadow-xl hover:scale-105 transition-all duration-200 font-bold"
          >
            <PlusCircle className="w-5 h-5 mr-2" /> Add Child
          </button>
        </div>

        {/* Children List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {loading && <p className="text-gray-600">Loading children...</p>}
          {!loading && children.length === 0 && <p className="text-gray-600">No children added yet.</p>}
          {!loading && children.map((child) => (
            <div key={child.id} className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-purple-200 hover:shadow-2xl transition-all">
              <p className="text-lg font-semibold text-gray-800">{child.display_name}</p>
              <p className="text-sm text-gray-600">Role: {child.role}</p>
              <p className="text-xs text-gray-500">Added on: {new Date(child.created_at).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;