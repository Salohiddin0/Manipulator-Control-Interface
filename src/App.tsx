"use client"

import { useState, useEffect } from "react"
import { Box, Typography, Container } from "@mui/material"
import LoginForm from "./components/LoginForm"
import ManipulatorInterface from "./components/ManipulatorInterface"

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const auth = localStorage.getItem("isAuthenticated")
    if (auth === "true") {
      setIsAuthenticated(true)
    }
  }, [])

  const handleLogin = (username: string, password: string) => {
    if (username === "admin" && password === "admin") {
      setIsAuthenticated(true)
      localStorage.setItem("isAuthenticated", "true")
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    localStorage.removeItem("isAuthenticated")
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Manipulator Control Interface
        </Typography>
        {isAuthenticated ? <ManipulatorInterface onLogout={handleLogout} /> : <LoginForm onLogin={handleLogin} />}
      </Box>
    </Container>
  )
}

export default App
