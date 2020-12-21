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
    if (gameState && gameState.guessing) {
      setDefinitions(generateRandomOrderedDefinitions());
    }
  }, [gameState.guessing]); //eslint-disable-line

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
      <div className="game-body">
        {isHost && !gameState.started ? (
          <button onClick={handleStartGame}>Start Game</button>
        ) : (
          !gameState.started && <p>Waiting for host to start game...</p>
        )}
        {/* {isHost && gameState.started && !gameState.guessing && (
          <button onClick={handleStartGuessing}>Start guessing</button>
        )} */}
        {gameState && gameState.started && (
          <>
            <div className="word-container">
              <h2 className="word">{gameState.word}</h2>
            </div>
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
                <button
                  disabled={!currentSelection}
                  onClick={handleGuess}
                  className="guess-button"
                >
                  Guess
                </button>
              </div>
            )}
            {gameState &&
              gameState.started &&
              gameState.guessing &&
              guessed &&
              !gameState.completed && <p>Waiting for everyone to guess...</p>}
            {gameState && gameState.completed && (
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
                </div>
                <div className="voting-results">
                  <h3>Guesses</h3>
                  <ul>{calculateGuesses()}</ul>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Lobby;
