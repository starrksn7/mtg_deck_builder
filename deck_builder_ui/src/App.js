import './App.css';
import { SearchBar } from './search/searchBar';
import { Pagination } from './search/pagination';
import { useState } from 'react';


function App() {
const [currentPage, setCurrentPage] = useState(1);
const [cardsPerPage, setcardsPerPage] = useState(25);
const indexOfLastCard = (currentPage * postsPerPage);
const indexOfFirstCard = indexOfLastCard - cardsPerPage;
  return (
    <div className="App">
      <div>Whatever I want goes here</div>
      <SearchBar />
    </div>
  );
}

export default App;
