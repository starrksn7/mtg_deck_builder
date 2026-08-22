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
   
    console.log(searchResults)
    const handleCreateDeck = async () => {
        if (!deckName || !selectedCard) return;
        
        const cardObject = createCardObject(selectedCard);
        const partner = cardObject.keyword.includes("Partner")
        const background = cardObject.keyword.includes("Choose a background")
        const friends = cardObject.oracleText.includes("Friends forever")
        const companion = cardObject.type.includes("Time Lord Doctor")
        const partnerWith = cardObject.keyword.includes("Partner With")
        const partnerName = cardObject.oracleText.match(/^Partner with (.*?) /);

        //Need to call a get on scryfall to get the information fort he partnerName value
        //then add that to the cardObject, then send that to the create endpoint, then 
        //route them to the deck page instead of the page to pick a partner
        if (friends || partner || background || companion || partnerWith) cardObject.isPartner = true;
        console.log(cardObject)
        const res = await api.post('/decks/create', { 
            userId: userId, 
            deckName, 
            cardDTO: cardObject
        });

        let partnerInfo;
        if (partnerName) {
            //can probably break this out into a separate function later, since this is duplicated from the partner select
            const cardSearchDTO = { name: partnerName };
            const partnerInfo = await api.post('cards/searchByName', {
                cardSearchDTO
            })

            cardObject.partnerId = partnerInfo.scryfallId;
            cardObject.partnerColorIdentity = partnerInfo.colorIdentity;

            const partnerColorIdentity = selectedCard.color_identity;
            const combinedColorIdentity = [...new Set([...cardObject.colorIdentity, ...partnerColorIdentity])];
            const requestBody = {
                deckId,
                deckName: deckName,
                commander: cardObject.name,
                isPartner: true,
                colorIdentity: combinedColorIdentity.toString(),
                bannerImage: cardObject.fullArtLink,
                partnerId: partnerInfo.scryfallId,
                partnerColorIdentity: partnerInfo.colorIdentity
            };

            const deckUpdateResponse = await api.put('/decks/update', requestBody);

            //this is to add the card to the deck
            const cardSearchDTO = { 
                deckId,
                identifiers: [{name: selectedCard.name}]
            }

            const addCardResponse = await api.post('/decks/addCollection', cardSearchDTO)
        } 

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