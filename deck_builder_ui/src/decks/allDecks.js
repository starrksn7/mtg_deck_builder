import api from '../api/axios'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

export function AllDecks() {
    const [deckList, setDeckList] = useState([]);
    const [showConfirm, setShowConfirm] = useState(false);
    const [selectedDeck, setSelectedDeck] = useState(null);
    const userId = localStorage.getItem('userId');

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

    const deleteDeck = async () => {
        if (!selectedDeck) return;

        const res = await api.delete('/decks/deleteDeck', {
            data: selectedDeck.deckId
        });

        if (res) {
            setDeckList(prev =>
                prev.filter(d => d.deckId !== selectedDeck.deckId)
            );

            setShowConfirm(false);
            setSelectedDeck(null);
        }
    }

    const cancelDelete = () => {
        setShowConfirm(false);
        setSelectedDeck(null);
    };

    const handleDelete = (deck) => {
        setSelectedDeck(deck);
        setShowConfirm(true);
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
                {showConfirm && (
                    <div className="delete-deck-modal-overlay">
                        <div className="delete-deck-modal">
                            <h3>Delete Deck?</h3>

                            <p>
                                Are you sure you want to delete "{selectedDeck?.deckName}"?
                            </p>

                            <div className="delete-deck-modal-buttons">
                                <button onClick={cancelDelete}>
                                    Cancel
                                </button>

                                <button onClick={deleteDeck}>
                                    Confirm Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )}
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