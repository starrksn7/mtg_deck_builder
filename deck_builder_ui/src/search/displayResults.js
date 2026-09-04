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
        console.log("creating deck")
        if (!deckName || !selectedCard) return;
        
        const cardObject = createCardObject(selectedCard);
        const partner = cardObject.keyword.includes("Partner");
        const background = cardObject.keyword.includes("Choose a background");
        const friends = cardObject.oracleText.includes("Friends forever");
        const companion = cardObject.type.includes("Time Lord Doctor");
        const partnerWith = cardObject.keyword.includes("Partner With");
        const partnerName = cardObject.oracleText.match(/^Partner with (.*?) \(/);
        const fatherAndSon = cardObject.oracleText.includes("Father & son");
        const characterSelect = cardObject.oracleText.includes("Character select");
        const survivors = cardObject.oracleText.includes("Survivors ");

        //Need to call a get on scryfall to get the information fort he partnerName value
        //then add that to the cardObject, then send that to the create endpoint, then 
        //route them to the deck page instead of the page to pick a partner
        if (friends || partner || background || companion || partnerWith || fatherAndSon
            || characterSelect || survivors) cardObject.isPartner = true;
        const res = await api.post('/decks/create', { 
            userId: userId, 
            deckName, 
            cardDTO: cardObject
        });
        const responseId = res?.data

        if (partnerName) {
            const partnerInfo = await api.post('/card/searchByName', { name: partnerName[1] })
            console.log("parnter info")
            console.log(partnerInfo)

            cardObject.partnerId = partnerInfo.scryfallId;
            cardObject.partnerColorIdentity = partnerInfo.colorIdentity;

            const partnerColorIdentity = selectedCard.color_identity;
            const combinedColorIdentity = [...new Set([...cardObject.colorIdentity, ...partnerColorIdentity])];
            const requestBody = {
                deckId: responseId,
                deckName: deckName,
                commander: cardObject.name,
                isPartner: true,
                colorIdentity: combinedColorIdentity.toString(),
                bannerImage: cardObject.fullArtLink,
                partnerId: partnerInfo.scryfallId,
                partnerColorIdentity: partnerInfo.colorIdentity
            };
            
            await api.put('/decks/update', requestBody);
            const collectionDTO = { 
                deckId: responseId,
                identifiers: [{name: partnerName[1]}]
            }

            await api.post('/decks/addCollection', collectionDTO)
            navigate(`/decks/${responseId}`);
            return;
        } 

        if (res) {
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
            } else if (fatherAndSon){
                keyword = 'father';
            } else if (characterSelect){
                keyword = 'character';
            } else if (survivors){
                keyword = 'survivors';
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