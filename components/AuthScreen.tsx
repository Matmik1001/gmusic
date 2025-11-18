
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const AuthScreen: React.FC = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login, signUp } = useAuth();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        let success = false;
        try {
            if (isLogin) {
                success = login(name, password);
                if (!success) setError('Invalid credentials. Please try again.');
            } else {
                success = signUp(name, email, password);
                if (!success) setError('Email already exists.');
            }
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <div className="flex items-center justify-center h-full w-full">
            <div className="w-full max-w-md p-8 space-y-8 bg-black/20 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20">
                <div className="text-center">
                    <h1 className="text-4xl font-bold tracking-tight text-shadow">
                        {isLogin ? 'Welcome Back' : 'Create Account'}
                    </h1>
                    <p className="mt-2 text-purple-200 text-shadow">Access the future of music.</p>
                </div>
                <form className="space-y-6" onSubmit={handleSubmit}>
                    {!isLogin && (
                         <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Full Name"
                            required
                            className="w-full px-4 py-3 bg-white/10 rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                        />
                    )}
                     {isLogin ? (
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Username or Email"
                            required
                            className="w-full px-4 py-3 bg-white/10 rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                        />
                     ) : (
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email Address"
                            required
                            className="w-full px-4 py-3 bg-white/10 rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                        />
                     )}
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        required
                        className="w-full px-4 py-3 bg-white/10 rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                    />

                    {error && <p className="text-red-400 text-sm text-center">{error}</p>}

                    <button
                        type="submit"
                        className="w-full py-3 font-semibold text-white bg-purple-600 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-purple-500 transition transform hover:scale-105"
                    >
                        {isLogin ? 'Log In' : 'Sign Up'}
                    </button>
                </form>
                <div className="text-center">
                    <button onClick={() => { setIsLogin(!isLogin); setError(''); }} className="text-purple-300 hover:text-purple-100 transition">
                        {isLogin ? 'Need an account? Sign Up' : 'Already have an account? Log In'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AuthScreen;
