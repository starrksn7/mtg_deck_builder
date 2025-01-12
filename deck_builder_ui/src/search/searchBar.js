import axios from 'axios';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { DisplayResults } from './displayResults';
import { Pagination } from './pagination';
import { Loader } from './loader';

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

    const handleChange = (e) => {
        setSearchInput(e.target.value)
    }
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
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
                {searchType === '2' ? <div>
                    Select The color you want to view
                    <label>
                        <input type='radio' name="searchType" value='black' onChange={handleSearchChange}/>
                        Black
                    </label>
                    <label>
                        <input type='radio' name="searchType" value='blue' onChange={handleSearchChange}/>
                        Blue
                    </label>
                    <label>
                        <input type='radio' name="searchType" value='green' onChange={handleSearchChange}/>
                        Green
                    </label>
                    <label>
                        <input type='radio' name="searchType" value='red' onChange={handleSearchChange}/>
                        Red
                    </label>
                    <label>
                        <input type='radio' name="searchType" value='white' onChange={handleSearchChange}/>
                        White
                    </label>
                    <label>
                        <input type='radio' name="searchType" value='azorius' onChange={handleSearchChange}/>
                        Azorius
                    </label>
                    <label>
                        <input type='radio' name="searchType" value='boros' onChange={handleSearchChange}/>
                        Boros
                    </label>
                    <label>
                        <input type='radio' name="searchType" value='dimir' onChange={handleSearchChange}/>
                        Dimir
                    </label>
                    <label>
                        <input type='radio' name="searchType" value='golgari' onChange={handleSearchChange}/>
                        Golgari
                    </label>
                    <label>
                        <input type='radio' name="searchType" value='gruul' onChange={handleSearchChange}/>
                        Gruul
                    </label>
                    <label>
                        <input type='radio' name="searchType" value='izzet' onChange={handleSearchChange}/>
                        Izzet
                    </label>
                    <label>
                        <input type='radio' name="searchType" value='orzhov' onChange={handleSearchChange}/>
                        Orzhov
                    </label>
                    <label>
                        <input type='radio' name="searchType" value='rakdos' onChange={handleSearchChange}/>
                        Rakdos
                    </label>
                    <label>
                        <input type='radio' name="searchType" value='selesnya' onChange={handleSearchChange}/>
                        Selesnya
                    </label>
                    <label>
                        <input type='radio' name="searchType" value='simic' onChange={handleSearchChange}/>
                        Simic
                    </label>
                    <label>
                        <input type='radio' name="searchType" value='abzan' onChange={handleSearchChange}/>
                        Abzan
                    </label>
                    <label>
                        <input type='radio' name="searchType" value='bant' onChange={handleSearchChange}/>
                        Bant
                    </label>
                    <label>
                        <input type='radio' name="searchType" value='esper' onChange={handleSearchChange}/>
                        Esper
                    </label>
                    <label>
                        <input type='radio' name="searchType" value='grixis' onChange={handleSearchChange}/>
                        Grixis
                    </label>
                    <label>
                        <input type='radio' name="searchType" value='jeskai' onChange={handleSearchChange}/>
                        Jeskai
                    </label>
                    <label>
                        <input type='radio' name="searchType" value='jund' onChange={handleSearchChange}/>
                        Jund
                    </label>
                    <label>
                        <input type='radio' name="searchType" value='mardu' onChange={handleSearchChange}/>
                        Mardu
                    </label>
                    <label>
                        <input type='radio' name="searchType" value='naya' onChange={handleSearchChange}/>
                        Naya
                    </label>
                    <label>
                        <input type='radio' name="searchType" value='sultai' onChange={handleSearchChange}/>
                        Sultai
                    </label>
                    <label>
                        <input type='radio' name="searchType" value='temur' onChange={handleSearchChange}/>
                        Temur
                    </label>
                    <label>
                        <input type='radio' name="searchType" value='glint' onChange={handleSearchChange}/>
                        Glint
                    </label>
                    <label>
                        <input type='radio' name="searchType" value='dune' onChange={handleSearchChange}/>
                        Dune
                    </label>
                    <label>
                        <input type='radio' name="searchType" value='ink' onChange={handleSearchChange}/>
                        Ink
                    </label>
                    <label>
                        <input type='radio' name="searchType" value='witch' onChange={handleSearchChange}/>
                        Witch
                    </label>
                    <label>
                        <input type='radio' name="searchType" value='yore' onChange={handleSearchChange}/>
                        Yore
                    </label>
                    <label>
                        <input type='radio' name="searchType" value='wurbg' onChange={handleSearchChange}/>
                        WURBG
                    </label>
                    <label>
                        <input type='radio' name="searchType" value='colorless' onChange={handleSearchChange}/>
                        Colorless
                    </label>
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