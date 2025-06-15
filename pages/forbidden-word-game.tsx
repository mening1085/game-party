import BackButton from "@/components/BackButton";
import { useState, useEffect } from "react";

interface Player {
  id: string;
  name: string;
  forbiddenWord: string | null;
  isCaught: boolean;
}

const ForbiddenWordGame = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [newPlayerName, setNewPlayerName] = useState<string>("");
  const [forbiddenWordsInput, setForbiddenWordsInput] = useState<string>("");
  const [availableWords, setAvailableWords] = useState<string[]>([]);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [revealedWordId, setRevealedWordId] = useState<string | null>(null);

  const addPlayer = () => {
    if (newPlayerName.trim() !== "") {
      setPlayers((prevPlayers) => [
        ...prevPlayers,
        {
          id: Math.random().toString(),
          name: newPlayerName.trim(),
          forbiddenWord: null,
          isCaught: false,
        },
      ]);
      setNewPlayerName("");
    }
  };

  const parseForbiddenWords = () => {
    const words = forbiddenWordsInput
      .split(",")
      .map((word) => word.trim())
      .filter((word) => word !== "");
    setAvailableWords(words);
  };

  const startGame = () => {
    if (
      players.length === 0 ||
      availableWords.length === 0 ||
      availableWords.length < players.length
    ) {
      alert("Please add players and enough forbidden words to start the game.");
      return;
    }

    const shuffledWords = [...availableWords].sort(() => 0.5 - Math.random());
    const newPlayers = players.map((player, index) => ({
      ...player,
      forbiddenWord: shuffledWords[index],
      isCaught: false,
    }));

    setPlayers(newPlayers);
    setGameStarted(true);
  };

  const catchPlayer = (id: string) => {
    setPlayers((prevPlayers) =>
      prevPlayers.map((player) =>
        player.id === id ? { ...player, isCaught: true } : player
      )
    );
    alert(
      `${
        players.find((p) => p.id === id)?.name
      } has been caught! They must drink!`
    );
  };

  const resetGame = () => {
    setPlayers([]);
    setNewPlayerName("");
    setForbiddenWordsInput("");
    setAvailableWords([]);
    setGameStarted(false);
    setRevealedWordId(null);
  };

  return (
    <>
      <BackButton />
      <main className="flex flex-col items-center justify-center min-h-screen py-20 bg-background text-textLight px-4">
        <h1 className="text-5xl md:text-7xl font-bold text-primary animate-glow mb-8 text-center">
          Forbidden Word Game
        </h1>

        {!gameStarted ? (
          <div className="glass-card p-8 w-full max-w-2xl">
            <h2 className="text-3xl font-semibold text-textLight mb-6">
              Setup Game
            </h2>
            <div className="mb-6">
              <label
                htmlFor="playerName"
                className="block text-textLight text-lg mb-2"
              >
                Add Player:
              </label>
              <div className="flex">
                <input
                  type="text"
                  id="playerName"
                  className="flex-grow p-3 rounded-lg bg-background/50 border border-primary/20 focus:outline-none focus:border-primary"
                  placeholder="Player Name"
                  value={newPlayerName}
                  onChange={(e) => setNewPlayerName(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      addPlayer();
                    }
                  }}
                />
                <button onClick={addPlayer} className="btn btn-primary ml-2">
                  Add
                </button>
              </div>
              <div className="mt-4">
                <h3 className="text-xl font-semibold text-textLight mb-2">
                  Players:
                </h3>
                {players.length === 0 ? (
                  <p className="text-textLight/70">No players added yet.</p>
                ) : (
                  <ul className="list-disc list-inside">
                    {players.map((player) => (
                      <li key={player.id} className="text-textLight">
                        {player.name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            <div className="mb-6">
              <label
                htmlFor="forbiddenWords"
                className="block text-textLight text-lg mb-2"
              >
                Forbidden Words (comma-separated):
              </label>
              <textarea
                id="forbiddenWords"
                className="w-full p-3 rounded-lg bg-background/50 border border-primary/20 focus:outline-none focus:border-primary h-32"
                placeholder="e.g., 'the, and, a, but'"
                value={forbiddenWordsInput}
                onChange={(e) => setForbiddenWordsInput(e.target.value)}
                onBlur={parseForbiddenWords}
              />
              <div className="mt-2 text-textLight/70">
                <h3 className="text-xl font-semibold text-textLight mb-2">
                  Available Words:
                </h3>
                {availableWords.length === 0 ? (
                  <p>No words entered yet.</p>
                ) : (
                  <p>{availableWords.join(", ")}</p>
                )}
              </div>
            </div>

            <button onClick={startGame} className="btn btn-primary w-full">
              Start Game
            </button>
          </div>
        ) : (
          <div className="glass-card p-8 w-full max-w-2xl">
            <h2 className="text-3xl font-semibold text-textLight mb-6 text-center">
              Game in Progress!
            </h2>
            <p className="text-lg text-textLight mb-8 text-center">
              Don't say your forbidden word!
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {players.map((player) => (
                <div
                  key={player.id}
                  className={`glass-card p-6 flex flex-col items-center justify-center ${
                    player.isCaught ? "border-red-500 shadow-neon-red" : ""
                  }`}
                >
                  <h3 className="text-2xl font-bold text-textLight mb-2">
                    {player.name}
                  </h3>
                  {player.forbiddenWord &&
                    (revealedWordId === player.id ? (
                      <p className="text-lg text-primary mb-4 animate-pulse">
                        Your Word:{" "}
                        <span className="font-bold">
                          {player.forbiddenWord}
                        </span>
                      </p>
                    ) : (
                      <button
                        onClick={() => setRevealedWordId(player.id)}
                        className="btn btn-primary px-4 py-2 text-sm"
                      >
                        Reveal My Word
                      </button>
                    ))}
                  {!player.isCaught ? (
                    <button
                      onClick={() => catchPlayer(player.id)}
                      className="btn bg-red-600 hover:bg-red-700 text-white mt-4"
                    >
                      Caught!
                    </button>
                  ) : (
                    <p className="text-red-500 font-bold text-xl mt-4">
                      CAUGHT!
                    </p>
                  )}
                </div>
              ))}
            </div>
            <button
              onClick={resetGame}
              className="btn btn-primary w-full mt-8 bg-blue-600 hover:bg-blue-700"
            >
              Reset Game
            </button>
          </div>
        )}
      </main>
    </>
  );
};

export default ForbiddenWordGame;
