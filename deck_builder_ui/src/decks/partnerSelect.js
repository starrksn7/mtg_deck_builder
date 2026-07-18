import api from "../api/axios"

export const PartnerSelect = ({deckId, keword}) => {

    const options = await api.post(`/cards?keyword=${keyword}`)
}