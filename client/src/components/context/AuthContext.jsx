import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
    const [authState, setAuthState] = useState({
        token: localStorage.getItem('token'), // Retrieve the token from local storage
        isAuthenticated: !!localStorage.getItem('token') // Boolean flag
    })

    const login = (token) => {
        localStorage.setItem('token', token)
        setAuthState({ token, isAuthenticated: true })
    }

    const logout = () => {
        localStorage.removeItem('token')
        setAuthState({ token: null, isAuthenticated: false })
    }

    return (
        <AuthContext.Provider value={{ ...authState, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)