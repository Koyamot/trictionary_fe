import { Switch, Route } from "react-router-dom";

import GameContainer from "./components/game/GameContainer";
import ModerationPage from "./components/moderation/ModerationPage";

const App = () => {
  return (
    <div className="App">
      <Switch>
        <Route path="/moderation" component={ModerationPage} />

        <Route path="/play" exact component={GameContainer} />
      </Switch>
    </div>
  );
};

export default App;
