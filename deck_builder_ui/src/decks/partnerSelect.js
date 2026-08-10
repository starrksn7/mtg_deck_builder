import api from "../api/axios"
import { useParams, useNavigate } from "react-router-dom"
import { Loader } from "../search/loader";
import { useState, useEffect } from "react";
import { SearchResultsList } from "../search/searchResultsList";

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

    const { deckId, keyword } = useParams();
    //need to consider how to handle 'partner with' since it's a specific option
    //maybe just add it to the deck info automatically?

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

    const handleSetPartner = async (card) => {
        setShowModal(false)
        //need to update the deck with partner information
        const partnerColorIdentity = card.colorIdentity.match(/[A-Za-z0-9]+/g) || [];
        const combinedColorIdentity = [...new Set([...deckMetaData.colorIdentity, ...partnerColorIdentity])];
        const requestBody = {
            deckId,
            deckName: deckMetaData.deckName,
            commander: deckMetaData.commander,
            isPartner: true,
            colorIdentity: combinedColorIdentity,
            bannerImage: deckMetaData.bannerImage,
            partnerId: card.scryfallId,
            partnerColorIdentity: card.colorIdentity
        };

        const deckUpdateResponse = await api.put('/decks/update', requestBody);

        //need to add the card to the deck as well
        const cardSearchDTO = { 
            deckId,
            identifiers: [{name: card.name}]
        }

        const addCardResponse = await api.post('/decks/addCollection', cardSearchDTO)

        navigate(`/decks/${deckId}`)
    }

    return (
        <div className="create-deck-page">
            <h1 className="page-title">Select A Partner</h1>
            {isLoading && <Loader />}
            <div className="results-section">
                <SearchResultsList
                    searchResults={cardList}
                    actionLabel="Set As Partner"
                    onAction={(card) => {
                        setSelectedCard(card);
                        setShowModal(card);
                    }}
                />
            </div>
        </div>
    )
}