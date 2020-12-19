import { useState, useEffect } from "react";
const shuffle = require("shuffle-array");

const Lobby = (props) => {
  const { gameState, socket } = props;
  const [definition, setDefinition] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [definitions, setDefinitions] = useState([]);
  const [guessed, setGuessed] = useState(false);
  const [currentSelection, setCurrentSelection] = useState(null);
  const isHost = gameState.host.id === socket.id;

  const handleDefinitionChange = (e) => {
    const { value } = e.target;
    setDefinition(value);
  };

  const handleStartGame = (e) => {
    e.preventDefault();
    socket.emit("start game", gameState.lobbyCode);
    console.log("starting game");
  };

  const handleStartGuessing = (e) => {
    e.preventDefault();
    socket.emit("start guessing", gameState.lobbyCode);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit("definition submitted", definition, gameState.lobbyCode);
    setDefinition("");
    setSubmitted(true);
  };

  const handleSelect = (e) => {
    const { id } = e.target;
    console.log(id);
    setCurrentSelection(id);
  };

  const handleGuess = (e) => {
    e.preventDefault();
    socket.emit("guess", gameState.lobbyCode, currentSelection);
    setGuessed(true);
  };

  const generateRandomOrderedDefinitions = () => {
    let defs = gameState.players.map((player) => {
      return { id: player.id, definition: player.definition };
    });
    defs.push({ id: "0", definition: gameState.definition });
    return shuffle(defs);
  };

  useEffect(() => {
    setDefinitions(generateRandomOrderedDefinitions());
  }, [gameState.guessing]); //eslint-disable-line

  return (
    <div className="lobby">
      <h3>Lobby Code: {gameState.lobbyCode}</h3>
      <div className="players-container">
        <h3>Players</h3>
        <ul className="players-list">
          {gameState.players.map((player) => {
            return (
              <li
                key={player.id}
                className={
                  player.definition
                    ? "player submitted"
                    : "player not-submitted"
                }
              >
                {player.username}
              </li>
            );
          })}
        </ul>
      </div>
      {isHost && !gameState.started ? (
        <button onClick={handleStartGame}>Start Game</button>
      ) : (
        !gameState.started && <p>Waiting for host to start game...</p>
      )}
      {isHost && gameState.started && !gameState.guessing && (
        <button onClick={handleStartGuessing}>Start guessing</button>
      )}
      {gameState && gameState.started && (
        <>
          <div className="word-container">
            <h2 className="word">{gameState.word}</h2>
          </div>
          {!submitted && (
            <form onSubmit={handleSubmit}>
              <textarea
                name="definition"
                placeholder="Enter your definition here"
                value={definition}
                onChange={handleDefinitionChange}
              />
              <button>Submit</button>
            </form>
          )}
          {gameState && gameState.started && gameState.guessing && !guessed && (
            <div className="definitions-container">
              <ul className="definitions">
                {definitions.map((def) => {
                  return (
                    <li
                      key={def.id}
                      id={def.id}
                      className={
                        currentSelection === def.id
                          ? "definition selected"
                          : "definition"
                      }
                      onClick={handleSelect}
                    >
                      {def.definition}
                    </li>
                  );
                })}
              </ul>
              <button disabled={!currentSelection} onClick={handleGuess}>
                Guess
              </button>
            </div>
          )}
          {gameState &&
            gameState.started &&
            gameState.guessing &&
            guessed &&
            !gameState.completed && <p>Waiting for everyone to guess...</p>}
        </>
      )}
    </div>
  );
};

export default Lobby;
