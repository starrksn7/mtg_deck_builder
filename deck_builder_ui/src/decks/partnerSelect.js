import api from "../api/axios"
import { useParams } from "react-router-dom"
import { Loader } from "../search/loader";
import { useState, useEffect } from "react";

export const PartnerSelect = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [optionsNotFound, setOptionsNotFound] = useState(false);
    const [cardList, setCardList] = useState([]);
    console.log("XXXXXXXXXXXXX")
    console.log(cardList)
    console.log("XXXXXXXXXXXXX")

    const { deckId, keyword } = useParams();

    const getOptions =  async () => {
        
    }

        useEffect(() => {
            const getOptions = async () => {
                try {
                    setIsLoading(true);

                    const res = await api.post(`/cards?keyword=${keyword}`)

                    const resultsArray = res.data.map(entry => JSON.parse(entry));
                    setCardList(resultsArray);
                    

                } catch (e) {
                    console.log("could not retrieve partner options", e);
                    optionsNotFound(true);
                } finally {
                    setIsLoading(false);
                }
            };

            getOptions();
        }, [deckId]);

    return (
        <div>
            {isLoading && <Loader />}
        </div>
    )
}