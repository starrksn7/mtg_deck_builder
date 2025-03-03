import './App.css';
import { SearchBar } from './search/searchBar';
import 'mana-font/css/mana.css'
import { Route, Routes } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <div>Whatever I want goes here</div>
      <SearchBar />
      <Routes>
        <Route path="/decks" element={<AllDecks />} />
      </Routes>
    </div>
  );
}

export default App;
