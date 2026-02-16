import api from '../api/axios';
import { useState, useEffect, useMemo } from 'react'
import { 
    replaceTextWithManaSymbols, 
    duplicateCardCheck, 
    colorIdentityCheck, 
    calculateManaCurve, 
    getRarities, 
    groupCardsByType 
} from '../helperFunctions'
import { useParams } from 'react-router-dom';
import '../App.css';
import { BarChart } from '../charts/barChart';
import { PieChart } from '../charts/pieChart';

export function SingleDeck() {
    const { deckId } = useParams();
    const [cardList, setCardList] = useState([]);
    const [previewCardId, setPreviewCardId] = useState(null);
    const [confirmingCard, setConfirmingCard] = useState(null);
    const [deckNotFound, setDeckNotFound] = useState(false);
    const [collectionList, setCollectionList] = useState('');
    const [collectionTooBigError, setCollectionTooBigError] = useState(false);
    const [loading, setLoading] = useState(true);

    console.log(cardList)

    const groupedCards = useMemo(() => {
        return groupCardsByType(cardList);
    }, [cardList]);

    const duplicatedCardsArray = useMemo(() => {
        return duplicateCardCheck(cardList);
    }, [cardList]);

    const mismatchedArray = useMemo(() => {
        return colorIdentityCheck(cardList);
    }, [cardList]);

    const manaCurve = useMemo(() => {
        return calculateManaCurve(cardList);
    }, [cardList]);

    const rarities = useMemo(() => {
        return getRarities(cardList);
    }, [cardList]);

    const deckPrice = useMemo(() => {
        return cardList.reduce((sum, card) => {
            if (card.type.includes('Basic Land')) return sum;
            return sum + card.price;
        }, 0);
    }, [cardList]);

    const commander = useMemo(() => {
        return cardList.find(card => card.name === card.deckCommander);
    }, [cardList]);

    const deckName = useMemo(() => {
        return cardList.length > 0 ? cardList[0].deckName : '';
    }, [cardList]);

    console.log("commander")
    console.log(commander)
    const renderOrder = [
    'Commander',
    'Creatures',
    'Enchantments',
    'Instants',
    'Sorceries',
    'Artifacts',
    'Planeswalkers',
    'Lands'
    ];

    useEffect(() => {
        const fetchDeck = async () => {
            try {
                setLoading(true);

                const res = await api.get(`/decks?deckId=${deckId}`);
                setCardList(res.data);
                setDeckNotFound(false);

            } catch (e) {
                console.log("Deck not found", e);
                setDeckNotFound(true);
            } finally {
                setLoading(false);
            }
        };

        fetchDeck();
    }, [deckId]);



    const deleteFromDeck = async (card) => {
        const res = await api.delete('/decks/remove', { data: {
            deckId: deckId, 
            cardDto: {
                scryfallId: card.scryfallId
                }
            }
        })
        if (res.status === 200) {
            setCardList(prev =>
                prev.filter(c => c.scryfallId !== card.scryfallId)
            );
            setConfirmingCard(null);
        }
    }

    const cancelDelete = () => {
        setConfirmingCard(null)
    }

    const handleDelete = (card) => {
        setConfirmingCard(card)
    }

    const handleAddCollection = async () => {
        const identifiersArray = collectionList.split(/\r?\n/).filter(line => line.trim() !== "");

        if (identifiersArray.length > 75){
            setCollectionTooBigError(true);
            return;
        }

        setCollectionTooBigError(false);

        let identifiers = []

        identifiersArray.forEach((item) => {
            const firstSpace = item.indexOf(" ");

            let amount = item.substring(0, item.indexOf(' '));
            let cardName = item.substring(item.indexOf(' ') + 1);

            if (firstSpace === -1){
                amount = 1;
                cardName = item;
            } else {
                const amountStr = item.substring(0, firstSpace).trim();
                const parsedAmount = parseInt(amountStr, 10);

                if (isNaN(parsedAmount) || parsedAmount < 1) {
                    // treating an invalid number as the card name
                    amount = 1;
                    cardName = item;
                } else {
                    amount = parsedAmount;
                    cardName = item.substring(firstSpace + 1).trim();
                }
            }
            for(let i = 1; i <= amount; i++){
                identifiers.push({name: cardName})
            }
            
        })
        
        const cardSearchDTO = { 
            deckId,
            identifiers
        }

        const response = await api.post('/decks/addCollection', cardSearchDTO)

        if (response.status === 200) {
            const res = await api.get(`/decks?deckId=${deckId}`);
            setCardList(res.data);
        }

        setCollectionList('');
    }

    const handleChange = (e) => {
        setCollectionList(e.target.value)
    }

    function DeleteConfirmationModal({ card, onCancel, onConfirm }) {
        return (
            <div className="modal-overlay">
                <div className="modal-content">
                    <h2>Confirm Deletion</h2>
                    <p>Are you sure you want to delete <strong>{card.name}</strong> from this deck?</p>
                    <div className="modal-buttons">
                        <button className="delete-button" onClick={() => onConfirm(card)}>Delete</button>
                        <button className="cancel-button" onClick={onCancel}>Cancel</button>
                    </div>
                </div>
            </div>
        );
    }

    const previewCard = previewCardId
        ? cardList.find(c => c.scryfallId === previewCardId)
        : commander;


    if (deckNotFound) {
        return (
            <div>
                Deck not found
            </div>
        )
    }

    if (loading) {
        return <div>Loading deck...</div>;
    }

    
    return (
        <div>
            {collectionTooBigError && <div className="error">Users may only submit 75 cards at a time.</div>}
            <div className="deck-page">
                <div className="intro">
                    <div className="deck-info">
                        <div className="deck-meta">
                            <h1 className="deckName-row">{deckName}</h1>
                            <h4 className="deckPrice">
                            Total cost: ${Number(deckPrice).toFixed(2)}
                            </h4>
                        </div>
                        <div className="rarity-block">
                            <div>commons: {rarities.get('common')}</div>
                            <div>uncommons: {rarities.get('uncommon')}</div>
                            <div>rares: {rarities.get('rare')}</div>
                            <div>mythics: {rarities.get('mythic')}</div>
                        </div>
                    </div>
                    <div className="commander-art">
                        <img
                        src={commander?.fullArtLink}
                        alt={commander?.name}
                        />
                    </div>
                </div>
                <div className="charts-row">
                    {manaCurve.length > 0 && <BarChart manaValues={manaCurve} />}
                    {cardList.length > 0 && <PieChart groupedCards={groupedCards}/>}
                </div>
                <div className="deck-legality">
                    {duplicatedCardsArray.length > 0 && (
                        <div className="deck-error">
                            <strong>Deck is not legal.</strong>
                            {duplicatedCardsArray.map((item, i) => (
                            <div key={i}>{item}</div>
                            ))}
                        </div>
                    )}
                    {mismatchedArray.length > 0 && (
                        <div className="deck-error">
                            <strong>Deck is not legal due to the card(s) below not being the correct color identity</strong>
                            {mismatchedArray.map((item, i) => (
                            <div key={i}>{item}</div>
                            ))}
                        </div>
                    )}
                </div>
                <div className="content-row">
                    <div className="left-panel">
                        <div className="preview-panel">
                            <div className="preview-inner">
                                <div className="preview-image-wrapper">
                                    {previewCard?.gameChanger && (
                                    <div className="game-changer-label">
                                        GC
                                    </div>
                                    )}

                                    <img
                                    src={previewCard?.imageLink}
                                    alt="Card preview"
                                    />
                                </div>
                            </div>
                        </div>
                        <form className="collection-form">
                            <textarea 
                            value={collectionList}
                            onChange={handleChange}
                            placeholder="Add cards to deck"
                            />
                            <button type="button" onClick={handleAddCollection}>
                            Submit
                            </button>
                        </form>
                    </div>
                    <div className="cards-container">
                        {renderOrder.map((type) => {
                            const cards = groupedCards[type];

                            if (!cards || cards.length === 0) return null;

                            return (
                                <div key={type} className="card-group">
                                    <h4 className="card-group-title">{type}</h4>
                                        {cards.map((card, index) => (
                                            <div
                                                className="card-preview-wrapper"
                                                    onMouseEnter={() => setPreviewCardId(card.scryfallId)}
                                                >
                                                <div key={card.scryfallId} className="card">
                                                    <div className="card-row">
                                                        <span className="card-qty">{card.quantity}</span>

                                                        <span className="card-name">
                                                            {card.name}
                                                        </span>
                                                        <span
                                                        className="card-cost"
                                                        dangerouslySetInnerHTML={{
                                                            __html: replaceTextWithManaSymbols(card.manaCost),
                                                        }}
                                                        />
                                                        {!card.type.includes('Basic Land') && (
                                                        <span className="card-price">
                                                            ${card.price.toFixed(2)}
                                                        </span>
                                                        )}
                                                    </div>
                                                    {confirmingCard === card && (
                                                        <DeleteConfirmationModal
                                                        card={confirmingCard}
                                                        onCancel={cancelDelete}
                                                        onConfirm={deleteFromDeck}
                                                        />
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}