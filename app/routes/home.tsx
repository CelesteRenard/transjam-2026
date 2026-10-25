import { Game } from "~/components/Game"
import { levels } from "~/utils/levels"

const Home = () => <Game level={levels[0]} puzzle={levels[0].puzzles[0]} />

export default Home
