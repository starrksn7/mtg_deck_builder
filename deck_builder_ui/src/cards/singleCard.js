import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { replaceTextWithManaSymbols } from "../helperFunctions";

export function SingleCard() {
    const location = useLocation();
    const cardInfo = location.state?.resultsArray[0] ?? [];
    const [rulingsArray, setRulingsArray] = useState([]);

    let { color_identity, colors, fullArtLink, gameChanger, image_uris, mana_cost,
        name, oracle_text, price, scryfall_id, type_line
    } = cardInfo;

    console.log(cardInfo);

    useEffect(() => {
        const getRulings = async () => {
            const res = await api.get(`/card/search?searchTerm=${searchInput}`);
            const rulings = response.data.map(entry => JSON.parse(entry));
            setRulingsArray(rulings);
        }

        getRulings();
    }, [scryfall_id])
    
    return (
        <div className="single-card-container">
            <div className="signel-card-grid">
                <div className="single-card-image">
                    <img src={image_uris} alt={name} />
                </div>
                <div className="single-card-name">
                    {name}
                </div>
                <div className="single-card-cost">
                    <span dangerouslySetInnerHTML={{ __html: replaceTextWithManaSymbols(mana_cost) }} />
                </div>
                <div className="single-card-type">
                    {type_line}
                </div>
                <div className="single-card-oracle">
                    {oracle_text}
                </div>
                <div className="single-card_image">
                    {image_uris}
                </div>
            </div>
            <div className="rulings">
                Rulings area
            </div>
        </div>
    )
}