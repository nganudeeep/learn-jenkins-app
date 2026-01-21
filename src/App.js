import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <a
          className="App-link"
          href="https://example.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          Nobody ever truly learns Jenkins; you just get used to debugging it
        </a>
      </header>
      <p>
          Application version: {process.env.REACT_APP_VERSION}
      </p>
    </div>
  );
}

export default App;
