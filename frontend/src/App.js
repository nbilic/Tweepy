import {
  Homepage,
  Profile,
  LoginPage,
  Settings,
  ReplyPage,
} from "./screens/index";
import { Switch, Route } from "react-router-dom";
import "./App.css";
const App = () => {
  return (
    <Switch>
      <Route exact path="/">
        <Homepage />
      </Route>
      <Route exact path="/login">
        <LoginPage />
      </Route>
      <Route exact path="/profile/:username">
        <Profile />
      </Route>
      <Route exact path="/settings">
        <Settings />
      </Route>
      <Route exact path="/:id">
        <ReplyPage />
      </Route>
    </Switch>
  );
};

export default App;
