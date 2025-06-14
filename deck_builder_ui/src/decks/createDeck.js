import { useState } from "react"
import axios from "axios"
import { RenderColorOptions } from "../search/renderColorOptions"
import { getBaseColors } from "../helperFunctions"
import { CascadingDropdown } from "../search/cascadingDropdown"
import { DisplayResults } from "../search/displayResults"
import { Pagination } from "../search/pagination"

export function CreateDeck(){
    const [searchColor, setSearchColor] = useState('')
    const [searchInput, setSearchInput] = useState('')
    const [searchResults, setSearchResults] = useState([])
    const [isError, setIsError] = useState(false);
    const deckId = 100;
    const [currentPage, setCurrentPage] = useState(1);
    const [cardsPerPage, setCardsPerPage] = useState(25);
    const indexOfLastCard = currentPage * cardsPerPage;
    const indexOfFirstCard = indexOfLastCard - cardsPerPage;

    const findCommanderWithSearch = async (e) => {
        e.preventDefault();
        const response = await axios.post('http://localhost:8080/card/searchForCommanderByName', 
            {keyword: searchInput})
        
        const resultsArray = response.data.map(entry => JSON.parse(entry));
        setSearchResults(resultsArray);
    }

    const findCommanderByColor = async (searchColor) => {
        const color = getBaseColors(searchColor.toLowerCase());

        const response = await axios.post('http://localhost:8080/card/searchForCommanderByColor',
            {colorIdentity: color}
        )

        const resultsArray = response.data.map(entry => JSON.parse(entry));
        setSearchResults(resultsArray);

        console.log("XXXXXXX")
        console.log(resultsArray)
        console.log("XXXXXXX")
        console.log(searchResults)
        console.log("XXXXXXX")
    }

    const handleDropdownSelection = (selectedColor) => {
        setSearchColor(selectedColor);
        findCommanderByColor(selectedColor);
    }

            
    return (
        <div>
            <form onSubmit={findCommanderWithSearch}>
                <input
                    type="text"
                    placeholder="Commander Search"
                    onChange={(e) => setSearchInput(e.target.value)}
                    value={searchInput}
                />
                <button type="submit">Find A Commander</button>
            </form>
            <CascadingDropdown onColorSelect={handleDropdownSelection} />
            {searchResults && (
                <div> 
                    <DisplayResults searchResults={searchResults} deckId={deckId} setIsError={setIsError}/>         
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