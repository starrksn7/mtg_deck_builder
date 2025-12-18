import './App.css';
import 'mana-font/css/mana.css'
import { Route, Routes } from 'react-router-dom';
import { AllDecks } from './decks/allDecks';
import { SingleDeck } from './decks/singleDeck';
import { CreateDeck } from './decks/createDeck';
import { Login } from './login/login';
import { Register } from './login/register';
import { Header } from './header/header';
import { AuthProvider } from './login/AuthContext';

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <Header />
        <div>Whatever I want goes here</div>
        {/* <SearchBar /> */}
        <Routes>
          <Route path="/decks/:deckId" element={<SingleDeck />} />
          <Route path="/user/:userId" element={<AllDecks />} />
          <Route path="/create" element={<CreateDeck />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;
