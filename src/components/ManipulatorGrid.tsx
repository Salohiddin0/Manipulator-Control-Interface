import { Box, Paper, Grid } from '@mui/material'

interface ManipulatorGridProps {
  position: { x: number; y: number }
  samples: Array<{ x: number; y: number; collected: boolean }>
  holdingSample: boolean
}

export default function ManipulatorGrid ({
  position,
  samples,
  holdingSample
}: ManipulatorGridProps) {
  // Create a 10x10 grid
  const gridSize = 10
  const grid = Array(gridSize)
    .fill(null)
    .map(() => Array(gridSize).fill(null))

  return (
    <Box sx={{ width: '100%', aspectRatio: '1/1' }}>
      <Grid container spacing={0.5}>
        {grid.map((row, y) =>
          row.map((_, x) => {
            const isManipulator = position.x === x && position.y === y
            const sample = samples.find(
              s => s.x === x && s.y === y && !s.collected
            )

            return (
              <Grid item xs={1.2} key={`${x}-${y}`}>
                <Paper
                  elevation={1}
                  sx={{
                    aspectRatio: '1/1',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: isManipulator
                      ? 'primary.light'
                      : sample
                      ? 'secondary.light'
                      : 'grey.100',
                    position: 'relative'
                  }}
                >
                  {isManipulator && (
                    <Box
                      sx={{
                        width: '80%',
                        height: '80%',
                        borderRadius: '50%',
                        backgroundColor: 'primary.main',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        color: 'white',
                        fontWeight: 'bold'
                      }}
                    >
                      {holdingSample ? 'M+' : 'M'}
                    </Box>
                  )}

                  {sample && (
                    <Box
                      sx={{
                        width: '60%',
                        height: '60%',
                        borderRadius: '50%',
                        backgroundColor: 'secondary.main'
                      }}
                    />
                  )}
                </Paper>
              </Grid>
            )
          })
        )}
      </Grid>
    </Box>
  )
}
