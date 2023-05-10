import './App.css';
import { Outlet, Link } from 'react-router-dom';

function App() {

  return (
    <div>
        <header className="App-header">
          <p>
            <Link to="/" className="plaintext-link"><strong>Volley App</strong></Link>
          </p>
          <nav>
            <Link to="/rotation">Rotation Schedule</Link> |{" "}
            <Link to="/players">Players</Link> |{" "}
            <Link to="/events">Events</Link> |{" "}
            <Link to="/scheduler">Scheduler</Link> |{" "}
            <Link to="/league">League Schedule</Link>
          </nav>
          <p>___________________________________</p>
        </header>
        <Outlet />
    </div>
  );
}

export default App;
