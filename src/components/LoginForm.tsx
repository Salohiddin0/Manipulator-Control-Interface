"use client"

import { useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { Box, TextField, Button, Paper, Typography, Container } from "@mui/material"

interface LoginFormProps {
  onLogin: (username: string, password: string) => void
}

interface FormData {
  username: string
  password: string
}

export default function LoginForm({ onLogin }: LoginFormProps) {
  const [error, setError] = useState("")
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      username: "",
      password: "",
    },
  })

  const onSubmit = (data: FormData) => {
    if (data.username === "admin" && data.password === "admin") {
      onLogin(data.username, data.password)
    } else {
      setError("Invalid credentials. Use admin/admin")
    }
  }

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h5" component="h2" gutterBottom align="center">
          Login
        </Typography>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 1 }}>
          <Controller
            name="username"
            control={control}
            rules={{ required: "Username is required" }}
            render={({ field }) => (
              <TextField
                {...field}
                margin="normal"
                required
                fullWidth
                id="username"
                label="Username"
                autoComplete="username"
                autoFocus
                error={!!errors.username}
                helperText={errors.username?.message}
              />
            )}
          />
          <Controller
            name="password"
            control={control}
            rules={{ required: "Password is required" }}
            render={({ field }) => (
              <TextField
                {...field}
                margin="normal"
                required
                fullWidth
                id="password"
                label="Password"
                type="password"
                autoComplete="current-password"
                error={!!errors.password}
                helperText={errors.password?.message}
              />
            )}
          />
          {error && (
            <Typography color="error" align="center" sx={{ mt: 2 }}>
              {error}
            </Typography>
          )}
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
            Sign In
          </Button>
          <Typography variant="body2" color="text.secondary" align="center">
            Use admin/admin to login
          </Typography>
        </Box>
      </Paper>
    </Container>
  )
}
