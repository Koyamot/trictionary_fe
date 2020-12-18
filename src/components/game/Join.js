import { useState } from "react";
import randomize from "randomatic";

const Join = (props) => {
  const [username, setUsername] = useState(`guest#${randomize("0", 4)}`);
  const [joinCode, setJoinCode] = useState("");
  const { socket } = props;

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

  return (
    <div className="join-page">
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

export default Join;
