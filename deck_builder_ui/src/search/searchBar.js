import axios from 'axios';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { DisplayResults } from './displayResults';
import { Pagination } from './pagination';

export function SearchBar(){
    const [searchResults, setSearchResults] = useState([]);
    const [showResults, setShowResults] = useState(false);
    const [searchInput, setSearchInput] = useState('');
    const [searchType, setSearchType] = useState('');
    const deckId = useParams();
    const [currentPage, setCurrentPage] = useState(1);
    const [cardsPerPage, setCardsPerPage] = useState(25);
    const indexOfLastCard = currentPage * cardsPerPage;
    const indexOfFirstCard = indexOfLastCard - cardsPerPage;
    const cardsDisplayed = searchResults.slice(indexOfFirstCard, indexOfLastCard)

    const handleChange = (e) => {
        setSearchInput(e.target.value)
    }
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        let resultsArray = [];
        try{
            let searchUrl = '';
            
            switch(searchType) {
                case ('1'):
                    searchUrl = 'http://localhost:8080/card/searchByName';
                    break;
                case ('2'):
                    searchUrl = 'http://localhost:8080/card/searchByIdentityAndType'
                    break;
                case ('3'):
                    searchUrl = 'http://localhost:8080/card/searchByColorAndCost'
                    break;
                case ('4'):
                    searchUrl = 'http://localhost:8080/card/searchByKeyword'
                    break;
                case ('5'):
                    searchUrl = 'http://localhost:8080/card/searchByColors'
                    break;
                case ('6'):
                    searchUrl = 'http://localhost:8080/card/searchByColorIdentity'
                    break;
                default:
                    searchUrl = ''
            }
            const res =  await axios.post(searchUrl, {name: searchInput})
            let data = res.data;
            data.forEach(entry => {
                resultsArray.push(JSON.parse(entry));
            })
            // console.log("Results array", resultsArray)           
        } catch (error){
            console.log("Error fetching data: ", error)
        }
        setCurrentPage(1);
        setSearchResults(resultsArray);
        setShowResults(true);
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
                <label>
                    <input type='radio' name="searchType" value='2' onChange={handleSearchChange}/>
                    Search By Identity and Type
                </label>
                <label>
                    <input type='radio' name="searchType" value='3' onChange={handleSearchChange}/>
                    Search By Color and Cost
                </label>
                <label>
                    <input type='radio' name="searchType" value='4' onChange={handleSearchChange}/>
                    Search By Keyword
                </label>
                <label>
                    <input type='radio' name="searchType" value='5' onChange={handleSearchChange}/>
                    Search By Colors
                </label>
                <label>
                    <input type='radio' name="searchType" value='6' onChange={handleSearchChange}/>
                    Search By Color Identity
                </label>
            </form>

            {searchResults && (
                <div> 
                    <DisplayResults searchResults={cardsDisplayed} deckId={deckId}/>         
                    <Pagination 
                        cardsPerPage={cardsPerPage}
                        totalResults={searchResults.length}
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                    />
                </div>
                )}
        </div>
    )
}