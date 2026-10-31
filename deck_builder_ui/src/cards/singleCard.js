import { useLocation, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { replaceTextWithManaSymbols, lostImage } from "../helperFunctions";
import api from '../api/axios'
import { SearchBar } from "../search/searchBar";
import { Loader } from "../search/loader";

export function SingleCard() {
    const {scryfallId} = useParams();
    const location = useLocation();
    const [card, setCard] = useState(location.state?.card ?? null);
    const [isLoading, setIsLoading] = useState(!location.state?.card);
    const [error, setError] = useState('');
    const [rulingsArray, setRulingsArray] = useState([]);

    useEffect(() => {
        let cancelled = false;

        async function fetchCard() {
            const stateCard =
                location.state?.card ??
                location.state?.resultsArray?.[0] ??
                null;

            if (stateCard?.scryfall_id === scryfallId) {
                setCard(stateCard);
                setIsLoading(false);
                setError('');
                return;
            }

            setIsLoading(true);
            setError('');

            try {
                const response = await api.get(
                    `/card/getCardById?scryfallId=${scryfallId}`
                );

                if (cancelled) return;

                const data = response.data;

                const fetchedCard = Array.isArray(data)
                    ? JSON.parse(data[0])
                    : typeof data === 'string'
                        ? JSON.parse(data)
                        : data;

                setCard(fetchedCard);

                setCard(fetchedCard);
            } catch (err) {
                if (!cancelled) {
                    setError('Unable to load this card.');
                }
            } finally {
                if (!cancelled) {
                    setIsLoading(false);
                }
            }
        }

        fetchCard();

        return () => {
            cancelled = true;
        };
    }, [scryfallId, location.state]);

    useEffect(() => {
        const getRulings = async () => {
            const response = await api.get(`/card/rulings?scryfallId=${scryfallId}`);
            const rulings = response.data.map(entry => JSON.parse(entry));
            setRulingsArray(rulings[0]?.data);
        }

        getRulings();
    }, [scryfallId])
    console.log("xxxxxxxxxx")
    console.log(rulingsArray)
    console.log(card)

    let { color_identity, colors, fullArtLink, gameChanger, image_uris, mana_cost,
        name, oracle_text, price, scryfall_id, type_line, prices
    } = card ?? {};

    let usd = price.toFixed(2) ?? prices?.usd.toFixed(2);
    let image = typeof image_uris === 'string'
        ? image_uris
        : image_uris?.large;
    
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
                    <img src={image} alt={name} />
                </div>
                <div className="single-card-name">
                    {name}
                    {gameChanger && (
                        <div className="single-card-gc">
                            Game Changer
                        </div>
                    )}
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
                {usd && 
                    <div className="single-card-price">
                        ${usd}
                    </div>
                }
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