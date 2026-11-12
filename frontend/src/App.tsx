import { Outlet } from "react-router-dom";
import "./App.css";

function App() {
  return (
    <div className="app-container">
      <div className="main-content">
        <Outlet />
      </div>
    </div>
  );
}
export default App;
