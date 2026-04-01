import api from '../api/axios'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

export function AllDecks() {
    const [deckList, setDeckList] = useState('');
    const [showConfirm, setShowConfirm] = useState(false);
    const [selectedDeck, setSelectedDeck] = useState(null);
    const userId = localStorage.getItem('userId');

    useEffect(() => {
        const fetchDecks = async () => {
            api.get(`/user?userId=${userId}`)
                .then((res) => {
                    let data = res.data
                    let resultsArray = [];
                    data.forEach(entry => {
                        resultsArray.push(entry);
                    })
                    setDeckList(resultsArray);
                }
            )
        }

        fetchDecks();
    }, [])

    const deleteDeck = async (deck) => {
        const res = await api.delete('/decks/deleteDeck', { data: {
            deckId: 1, 
            }
        })
        if(res) window.location.reload()
    }

    const cancelDelete = () => {
        setShowConfirm(false)
    }

    const handleDelete = (deck) => {
        setSelectedDeck(deck);
    };

    if (deckList) {
        return (
            <div className="deck-grid">
                {deckList.map((deck, index) => (
                    <div key={index} className="deck-card">
                        <Link to={`/decks/${deck.deckId}`} className="deck-link">
                            <img src={deck.imageLink} alt="deck" className="deck-image"/>
                            <div className="deck-info">
                                <h3>{deck.deckName}</h3>
                                <p>Commander: {deck.commander}</p>
                            </div>
                        </Link>
                        <button onClick={() => handleDelete(deck)}>Delete Deck</button>
                        {selectedDeck?.deckId === deck.deckId && (
                            <div className="confirmation-dialog">
                                <p>Are you sure you want to delete {deck.deckName}?</p>
                                <button onClick={() => deleteDeck(deck)}>Delete</button>
                                <button onClick={() => setSelectedDeck(null)}>Cancel</button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        )
    }
}