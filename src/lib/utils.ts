export function optimizeCommands(commands: string): string {
  if (!commands) return ""

  // First optimization: consecutive same commands
  let result = ""
  let count = 1
  let currentChar = commands[0]

  for (let i = 1; i <= commands.length; i++) {
    if (i < commands.length && commands[i] === currentChar) {
      count++
    } else {
      result += count > 1 ? `${count}${currentChar}` : currentChar
      if (i < commands.length) {
        currentChar = commands[i]
        count = 1
      }
    }
  }

  // Second optimization: repeating patterns
  // This is a simplified implementation that looks for repeating patterns
  // of length 2 or more
  const optimizedResult = findAndReplacePatterns(result)

  return optimizedResult
}

function findAndReplacePatterns(str: string): string {
  // Look for patterns of length at least 2 that repeat at least twice
  for (let patternLength = Math.floor(str.length / 2); patternLength >= 2; patternLength--) {
    for (let i = 0; i <= str.length - 2 * patternLength; i++) {
      const pattern = str.substring(i, i + patternLength)
      let count = 0
      let position = i

      while (position <= str.length - patternLength && str.substring(position, position + patternLength) === pattern) {
        count++
        position += patternLength
      }

      if (count >= 2) {
        const before = str.substring(0, i)
        const after = str.substring(position)
        return before + count + "(" + pattern + ")" + after
      }
    }
  }

  return str
}
