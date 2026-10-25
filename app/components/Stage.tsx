
export const Stage = ({ day, actor, dialogue }: { day: number; actor?: string; dialogue?: string }) => (
  <header
    className="relative flex min-h-0 flex-1 flex-col items-center border-b-2 border-black bg-cover bg-center"
    style={{ backgroundImage: "url(/assets/images/gameplay/background/background.jpg)" }}
  >
    <div className="w-1/2 max-w-3xl border-2 border-t-0 border-black bg-white py-3 text-center text-xl dark:bg-gray-950 dark:text-white">
      DAY {day}
    </div>
    {actor && <img src={actor} alt="" className="absolute bottom-20 h-1/2 max-h-72" />}
    {dialogue && (
      <p className="absolute inset-x-[11%] bottom-0 border-2 border-b-0 border-black bg-white py-5 text-center text-xl dark:bg-gray-950 dark:text-white">
        {dialogue}
      </p>
    )}
  </header>
)
