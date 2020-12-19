import socketIOClient from "socket.io-client";
import { useEffect, useState } from "react";

import Join from "./Join";
import Lobby from "./Lobby";

const socket = socketIOClient(process.env.REACT_APP_API_URL);

const GameContainer = () => {
  const [gameState, setGameState] = useState(null);

  useEffect(() => {
    socket.on("game update", (gameState) => {
      setGameState(gameState);
    });
  }, []);

  return (
    <div className="game-home-container">
      <h1>Let's play!</h1>
      {!gameState && <Join socket={socket} />}
      {gameState && <Lobby socket={socket} gameState={gameState} />}
    </div>
  );
};

export default GameContainer;
