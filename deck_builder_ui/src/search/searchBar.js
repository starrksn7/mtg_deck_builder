import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { DisplayResults } from './displayResults';
import { Pagination } from './pagination';
import { Loader } from './loader';
import api from '../api/axios';

export function SearchBar(){
    const [searchResults, setSearchResults] = useState([]);
    const [showResults, setShowResults] = useState(false);
    const [searchInput, setSearchInput] = useState('');
    const deckId = useParams();
    const [currentPage, setCurrentPage] = useState(1);
    const [cardsPerPage, setCardsPerPage] = useState(25);
    const indexOfLastCard = currentPage * cardsPerPage;
    const indexOfFirstCard = indexOfLastCard - cardsPerPage;
    const cardsDisplayed = searchResults.slice(indexOfFirstCard, indexOfLastCard)
    const [isError, setIsError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [colorIdentity, setColorIdentity] = useState('');
    const [cardType, setCardType] = useState('');

    const handleChange = (e) => {
        setSearchInput(e.target.value)
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        let resultsArray = [];
        try{
            const res = await api.post('/card/searchByName', {name: searchInput});
 
            const data = res.data;
            data.forEach(entry => {
                resultsArray.push(JSON.parse(entry));
            })

        } catch (error){
            console.log("Error fetching data: ", error)
        }
        setCurrentPage(1);
        setSearchResults(resultsArray);
        setShowResults(true);
        setIsLoading(false);
    }

   const handleSearchChange = (event) => {
        let { value } = event.target
        setSearchType(value)
   }
   
    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Search here"
                    onChange={handleChange}
                    value={searchInput}
                />
                <button type="submit">Search</button>
                <label>
                    <input type='radio' name="searchType" value='1' onChange={handleSearchChange}/>
                    Search By Name
                </label>
            </form>
            {isLoading ? <Loader /> : <div>
                {searchResults && (
                    <div> 
                        <DisplayResults searchResults={cardsDisplayed} deckId={deckId} setIsError={setIsError}/>         
                        <Pagination 
                            cardsPerPage={cardsPerPage}
                            totalResults={searchResults.length}
                            currentPage={currentPage}
                            setCurrentPage={setCurrentPage}
                            isError={isError}
                        />
                    </div>
                )}
                </div>
            }
        </div>
    )
}