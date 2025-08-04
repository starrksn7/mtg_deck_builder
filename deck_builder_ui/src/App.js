import './App.css';
import 'mana-font/css/mana.css'
import { Route, Routes } from 'react-router-dom';
import { AllDecks } from './decks/allDecks';
import { SingleDeck } from './decks/singleDeck';
import { CreateDeck } from './decks/createDeck';

function App() {
  return (
    <div className="App">
      <div>Whatever I want goes here</div>
      {/* <SearchBar /> */}
      <Routes>
        <Route path="/decks/:deckId" element={<SingleDeck />} />
        <Route path="/user/:userId" element={<AllDecks />} />
        <Route path="/create" element={<CreateDeck />} />
      </Routes>
    </div>
  );
}

export default App;
