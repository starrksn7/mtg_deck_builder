import './App.css';
import { SearchBar } from './search/searchBar';
import 'mana-font/css/mana.css'
import { Route, Routes } from 'react-router-dom';
import { AllDecks } from './decks/allDecks';

function App() {
  return (
    <div className="App">
      <div>Whatever I want goes here</div>
      <SearchBar />
      <Routes>
        <Route path="/decks/:userId" element={<AllDecks />} />
      </Routes>
    </div>
  );
}

export default App;
