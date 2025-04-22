import axios from 'axios'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

export function AllDecks() {
    const [deckList, setDeckList] = useState('')
    const [showConfirm, setShowConfirm] = useState(false)

    useEffect(() => {
        const res = axios.get('http://localhost:8080/user?userId=1')
            .then((res) => {
                let data = res.data
                let resultsArray = [];
                data.forEach(entry => {
                    resultsArray.push(entry);
                })
                setDeckList(resultsArray);
            })
    }, [])

    const cancelDelete = () => {
        setShowConfirm(false)
    }

    const handleDelete = () => {
        setShowConfirm(true)
    }

    if(deckList) {
        return deckList.map((deck, index) => {
            return (
                <div key={index}>
                    <Link to={`/decks/${deck.deckId}`}>
                        <img src={deck.imageLink} alt='alternate text'/>
                        <div>Deck Name: {deck.deckName}</div>
                        <div>Commander: {deck.commander}</div>
                    </Link>
                    {showConfirm && (
                        <div className="confirmation-dialog">
                        <p>Are you sure you want to delete {deck.deckName} from this deck?</p>
                        <button onClick={() => deleteDeck(deck)}>Delete</button>
                        <button onClick={cancelDelete}>Cancel</button>
                        </div>
                    )}
                </div>
            )
        })
    }
}