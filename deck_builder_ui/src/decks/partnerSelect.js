import api from "../api/axios"
import { useParams, useNavigate } from "react-router-dom"
import { Loader } from "../search/loader";
import { useState, useEffect } from "react";
import { SearchResultsList } from "../search/searchResultsList";
import { Pagination } from "../search/pagination";

export const PartnerSelect = () => {
    //once a partner is selected I need to make sure I update the deck information with the partnerId and the colorIdentity
    //as well as add the card to the decklist
    const [isLoading, setIsLoading] = useState(false);
    const [optionsNotFound, setOptionsNotFound] = useState(false);
    const [cardList, setCardList] = useState([]);
    const [selectedCard, setSelectedCard] = useState('');
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();
    const [deckMetaData, setDeckMetaData] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [cardsPerPage, setCardsPerPage] = useState(25);
    const [isError, setIsError] = useState(false);
    const indexOfLastCard = currentPage * cardsPerPage;
    const indexOfFirstCard = indexOfLastCard - cardsPerPage;
    const cardsDisplayed = cardList.slice(indexOfFirstCard, indexOfLastCard)


    const { deckId, keyword } = useParams();

    useEffect(() => {
        const getPartnerOptions = async () => {
            try {
                setIsLoading(true);
                const res = await api.get(`/card?keyword=${keyword}`)

                const resultsArray = res.data.map(entry => JSON.parse(entry));
                setCardList(resultsArray);

            } catch (e) {
                console.log("could not retrieve partner options", e);
                setOptionsNotFound(true);
            } finally {
                setIsLoading(false);
            }
        };

        const loadDeckData = async () => {
            const res = await api.get(`/decks?deckId=${deckId}`);
            setDeckMetaData(res.data.metadata);
        };

        getPartnerOptions();
        loadDeckData();
    }, [deckId]);

    const handleSetPartner = async () => {
        setShowModal(false)
        //this is to update the deck metadata with info about the selected partner
        // const partnerColorIdentity = card.color_identity.match(/[A-Za-z0-9]+/g) || [];
        const partnerColorIdentity = selectedCard.color_identity;
        const combinedColorIdentity = [...new Set([...deckMetaData.colorIdentity, ...partnerColorIdentity])];
        const requestBody = {
            deckId,
            deckName: deckMetaData.deckName,
            commander: deckMetaData.commander,
            isPartner: true,
            colorIdentity: combinedColorIdentity.toString(),
            bannerImage: deckMetaData.bannerImage,
            partnerId: selectedCard.scryfallId,
            partnerColorIdentity: selectedCard.colorIdentity
        };

        const deckUpdateResponse = await api.put('/decks/update', requestBody);

        //this is to add the card to the deck
        const cardSearchDTO = { 
            deckId,
            identifiers: [{name: selectedCard.name}]
        }

        const addCardResponse = await api.post('/decks/addCollection', cardSearchDTO)

        navigate(`/decks/${deckId}`)
    }

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
                        <h3>Set {selectedCard.name} as a {keyword}?</h3>
                        <div className="create-modal-buttons">
                            <button 
                                className="create-button" 
                                onClick={handleSetPartner}
                                >
                                Create Deck
                            </button>
                            <button 
                                className="create-cancel-button" 
                                onClick={() => setShowModal(false)}
                                >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <div className="create-deck-page">
                <h1 className="page-title">Select A Partner</h1>
                {isLoading && <Loader />}
                <div className="results-section">
                    <SearchResultsList
                        searchResults={cardsDisplayed}
                        actionLabel="Set As Partner"
                        onAction={(card) => {
                            setSelectedCard(card);
                            setShowModal(card);
                        }}
                    />

                    <Pagination 
                        cardsPerPage={cardsPerPage}
                        totalResults={cardList.length}
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                        isError={isError}
                    />
                </div>
            </div>
        </>
    )
}