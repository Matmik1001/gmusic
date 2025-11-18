
import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { User, SubscriptionTier } from '../types';
import { ADMIN_CREDENTIALS } from '../data';

interface AuthContextType {
    currentUser: User | null;
    users: User[];
    login: (nameOrEmail: string, pass: string) => boolean;
    logout: () => void;
    signUp: (name: string, email: string, pass: string) => boolean;
    updateSubscription: (userId: number, newTier: SubscriptionTier) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ initialUsers: User[]; children: ReactNode }> = ({ initialUsers, children }) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [users, setUsers] = useState<User[]>(initialUsers);

    const login = useCallback((nameOrEmail: string, pass: string) => {
        let user: User | undefined;
        if (nameOrEmail.toLowerCase() === ADMIN_CREDENTIALS.name && pass === ADMIN_CREDENTIALS.password) {
             user = users.find(u => u.isAdmin);
        } else {
             user = users.find(u => (u.name.toLowerCase() === nameOrEmail.toLowerCase() || u.email.toLowerCase() === nameOrEmail.toLowerCase()) && u.password === pass);
        }

        if (user) {
            setCurrentUser(user);
            return true;
        }
        return false;
    }, [users]);

    const logout = useCallback(() => {
        setCurrentUser(null);
    }, []);

    const signUp = useCallback((name: string, email: string, pass:string) => {
        if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
            return false; // Email already exists
        }
        const newUser: User = {
            id: Date.now(),
            name,
            email,
            password: pass,
            subscription: SubscriptionTier.FREE,
            isAdmin: false
        };
        setUsers(prevUsers => [...prevUsers, newUser]);
        setCurrentUser(newUser);
        return true;
    }, [users]);

    const updateSubscription = useCallback((userId: number, newTier: SubscriptionTier) => {
        setUsers(prevUsers => prevUsers.map(u => u.id === userId ? { ...u, subscription: newTier } : u));
        if (currentUser?.id === userId) {
            setCurrentUser(prevUser => prevUser ? { ...prevUser, subscription: newTier } : null);
        }
    }, [currentUser]);

    return (
        <AuthContext.Provider value={{ currentUser, users, login, logout, signUp, updateSubscription }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
