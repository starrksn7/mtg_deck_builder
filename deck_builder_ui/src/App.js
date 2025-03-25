import './App.css';
import { SearchBar } from './search/searchBar';
import 'mana-font/css/mana.css'
import { Route, Routes } from 'react-router-dom';
import { AllDecks } from './decks/allDecks';
import { SingleDeck } from './decks/singleDeck';

function App() {
  return (
    <div className="App">
      <div>Whatever I want goes here</div>
      <SearchBar />
      <Routes>
        <Route path="/decks/:deckId" element={<SingleDeck />} />
        <Route path="/user/:userId" element={<AllDecks />} />
      </Routes>
    </div>
  );
}

export default App;
