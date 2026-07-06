import React, {useState} from "react"
import { replaceTextWithManaSymbols, createCardObject } from "../helperFunctions"
import { useLocation, useNavigate } from "react-router-dom"
import '../css/createModal.css'
import api from "../api/axios"

export const DisplayResults = ({searchResults, setIsError}) => {
    const location = useLocation();
    const isOnCreatePage = location.pathname === '/create' 
    const [deckName, setDeckName] = useState('')
    const [showModal, setShowModal] = useState(false)
    const [selectedCard, setSelectedCard] = useState(null)
    const navigate = useNavigate();
    const [deckId, setDeckId] = useState('');
    const userId = localStorage.getItem('userId');

    // console.log(searchResults)
    searchResults.forEach(result => {
        console.log("XXXXXXXXXX")
        console.log(result.keywords)
        console.log(typeof result.keywords)
                console.log("XXXXXXXXXX")

    })

    const addToDeck = async (card) => {
        let cardObject = createCardObject(card)
        
        const res = await api.post('/decks/add', { deckId: deckId, cardDto: cardObject})
        if(res) console.log("added card to deck. Need to find a better notification than this")
        else console.log("Couldn't add the card to deck, for some reason")
   }

   const handleCreateDeck = async () => {
        if (!deckName || !selectedCard) return;
        
        const cardObject = createCardObject(selectedCard);

        console.log(cardObject)
        const res = await api.post('/decks/create', { 
            userId: userId, 
            deckName, 
            cardDTO: cardObject
        });

        if (res) {
            const responseId = res?.data;
            setShowModal(false);
            setDeckName('');
            setSelectedCard(null);
            navigate(`/decks/${responseId}`);
        } else {
            console.log("new deck could not be created");
        }
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
        return (
            <>
                {showModal && (
                    <div className="create-modal" onClick={() => setShowModal(false)}>
                        <div 
                        className="create-modal-content"
                        onClick={(e) => e.stopPropagation()}
                        >
                            <button 
                                className="modal-close"
                                onClick={() => setShowModal(false)}
                            >
                                ×
                            </button>
                            <h3>Name your new deck</h3>
                            <input 
                                type="text" 
                                value={deckName} 
                                onChange={(e) => setDeckName(e.target.value)} 
                                placeholder="Enter deck name"
                            />
                            <div className="create-modal-buttons">
                                <button 
                                className="create-cancel-button" 
                                onClick={() => setShowModal(false)}
                                >
                                Cancel
                                </button>
                                <button 
                                className="create-button" 
                                onClick={handleCreateDeck}
                                >
                                Create Deck
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                <div className="results-grid">
                    {searchResults.map((card) => (
                        <div className="result-row">
                            <img src={card.fullArtLink} alt={card.name} />
                            <div className="content">
                                <div className="top">
                                    <div className="name">{card.name}</div>
                                    <div 
                                        className="mana"
                                        dangerouslySetInnerHTML={{ __html: replaceTextWithManaSymbols(card.mana_cost) }} 
                                    />
                                    <div className="type">{card.type}</div>
                                </div>
                                <div 
                                    className="oracle"
                                    dangerouslySetInnerHTML={{ __html: replaceTextWithManaSymbols(card.oracle_text) }} 
                                />
                            </div>
                            <button className="action" onClick={() => {
                                    setSelectedCard(card);
                                    setShowModal(true);}}>
                                        Set As Commander
                            </button>
                        </div>
                    ))}
                </div>
            </>
        );
    }
}