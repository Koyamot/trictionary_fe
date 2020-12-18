import { Switch, Route } from "react-router-dom";

import GameHome from "./components/game/GameHome";
import ModerationPage from "./components/moderation/ModerationPage";

const App = () => {
  return (
    <div className="App">
      <Switch>
        <Route path="/moderation" component={ModerationPage} />

        <Route path="/" exact component={GameHome} />
      </Switch>
    </div>
  );
};

export default App;
