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
            let res;
            
            switch(searchType){
                case ('1'):
                    res = await axios.post(searchUrl, {name: searchInput});
                    break;
                case ('2'):
                    res = await axios.post(searchUrl, {identity: colorIdentity, type: cardType})
            }
            
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

   const handleColorChange = (event) => {
        let { value } = event.target;
        setColorIdentity(value);
   }

   const handleCardTypeChange = (event) => {
        let { value } = event.target;
        setCardType(value);
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
                <div>
                    Select The Color Identity
                    <label>
                        <input type='radio' name="identitySelect" value='black' onChange={handleColorChange}/>
                        Black
                    </label>
                    <label>
                        <input type='radio' name="identitySelect" value='blue' onChange={handleColorChange}/>
                        Blue
                    </label>
                    <label>
                        <input type='radio' name="identitySelect" value='green' onChange={handleColorChange}/>
                        Green
                    </label>
                    <label>
                        <input type='radio' name="identitySelect" value='red' onChange={handleColorChange}/>
                        Red
                    </label>
                    <label>
                        <input type='radio' name="identitySelect" value='white' onChange={handleColorChange}/>
                        White
                    </label>
                    <label>
                        <input type='radio' name="identitySelect" value='azorius' onChange={handleColorChange}/>
                        Azorius
                    </label>
                    <label>
                        <input type='radio' name="identitySelect" value='boros' onChange={handleColorChange}/>
                        Boros
                    </label>
                    <label>
                        <input type='radio' name="identitySelect" value='dimir' onChange={handleColorChange}/>
                        Dimir
                    </label>
                    <label>
                        <input type='radio' name="identitySelect" value='golgari' onChange={handleColorChange}/>
                        Golgari
                    </label>
                    <label>
                        <input type='radio' name="identitySelect" value='gruul' onChange={handleColorChange}/>
                        Gruul
                    </label>
                    <label>
                        <input type='radio' name="identitySelect" value='izzet' onChange={handleColorChange}/>
                        Izzet
                    </label>
                    <label>
                        <input type='radio' name="identitySelect" value='orzhov' onChange={handleColorChange}/>
                        Orzhov
                    </label>
                    <label>
                        <input type='radio' name="identitySelect" value='rakdos' onChange={handleColorChange}/>
                        Rakdos
                    </label>
                    <label>
                        <input type='radio' name="identitySelect" value='selesnya' onChange={handleColorChange}/>
                        Selesnya
                    </label>
                    <label>
                        <input type='radio' name="sidentitySelect" value='simic' onChange={handleColorChange}/>
                        Simic
                    </label>
                    <label>
                        <input type='radio' name="identitySelect" value='abzan' onChange={handleColorChange}/>
                        Abzan
                    </label>
                    <label>
                        <input type='radio' name="identitySelect" value='bant' onChange={handleColorChange}/>
                        Bant
                    </label>
                    <label>
                        <input type='radio' name="identitySelect" value='esper' onChange={handleColorChange}/>
                        Esper
                    </label>
                    <label>
                        <input type='radio' name="identitySelect" value='grixis' onChange={handleColorChange}/>
                        Grixis
                    </label>
                    <label>
                        <input type='radio' name="identitySelect" value='jeskai' onChange={handleColorChange}/>
                        Jeskai
                    </label>
                    <label>
                        <input type='radio' name="identitySelect" value='jund' onChange={handleColorChange}/>
                        Jund
                    </label>
                    <label>
                        <input type='radio' name="identitySelect" value='mardu' onChange={handleColorChange}/>
                        Mardu
                    </label>
                    <label>
                        <input type='radio' name="identitySelect" value='naya' onChange={handleColorChange}/>
                        Naya
                    </label>
                    <label>
                        <input type='radio' name="identitySelect" value='sultai' onChange={handleColorChange}/>
                        Sultai
                    </label>
                    <label>
                        <input type='radio' name="identitySelect" value='temur' onChange={handleColorChange}/>
                        Temur
                    </label>
                    <label>
                        <input type='radio' name="identitySelect" value='glint' onChange={handleColorChange}/>
                        Glint
                    </label>
                    <label>
                        <input type='radio' name="identitySelect" value='dune' onChange={handleColorChange}/>
                        Dune
                    </label>
                    <label>
                        <input type='radio' name="identitySelect" value='ink' onChange={handleColorChange}/>
                        Ink
                    </label>
                    <label>
                        <input type='radio' name="identitySelect" value='witch' onChange={handleColorChange}/>
                        Witch
                    </label>
                    <label>
                        <input type='radio' name="identitySelect" value='yore' onChange={handleColorChange}/>
                        Yore
                    </label>
                    <label>
                        <input type='radio' name="identitySelect" value='wurbg' onChange={handleColorChange}/>
                        WUBRG
                    </label>
                    <label>
                        <input type='radio' name="identitySelect" value='colorless' onChange={handleColorChange}/>
                        Colorless
                    </label>
                </div>
                <div>
                    Select The Card Type
                    <label>
                        <input type='radio' name="cardType" value='artifact' onChange={handleCardTypeChange}/>
                        Artifact
                    </label>
                    <label>
                        <input type='radio' name="cardType" value='battle' onChange={handleCardTypeChange}/>
                        Battle
                    </label>
                    <label>
                        <input type='radio' name="cardType" value='creature' onChange={handleCardTypeChange}/>
                        Creature
                    </label>
                    <label>
                        <input type='radio' name="cardType" value='enchantment' onChange={handleCardTypeChange}/>
                        Enchantment
                    </label>
                    <label>
                        <input type='radio' name="cardType" value='instant' onChange={handleCardTypeChange}/>
                        Instant
                    </label>
                    <label>
                        <input type='radio' name="cardType" value='land' onChange={handleCardTypeChange}/>
                        Land
                    </label>
                    <label>
                        <input type='radio' name="cardType" value='planeswalker' onChange={handleCardTypeChange}/>
                        Planeswalker
                    </label>
                    <label>
                        <input type='radio' name="searchType" value='sorcery' onChange={handleCardTypeChange}/>
                        Sorcery
                    </label>
                </div>
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