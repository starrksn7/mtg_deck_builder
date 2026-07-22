import api from "../api/axios"
import { useParams, useState } from "react-router-dom"

export const PartnerSelect = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [optionsNotFound, setOptionsNotFound] = useState(false);

    const { deckId, keyword } = useParams();

    const getOptions =  async () => {
        
    }

        useEffect(() => {
            const getOptions = async () => {
                try {
                    setLoading(true);

                    const res = await api.post(`/cards?keyword=${keyword}`)
                    

                } catch (e) {
                    console.log("could not retrieve partner options", e);
                    optionsNotFound(true);
                } finally {
                    setLoading(false);
                }
            };

            fetchDeck();
        }, [deckId]);
}