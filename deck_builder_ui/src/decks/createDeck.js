import { useState } from "react"
import api from "../api/axios"
import { getBaseColors } from "../helperFunctions"
import { CascadingDropdown } from "../search/cascadingDropdown"
import { DisplayResults } from "../search/displayResults"
import { Pagination } from "../search/pagination"
import { Loader } from "../search/loader"
import '../App.css';


export function CreateDeck(){
    const [searchColor, setSearchColor] = useState('')
    const [searchInput, setSearchInput] = useState('')
    const [searchResults, setSearchResults] = useState([])
    const [isError, setIsError] = useState(false);
    const deckId = 10;
    const [currentPage, setCurrentPage] = useState(1);
    const [cardsPerPage, setCardsPerPage] = useState(25);
    const indexOfLastCard = currentPage * cardsPerPage;
    const indexOfFirstCard = indexOfLastCard - cardsPerPage;
    const cardsDisplayed = searchResults.slice(indexOfFirstCard, indexOfLastCard);
    const [isLoading, setIsLoading] = useState(false);
    const [noResults, setNoResults] = useState(false);

    const findCommanderWithSearch = async (e) => {
        e.preventDefault();
        setIsLoading(true)
        setSearchResults([])
        const response = await api.post('/card/searchForCommanderByName', 
            {searchTerm: searchInput})
        console.log("xxxxxxxxxxx")
        console.log(response)
        if (response.status !== 200) {
            setNoResults(true);
            setIsLoading(false);
            return;    
        }
 
        let resultsArray = response.data.map(entry => JSON.parse(entry));

        setSearchResults(resultsArray);
        setIsLoading(false)
    }

    const findCommanderByColor = async (searchColor) => {
        setIsLoading(true)
        setSearchResults([])
        const color = getBaseColors(searchColor.toLowerCase());

        const response = await api.post('/card/searchForCommanderByColor',
            {colors: color}
        )
    
        const resultsArray = response.data.map(entry => JSON.parse(entry));
        setSearchResults(resultsArray);
        setIsLoading(false)
    }

    const handleDropdownSelection = (selectedColor) => {
        setSearchColor(selectedColor);
        findCommanderByColor(selectedColor);
    }

    return (
        <div className="create-deck-page">
            <h1 className="page-title">Create Commander Deck</h1>

            <div className="search-section">
                <form onSubmit={findCommanderWithSearch} className="search-bar">
                    <input
                        type="text"
                        placeholder="Search for a commander..."
                        onChange={(e) => setSearchInput(e.target.value)}
                        value={searchInput}
                    />
                    <button type="submit">Search</button>
                </form>

                <div className="divider">OR</div>

                <div className="color-search">
                    <span>Search by Color Identity</span>
                    <CascadingDropdown onColorSelect={handleDropdownSelection} />
                </div>
            </div> 

            {noResults && 
                <div>
                    <p>We can't seem to find what you're looking for. Please search again</p>
                    <img src="https://cards.scryfall.io/art_crop/front/7/9/79b2c547-0d9e-4fd7-a399-347ad908c70b.jpg?1783913337"
                     alt="fblthp the lost" />
                </div>
            }

            {isLoading && <Loader />}

            {searchResults.length > 0 && (
                <div className="results-section">
                    <DisplayResults 
                        searchResults={cardsDisplayed} 
                        deckId={deckId} 
                        setIsError={setIsError}
                    />

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
    )
}