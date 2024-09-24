import logo from './logo.svg';
import './App.css';
import SearchByName from './search/searchByName';

function App() {
  return (
    <div className="App">
      <div>Whatever I want goes here</div>
      {SearchByName()}
    </div>
  );
}

export default App;
