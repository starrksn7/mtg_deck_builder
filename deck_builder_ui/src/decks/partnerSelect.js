import api from "../api/axios"
import { useParams } from "react-router-dom"

export const PartnerSelect = () => {

    const { deckId, keyword } = useParams();

    const getOptions =  async () => {
        await api.post(`/cards?keyword=${keyword}`)
    }
}