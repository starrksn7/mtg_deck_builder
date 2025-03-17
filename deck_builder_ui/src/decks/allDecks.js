import axios from 'axios'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

export function AllDecks() {
    const [deckList, setDeckList] = useState('')
    
    useEffect(() => {
        const res = axios.get('http://localhost:8080/decks?id=1')
            .then((res) => {
                let data = res.data
                let resultsArray = [];
                data.forEach(entry => {
                    resultsArray.push(entry);
                })
                setDeckList(resultsArray);
            })
    }, [])

    if(deckList) {
        return deckList.map((deck, index) => {
            console.log("image link = ", deck.image_link)
            return (
                <div key={index}>
                    <Link to={`/decks/${deck.deckId}`}>
                        <img src={deck.imageLink} alt='alternate text'/>
                        <div>Deck Name: {deck.deckName}</div>
                        <div>Commander: {deck.commander}</div>
                    </Link>
                </div>
            )
        })
    }
}