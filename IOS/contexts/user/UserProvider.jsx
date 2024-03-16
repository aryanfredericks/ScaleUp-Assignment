import { useState } from 'react'
import React from 'react'
import UserContext from './UserContext'
const UserProvider = ({ children }) => {

    const [signupData, setSignupData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    })
    const [loginData, setLoginData] = useState({
        email: "",
        password: "",
    })

    return (
        <UserContext.Provider value={{ signupData, setSignupData, loginData, setLoginData }}>
            {children}
        </UserContext.Provider>
    )
}

export default UserProvider
