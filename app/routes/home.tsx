import { useState } from "react"
import { Game } from "~/components/Game"
import { levels } from "~/utils/levels"

const Home = () => {
  const [levelIndex, setLevelIndex] = useState<number>(0)
  const [puzzleIndex, setPuzzleIndex] = useState<number>(0)

  const handleNext = () => {
    if (puzzleIndex < levels[levelIndex].puzzles.length - 1) {
      setPuzzleIndex(puzzleIndex + 1)
    }
    else if (levelIndex < levels.length - 1) {
      setLevelIndex(levelIndex + 1)
      setPuzzleIndex(0)
    }
  }

  return <Game
    key={`${levelIndex}-${puzzleIndex}`}
    level={levels[levelIndex]}
    puzzle={levels[levelIndex].puzzles[puzzleIndex]}
    onNext={handleNext}
  />
}

export default Home
