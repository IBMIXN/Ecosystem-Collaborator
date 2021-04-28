import { Route, Switch } from "react-router-dom";
import SignUp from "./pages/SignUp";
import Home from "./pages/Home";
import DeleteDocument from "./pages/DeleteDocument";
import Collab from "./pages/Collab";
function App() {
  return (
    <main>
      <Switch>
        <Route path="/" component={Home} exact />
        <Route path="/signup" component={SignUp} />
        <Route path="/withdraw" component={DeleteDocument} />
        <Route path="/collab" component={Collab} />
      </Switch>
    </main>
  );
}

export default App;
