import api from '../api/axios'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

export function AllDecks() {
    const [deckList, setDeckList] = useState([]);
    const [showConfirm, setShowConfirm] = useState(false);
    const [selectedDeck, setSelectedDeck] = useState(null);
    const userId = localStorage.getItem('userId');
    console.log(deckList)
    useEffect(() => {
        const fetchDecks = async () => {
            api.get(`/user?userId=${userId}`)
                .then((res) => {
                    setDeckList(res.data);
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

    if (deckList.length > 0) {
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
    } else {
        return (
            <div className="empty-decks-container">
                <div className="empty-decks-card">
                    <div className="empty-icon">🃏</div>

                    <h2>No Decks Yet</h2>

                    <p>
                        You haven't built any decks yet. Start your first commander deck and
                        begin brewing something awesome.
                    </p>

                    <Link to="/create" className="build-deck-btn">
                        Build Your First Deck
                    </Link>
                </div>
            </div>
        )
    }
}