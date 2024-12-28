import React from "react"
import axios from 'axios'

export const DisplayResults = ({searchResults, deckId}) => {

    const addToDeck = async (e) => {
        e.preventDefault();
        const card = e.target;
        const res = await axios.post('http://localhost:8080/decks/add', { deckId, card })
        if(res) console.log("added card to deck. Need to find a better notification than this")
        else console.log("Couldn't add the card to deck, for some reason")
   }

    if(searchResults) {
        return searchResults.map((card, index) => (
                <div>
                    <div key={index}>
                        <div>{card.name}</div>
                        <img src={card.image_link} alt='alternate text'/>
                        <form onSubmit={addToDeck}>
                            <button type="submit">Add to Deck</button>
                        </form>
                    </div>  
                </div>
        ))
    } else {
        return (
            <div>
                No results found for that search term
            </div>
        )
    }
}