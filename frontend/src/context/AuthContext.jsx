import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

// Helper function to decode JWT
const parseJwt = (token) => {
    try {
        const base64Url = token.split('.')[1]
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        )
        return JSON.parse(jsonPayload)
    } catch (error) {
        return null
    }
}

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const token = localStorage.getItem('token')
        if (token) {
            try {
                const decoded = parseJwt(token)
                if (decoded && decoded.exp * 1000 > Date.now()) {
                    setUser({
                        userId: decoded.userId,
                        email: decoded.sub,
                        role: decoded.role
                    })
                } else {
                    localStorage.removeItem('token')
                }
            } catch (error) {
                localStorage.removeItem('token')
            }
        }
        setLoading(false)
    }, [])

    const login = (token) => {
        localStorage.setItem('token', token)
        const decoded = parseJwt(token)
        setUser({
            userId: decoded.userId,
            email: decoded.sub,
            role: decoded.role
        })
    }

    const logout = () => {
        localStorage.removeItem('token')
        setUser(null)
    }

    const getToken = () => localStorage.getItem('token')

    return (
        <AuthContext.Provider value={{ user, login, logout, loading, getToken }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider')
    }
    return context
}