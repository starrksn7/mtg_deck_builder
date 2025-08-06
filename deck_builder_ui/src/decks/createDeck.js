import { useState } from "react"
import axios from "axios"
import { getBaseColors } from "../helperFunctions"
import { CascadingDropdown } from "../search/cascadingDropdown"
import { DisplayResults } from "../search/displayResults"
import { Pagination } from "../search/pagination"
import { Loader } from "../search/loader"

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
    const cardsDisplayed = searchResults.slice(indexOfFirstCard, indexOfLastCard)
    const [isLoading, setIsLoading] = useState(false)
    const [collectionList, setCollectionList] = useState('');

    console.log(collectionList)

    const findCommanderWithSearch = async (e) => {
        e.preventDefault();
        setIsLoading(true)
        setSearchResults([])
        const response = await axios.post('http://localhost:8080/card/searchForCommanderByName', 
            {searchTerm: searchInput})
        
        const resultsArray = response.data.map(entry => JSON.parse(entry));
        setSearchResults(resultsArray);
        setIsLoading(false)
    }

    const findCommanderByColor = async (searchColor) => {
        setIsLoading(true)
        setSearchResults([])
        const color = getBaseColors(searchColor.toLowerCase());

        const response = await axios.post('http://localhost:8080/card/searchForCommanderByColor',
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

    const handleAddCollection = async () => {
        const identifiersArray = collectionList.split(/\r?\n/);

        const identifiers = identifiersArray.map((item) => ({ name: item }))
        
        const cardSearchDTO = { 
            deckId,
            identifiers
        }

        const response = await axios.post('http://localhost:8080/decks/addCollection', cardSearchDTO)

        const results = response.data;
    }

    const handleChange = (e) => {
        setCollectionList(e.target.value)
    }

    //it might be better to move the text area to add a collection to the single deck component instead of the create
    //since create seems like where they would start the deck, and singleDeck is where they would view it and make
    //changes to it.
            
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
            {isLoading ? <Loader /> : <div></div>}
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
            <form>
                <textarea 
                    value={collectionList}
                    onChange={handleChange}
                    placeholder="Add cards to deck"
                />
                <button type="button" onClick={handleAddCollection}>
                    Submit
                </button>
            </form>
        </div>
    )
}