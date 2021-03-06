import { useState, useEffect } from "react";
const shuffle = require("shuffle-array");

const Lobby = (props) => {
  const { gameState, socket, setGameState } = props;
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
  };

  const handleEnterKey = (e) => {
    if (e.which === 13 && e.shiftKey === false) {
      handleSubmit(e);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit("definition submitted", definition, gameState.lobbyCode);
    setDefinition("");
    setSubmitted(true);
  };

  const handleSelect = (e) => {
    const { id } = e.target;
    setCurrentSelection(id);
  };

  const handleGuess = (e) => {
    e.preventDefault();
    socket.emit("guess", gameState.lobbyCode, currentSelection);
    setGuessed(true);
  };

  const handlePlayAgain = (e) => {
    e.preventDefault();
    socket.emit("play again", gameState.lobbyCode);
  };

  const generateRandomOrderedDefinitions = () => {
    let defs = gameState.players.map((player) => {
      return { id: player.id, definition: player.definition };
    });
    defs.push({ id: "0", definition: gameState.definition });
    return shuffle(defs);
  };

  const calculateGuesses = () => {
    let votes = [];
    gameState.guesses.forEach((guess) => {
      let voter = gameState.players.find(
        (player) => player.id === guess.player
      );
      let votee = gameState.players.find((player) => player.id === guess.guess);
      if (!votee) {
        votee = { username: "correct answer" };
      }

      voter &&
        votee &&
        votes.push(
          <li
            key={voter.username}
          >{`${voter.username} voted for ${votee.username}`}</li>
        );
    });

    return votes;
  };

  useEffect(() => {
    if (gameState && gameState.phase === "GUESSING") {
      setDefinitions(generateRandomOrderedDefinitions());
    }
  }, [gameState.phase]); //eslint-disable-line

  useEffect(() => {
    socket.on("play again", (newGameState) => {
      setGameState(newGameState);
      setSubmitted(false);
      setDefinitions([]);
      setDefinition("");
      setGuessed(false);
      setCurrentSelection(null);
    });
  }, []); //eslint-disable-line

  return (
    <div className="container">
      <div className="players-container">
        <h3>Lobby Code: {gameState.lobbyCode}</h3>
        <h3>Players:</h3>
        <ul className="players-list">
          {gameState.players.map((player) => {
            return (
              <li
                key={player.id}
                className={
                  player.definition
                    ? player.id === socket.id
                      ? "player submitted me"
                      : "player submitted"
                    : player.id === socket.id
                    ? "player not-submitted me"
                    : "player not-submitted"
                }
              >
                {player.username}
              </li>
            );
          })}
        </ul>
      </div>
      <div className="game-body">
        {isHost && gameState.phase === "PREGAME" ? (
          <button onClick={handleStartGame}>Start Game</button>
        ) : (
          gameState.phase === "PREGAME" && (
            <p>Waiting for host to start game...</p>
          )
        )}
        {gameState && gameState.word && (
          <div className="word-container">
            <h2 className="word">{gameState.word}</h2>
          </div>
        )}
        {gameState && gameState.phase === "WRITING" && (
          <>
            {!submitted && (
              <form onSubmit={handleSubmit} className="definition-form">
                <textarea
                  name="definition"
                  placeholder="Enter your definition here"
                  value={definition}
                  onChange={handleDefinitionChange}
                  onKeyPress={handleEnterKey}
                  cols="60"
                  rows="5"
                />
                <button id="submit-definition">Submit</button>
              </form>
            )}
          </>
        )}
        {gameState && gameState.phase === "GUESSING" && !guessed && (
          <>
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
              <button
                disabled={!currentSelection}
                onClick={handleGuess}
                className="guess-button"
              >
                Guess
              </button>
            </div>
          </>
        )}
        {gameState && gameState.phase === "GUESSING" && guessed && (
          <p>Waiting for everyone to guess...</p>
        )}
        {gameState && gameState.phase === "POSTGAME" && (
          <div className="results">
            <div className="points">
              <h3>Points</h3>
              <ul>
                {gameState.players.map((player) => {
                  return (
                    <li
                      key={player.id}
                    >{`${player.username}: ${player.points} points`}</li>
                  );
                })}
              </ul>
              {isHost && <button onClick={handlePlayAgain}>Play again</button>}
            </div>
            <div className="voting-results">
              <h3>Guesses</h3>
              <ul>{calculateGuesses()}</ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Lobby;
