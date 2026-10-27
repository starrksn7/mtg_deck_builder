import { useLocation, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { replaceTextWithManaSymbols, lostImage } from "../helperFunctions";
import api from '../api/axios'
import { SearchBar } from "../search/searchBar";
import { Loader } from "../search/loader";

export function SingleCard() {
    const scryfallId = useParams();
    const location = useLocation();
    const [card, setCard] = useState(location.state?.card ?? null);
    const [isLoading, setIsLoading] = useState(!location.state?.card);
    const [error, setError] = useState('');
    const cardInfo = location.state?.resultsArray[0] ?? [];
    const [rulingsArray, setRulingsArray] = useState([]);

    useEffect(() => {
        let cancelled = false;

        async function fetchCard() {
            if (location.state?.card?.scryfall_id === scryfallId) {
                setCard(location.state.card);
                setIsLoading(false);
                setError('');
                return;
            }

            setIsLoading(true);
            setError('');

            try {
                //need to verify backend for this
                const response = await api.get(
                    `/getCardbyId?scryfallId=${scryfallId}`
                );

                if (response) setCardData(response.data);

            } catch (err) {
                if (!response) {
                    setError('Unable to load this card.');
                }
            } finally {
                setIsLoading(false);
            }
        }

        fetchCard();

    }, [scryfallId, location.state?.card])
    
    let { color_identity, colors, fullArtLink, gameChanger, image_uris, mana_cost,
        name, oracle_text, price, scryfall_id, type_line, prices
    } = cardInfo;

    useEffect(() => {
        const getRulings = async () => {
            const response = await api.get(`/card/rulings?scryfallId=${scryfall_id}`);
            const rulings = response.data.map(entry => JSON.parse(entry));
            setRulingsArray(rulings[0]?.data);
        }

        getRulings();
    }, [scryfall_id])
    console.log("xxxxxxxxxx")
    console.log(rulingsArray)
    console.log(cardInfo)

    if (isLoading) return <Loader />;
    if (error) return <p>{error}</p>;
    if (!card) return (
        <div>
            <p>We can't seem to find what you're looking for. Please search again</p>
            <img 
                src={lostImage}
                alt="fblthp the lost" 
            />
        </div>
    );

    return (
        <div className="single-card-container">
            <div style={{ maxWidth: '600px', margin: '0 auto', padding: '0 16px 24px' }}> 
                <SearchBar />
            </div>
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
                    <span dangerouslySetInnerHTML={{ __html: replaceTextWithManaSymbols(oracle_text) }} />
                </div>
                <div className="single-card-price">
                    ${price}
                </div>
            </div>
            { rulingsArray.length > 0 ? (
                <div className="ruling-container">
                    {rulingsArray.map((ruling, index) => {
                        return (
                            <div className="ruling" key={index}>
                                {ruling.comment}
                            </div>
                        )
                    })}
                </div>
            ) : <div></div>}
        </div>
    )
}