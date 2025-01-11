import React from "react"
import axios from 'axios'

export const DisplayResults = ({searchResults, deckId, setIsError}) => {
    console.log("searchResults in displayResults = ")
    console.log(searchResults)

    const addToDeck = async (e) => {
        e.preventDefault();
        const card = e.target;
        const res = await axios.post('http://localhost:8080/decks/add', { deckId, card })
        if(res) console.log("added card to deck. Need to find a better notification than this")
        else console.log("Couldn't add the card to deck, for some reason")
   }

    if(searchResults[0]?.error) {
        setIsError(true)
        return (
            <div>
                No results found for that search term
            </div>
        )
    } else {
        setIsError(false)
        return searchResults.map((card, index) => (
            <div key={index}>
                <div>
                    <img src={card.image_link} alt='alternate text'/>
                    <div>{card.name}</div>
                    <div>Type: {card.type}</div>
                    <div>{card.oracle_text}</div>
                    <form onSubmit={addToDeck}>
                        <button type="submit">Add to Deck</button>
                    </form>
                </div>  
            </div>
    ))
    }
}