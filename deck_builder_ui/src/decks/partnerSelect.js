import api from "../api/axios"

export const PartnerSelect = ({deckId, keyword}) => {

    const getOptions =  async () => {
        await api.post(`/cards?keyword=${keyword}`)
    }
}