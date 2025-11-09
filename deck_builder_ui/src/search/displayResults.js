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

    const addToDeck = async (card) => {
        let cardObject = createCardObject(card)
        
        const res = await api.post('/decks/add', { deckId: deckId, cardDto: cardObject})
        if(res) console.log("added card to deck. Need to find a better notification than this")
        else console.log("Couldn't add the card to deck, for some reason")
   }

   const handleCreateDeck = async () => {
        if (!deckName || !selectedCard) return;
        
        const cardObject = createCardObject(selectedCard);

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
                    <div className="popup-overlay">
                        <div className="popup-content">
                            <h3>Name your new deck</h3>
                            <input 
                                type="text" 
                                value={deckName} 
                                onChange={(e) => setDeckName(e.target.value)} 
                                placeholder="Enter deck name"
                            />
                            <button onClick={handleCreateDeck}>Create Deck</button>
                            <button onClick={() => setShowModal(false)}>Cancel</button>
                        </div>
                    </div>
                )}
                
                {searchResults.map((card, index) => (
                    <div key={index}>
                        <div>
                            <img src={card.image_link} alt='alternate text'/>
                            <div>{card.name}</div>
                            <div dangerouslySetInnerHTML={{ __html: replaceTextWithManaSymbols(card.mana_cost) }} ></div>
                            <div>Type: {card.type}</div>
                            <div dangerouslySetInnerHTML={{ __html: replaceTextWithManaSymbols(card.oracle_text) }} ></div>
                            <button type="submit" onClick={() => {
                                if(isOnCreatePage){
                                    setSelectedCard(card)
                                    setShowModal(true)
                                } else {
                                    addToDeck(card)
                                }
                            }}>
                                {isOnCreatePage ? 'Set as Commander' : 'Add to Deck'}
                            </button>
                        </div>  
                    </div>
                ))}
            </>
        );
    }
}