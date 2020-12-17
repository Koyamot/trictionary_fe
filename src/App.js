import { Switch, Route } from "react-router-dom";

import ModerationPage from "./components/moderation/ModerationPage";

const App = () => {
  return (
    <div className="App">
      <Switch>
        <Route path="/moderation" component={ModerationPage} />
      </Switch>
    </div>
  );
};

export default App;
