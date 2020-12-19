import { useState } from "react";

const Lobby = (props) => {
  const { gameState, socket } = props;
  const [definition, setDefinition] = useState("");
  const isHost = gameState.host.id === socket.id;

  const handleDefinitionChange = (e) => {
    const { value } = e.target;
    setDefinition(value);
  };

  const handleStartGame = (e) => {
    e.preventDefault();
    socket.emit("start game", gameState.lobbyCode);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit("definition submitted", definition, gameState.lobbyCode);
  };

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
      {gameState && gameState.started && (
        <>
          <div className="word-container">
            <h2 className="word">{gameState.word}</h2>
          </div>
          <form onSubmit={handleSubmit}>
            <textarea
              name="definition"
              placeholder="Enter your definition here"
              value={definition}
              onChange={handleDefinitionChange}
            />
            <button>Submit</button>
          </form>
        </>
      )}
    </div>
  );
};

export default Lobby;
