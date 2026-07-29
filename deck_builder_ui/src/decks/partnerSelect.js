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

            <div className="results-grid">
                {cardList.map((card) => (
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
                                }}>
                                Set As {keyword}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )
}