import socketIOClient from "socket.io-client";
import { useEffect, useState } from "react";
import randomize from "randomatic";

const socket = socketIOClient(process.env.REACT_APP_API_URL);

const GameHome = () => {
  const [username, setUsername] = useState(`guest#${randomize("0", 4)}`);
  const [joinCode, setJoinCode] = useState("");

  const handleUsernameChange = (e) => {
    const { value } = e.target;

    setUsername(value);
  };

  const handleJoinCodeChange = (e) => {
    const { value } = e.target;
    setJoinCode(value);
  };

  const handleCreateLobby = (e) => {
    e.preventDefault();
    socket.emit("create lobby", username);
  };

  const handleJoinLobby = (e) => {
    e.preventDefault();
    socket.emit("join lobby", username, joinCode);
  };

  useEffect(() => {
    socket.on("lobby created", (msg) => {
      console.log(msg);
    });

    socket.on("join lobby", (msg) => {
      console.log(msg);
    });
  }, []);

  return (
    <div className="game-home-container">
      <h1>Let's play!</h1>
      <label htmlFor="username">Name:</label>
      <input
        id="username"
        name="username"
        value={username}
        onChange={handleUsernameChange}
      />
      <div className="join-buttons">
        <button onClick={handleCreateLobby}>Create New Lobby</button>
        <button onClick={handleJoinLobby}>Join A Lobby</button>
      </div>
      <div className="join-code-input">
        <label htmlFor="joinCode">Join Code:</label>
        <input
          id="joinCode"
          name="joinCode"
          value={joinCode}
          onChange={handleJoinCodeChange}
        />
      </div>
    </div>
  );
};

export default GameHome;
