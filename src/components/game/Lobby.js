const Lobby = (props) => {
  const { gameState, socket } = props;
  const isHost = gameState.host.id === socket.id;

  return (
    <div className="lobby">
      <h3>Lobby Code: {gameState.lobbyCode}</h3>
      <div className="players-container">
        <h3>Players</h3>
        <ul className="players-list">
          {gameState.players.map((player) => {
            return (
              <li key={player.id} className="player">
                {player.username}
              </li>
            );
          })}
        </ul>
      </div>
      {isHost ? (
        <button>Start Game</button>
      ) : (
        <p>Waiting for host to start game...</p>
      )}
    </div>
  );
};

export default Lobby;
