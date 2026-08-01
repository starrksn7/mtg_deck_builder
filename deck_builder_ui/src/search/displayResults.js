import React, {useState, useEffect} from "react"
import { createCardObject } from "../helperFunctions"
import { useLocation, useNavigate } from "react-router-dom"
import '../css/createModal.css'
import api from "../api/axios"
import { SearchResultsList } from "./searchResultsList"

export const DisplayResults = ({searchResults, setIsError}) => {
    const location = useLocation();
    const [deckName, setDeckName] = useState('')
    const [showModal, setShowModal] = useState(false)
    const [selectedCard, setSelectedCard] = useState(null)
    const navigate = useNavigate();
    const [deckId, setDeckId] = useState('');
    const userId = localStorage.getItem('userId');
   
    const handleCreateDeck = async () => {
        if (!deckName || !selectedCard) return;
        
        const cardObject = createCardObject(selectedCard);
        const partner = cardObject.keyword.includes("Partner")
        const background = cardObject.keyword.includes("Choose a background")
        const friends = cardObject.oracleText.includes("Friends forever")
        const companion = cardObject.type.includes("Time Lord Doctor")
        if (friends || partner || background || companion) cardObject.isPartner = true;
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

            let keyword;
            if (friends){
                keyword = 'friends';
            } else if (partner){
                keyword = 'partner';
            } else if (background){
                keyword = 'background';
            } else if (companion){
                keyword = 'companion';
            }

            if (friends || partner || background || companion){
                navigate(`/decks/${responseId}/${keyword}`);
            } else {
                navigate(`/decks/${responseId}`);
            }
            
        } else {
            console.log("new deck could not be created");
        }
    }

    useEffect(() => {
        setIsError(!!searchResults[0]?.error);
    }, [searchResults, setIsError]);

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
            <SearchResultsList
                searchResults={searchResults}
                actionLabel="Set As Commander"
                onAction={(card) => {
                    setSelectedCard(card);
                    setShowModal(true);
                }}
            />
        </>
    );
}