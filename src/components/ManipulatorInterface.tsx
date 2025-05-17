'use client'

import { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Grid,
  Slider,
  Snackbar,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material'
import { useAppDispatch, useAppSelector } from '../lib/hooks'
import { addCommandHistory } from '../lib/features/manipulator/manipulatorSlice'
import ManipulatorGrid from './ManipulatorGrid'
import { optimizeCommands } from '../lib/utils'

interface ManipulatorInterfaceProps {
  onLogout: () => void
}

interface FormData {
  commands: string
}

interface Sample {
  x: number
  y: number
  collected: boolean
}

export default function ManipulatorInterface ({
  onLogout
}: ManipulatorInterfaceProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [samples, setSamples] = useState<Sample[]>([])
  const [holdingSample, setHoldingSample] = useState(false)
  const [animationSpeed, setAnimationSpeed] = useState(500)
  const [isAnimating, setIsAnimating] = useState(false)
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')
  const [initialSamplesState, setInitialSamplesState] = useState<Sample[]>([])

  const dispatch = useAppDispatch()
  const commandHistory = useAppSelector(
    state => state.manipulator.commandHistory
  )

  const { control, handleSubmit, reset } = useForm<FormData>({
    defaultValues: {
      commands: ''
    }
  })

  useEffect(() => {
    // Generate random samples
    generateRandomSamples()
  }, [])

  const generateRandomSamples = () => {
    const newSamples: Sample[] = []
    // Generate 3 random samples
    for (let i = 0; i < 3; i++) {
      newSamples.push({
        x: Math.floor(Math.random() * 10),
        y: Math.floor(Math.random() * 10),
        collected: false
      })
    }
    setSamples(newSamples)
    setInitialSamplesState([...newSamples])
  }

  const executeCommands = async (commands: string) => {
    setIsAnimating(true)
    const optimized = optimizeCommands(commands)

    // Save initial state for history
    const initialState = JSON.stringify(
      samples.map(s => ({ x: s.x, y: s.y, collected: s.collected }))
    )

    // Execute each command with animation
    for (let i = 0; i < commands.length; i++) {
      const command = commands[i]
      await new Promise(resolve => setTimeout(resolve, animationSpeed))

      switch (command) {
        case 'Л':
          setPosition(prev => ({ ...prev, x: Math.max(0, prev.x - 1) }))
          break
        case 'П':
          setPosition(prev => ({ ...prev, x: Math.min(9, prev.x + 1) }))
          break
        case 'В':
          setPosition(prev => ({ ...prev, y: Math.max(0, prev.y - 1) }))
          break
        case 'Н':
          setPosition(prev => ({ ...prev, y: Math.min(9, prev.y + 1) }))
          break
        case 'О':
          // Try to pick up a sample
          if (!holdingSample) {
            const sampleIndex = samples.findIndex(
              s => s.x === position.x && s.y === position.y && !s.collected
            )
            if (sampleIndex !== -1) {
              const newSamples = [...samples]
              newSamples[sampleIndex].collected = true
              setSamples(newSamples)
              setHoldingSample(true)
            }
          }
          break
        case 'Б':
          // Drop the sample
          if (holdingSample) {
            setHoldingSample(false)
          }
          break
        default:
          break
      }
    }

    // Save final state for history
    const finalState = JSON.stringify(
      samples.map(s => ({ x: s.x, y: s.y, collected: s.collected }))
    )

    // Add to history
    dispatch(
      addCommandHistory({
        originalCommand: commands,
        optimizedCommand: optimized,
        timestamp: new Date().toISOString(),
        initialState,
        finalState
      })
    )

    setIsAnimating(false)
    setSnackbarMessage('Commands executed successfully!')
    setSnackbarOpen(true)
  }

  const onSubmit = (data: FormData) => {
    if (!isAnimating) {
      executeCommands(data.commands)
    }
  }

  const handleSpeedChange = (_event: Event, newValue: number | number[]) => {
    setAnimationSpeed(1000 - (newValue as number))
  }

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false)
  }

  const handleReset = () => {
    setPosition({ x: 0, y: 0 })
    setHoldingSample(false)
    setSamples([...initialSamplesState])
    reset()
  }

  return (
    <Box sx={{ mt: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
            <Typography variant='h6' gutterBottom>
              Manipulator Control
            </Typography>
            <Box component='form' onSubmit={handleSubmit(onSubmit)} noValidate>
              <Controller
                name='commands'
                control={control}
                rules={{ required: 'Commands are required' }}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    margin='normal'
                    required
                    fullWidth
                    id='commands'
                    label='Enter Commands (Л, П, В, Н, О, Б)'
                    autoFocus
                    error={!!fieldState.error}
                    helperText={
                      fieldState.error?.message ||
                      'Л - Left, П - Right, В - Up, Н - Down, О - Pick, Б - Drop'
                    }
                    disabled={isAnimating}
                  />
                )}
              />
              <Box
                sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}
              >
                <Button
                  type='submit'
                  variant='contained'
                  disabled={isAnimating}
                >
                  Execute Commands
                </Button>
                <Button
                  variant='outlined'
                  onClick={handleReset}
                  disabled={isAnimating}
                >
                  Reset
                </Button>
                <Button variant='outlined' color='error' onClick={onLogout}>
                  Logout
                </Button>
              </Box>
            </Box>
          </Paper>

          {/* Progress Bar */}

          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant='h6' gutterBottom>
              Animation Speed
            </Typography>
            <Slider
              defaultValue={500}
              min={100}
              max={1000}
              valueLabelDisplay='auto'
              onChange={handleSpeedChange}
              valueLabelFormat={value => `${(1000 - value).toFixed(0)}ms`}
              disabled={isAnimating}
            />
            <Typography variant='body2' color='text.secondary'>
              Slower ← → Faster
            </Typography>
          </Paper>
        </Grid>

        {/* Command History */}

        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant='h6' gutterBottom>
              Command History
            </Typography>
            <TableContainer>
              <Table size='small'>
                <TableHead>
                  <TableRow>
                    <TableCell>Original Command</TableCell>
                    <TableCell>Optimized Command</TableCell>
                    <TableCell>Date & Time</TableCell>
                    <TableCell>Initial State</TableCell>
                    <TableCell>Final State</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {commandHistory.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.originalCommand}</TableCell>
                      <TableCell>{item.optimizedCommand}</TableCell>
                      <TableCell>
                        {new Date(item.timestamp).toLocaleString()}
                      </TableCell>
                      <TableCell>{item.initialState}</TableCell>
                      <TableCell>{item.finalState}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }} // 👉 bu yer muhim!
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity='success'
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  )
}
