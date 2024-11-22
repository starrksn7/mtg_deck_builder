import axios from 'axios'
import { useState } from 'react'

export function AllDecks() {
    const [deckList, setDeckList] = useState('')

    const getAllDecks = () => {
        const res = axios.get('http://localhost:8080/decks')

        let data = res.data

        if(data) setDeckList(data)
        else console.log("The list of decks for this user could not be found")
    }
}