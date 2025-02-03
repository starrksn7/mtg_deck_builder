import axios from 'axios';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { DisplayResults } from './displayResults';
import { Pagination } from './pagination';
import { Loader } from './loader';
import { RenderColorOptions } from './renderColorOptions';
import { RenderTypeOptions } from './renderTypeOptions';

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
            let searchUrl = '';
            let res;
            
            switch(searchType) {
                case ('1'):
                    searchUrl = 'http://localhost:8080/card/searchByName';
                    res = await axios.post(searchUrl, {name: searchInput});
                    break;
                case ('2'):
                    searchUrl = 'http://localhost:8080/card/searchByIdentityAndType';
                    res = await axios.post(searchUrl, {colorIdentity: colorIdentity, type: cardType});
                    break;
                case ('3'):
                    searchUrl = 'http://localhost:8080/card/searchByColorAndCost';
                    res = await axios.post(searchUrl, {colors: colorIdentity, manaCost: searchInput});
                    break;
                case ('4'):
                    searchUrl = 'http://localhost:8080/card/searchByKeywordAndColors'
                    res = await axios.post(searchUrl, {keyword: searchInput, colors: colorIdentity})
                    break;
                default:
                    searchUrl = ''
            }
 
            let data = res.data;
            data.forEach(entry => {
                resultsArray.push(JSON.parse(entry));
            })

            if(searchType === '2'){
                console.log("searchIinput = ", searchInput)
                resultsArray = resultsArray.filter((entry) => {
                    return entry.name.toLowerCase().includes(searchInput.toLocaleLowerCase()) || 
                    entry.oracle_text.toLowerCase().includes(searchInput.toLowerCase());
                })
            }
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
                    Search By Keyword and Colors
                </label>
                {searchType === '2' ? <div>
                    <RenderColorOptions setColorIdentity={setColorIdentity}/>
                    <RenderTypeOptions setCardType={setCardType}/>
                </div> : <div></div>}
                {searchType === '3' || searchType === '4' ? <div>
                    <RenderColorOptions setColorIdentity={setColorIdentity} />
                </div> : <div></div>}
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