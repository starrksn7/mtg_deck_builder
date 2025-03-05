import axios from 'axios'
import { useState } from 'react'
import { Link } from 'react-router-dom'

export function AllDecks() {
    const [deckList, setDeckList] = useState('')

    const getAllDecks = () => {
        const res = axios.get('http://localhost:8080/decks')

        let data = res.data

        if(data) setDeckList(data)
        else console.log("The list of decks for this user could not be found")
    }

    const showDecks = (deckList) => {
        if(deckList.length){
            return deckList.map((deck, index) => {
                <div key={index}>
                    <Link to={`/decks/${deck.deckId}`}>
                        <div>{deck.deckName}</div>
                    </Link>
                    <div>{deck.commander}</div>
                </div>
            })
        }
    }
}