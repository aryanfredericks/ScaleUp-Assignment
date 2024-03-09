import { StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import AuthContext from './AuthContext'

const AuthProvider = ({ children }) => {
    const [isAuthenticated, setAuthenticated] = useState(false);
    return (
        <AuthContext.Provider value={{ isAuthenticated, setAuthenticated }}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthProvider