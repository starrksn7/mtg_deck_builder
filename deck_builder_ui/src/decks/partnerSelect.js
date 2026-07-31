import api from "../api/axios"
import { useParams } from "react-router-dom"
import { Loader } from "../search/loader";
import { useState, useEffect } from "react";

export const PartnerSelect = () => {
    //once a partner is selected I need to make sure I update the deck information with the partnerId and the colorIdentity
    //as well as add the card to the decklist
    const [isLoading, setIsLoading] = useState(false);
    const [optionsNotFound, setOptionsNotFound] = useState(false);
    const [cardList, setCardList] = useState([]);
    console.log("XXXXXXXXXXXXX")
    console.log(cardList)
    console.log("XXXXXXXXXXXXX")

    const { deckId, keyword } = useParams();

    useEffect(() => {
        const getOptions = async () => {
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

        getOptions();
    }, [deckId]);

    return (
        <div>
            {isLoading && <Loader />}
            <SearchResultsList
                searchResults={searchResults}
                actionLabel="Set As Partner"
                onAction={(card) => {
                    setSelectedCard(card);
                    setShowModal(true);
                }}
            />
        </div>
    )
}