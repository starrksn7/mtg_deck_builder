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
            <div>
                <div className="deck-list">
                    <div className="deck-row header">
                        <span></span> 
                        <span>Name</span>
                        <span>Commander</span>
                        <span></span>
                    </div>
                    {deckList.map((deck, index) => (
                        <div key={index} className="deck-row">
                            <img src={deck.imageLink}/>

                            <Link to={`/decks/${deck.deckId}`} className="deck-name">
                                {deck.deckName}
                            </Link>

                            <Link to={`/decks/${deck.deckId}`} className="deck-commander">
                                {deck.commander}
                            </Link>

                            <button 
                                className="delete-btn"
                                onClick={() => handleDelete(deck)}
                            >
                                Delete
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        )
    }
}