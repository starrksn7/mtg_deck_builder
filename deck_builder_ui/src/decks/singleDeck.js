import api from '../api/axios';
import { useState, useEffect } from 'react'
import { replaceTextWithManaSymbols, duplicateCardCheck, colorIdentityCheck, calculateManaCurve } from '../helperFunctions'
import { useParams } from 'react-router-dom';
import '../App.css';
import { BarChart } from '../charts/barChart';
import { PieChart } from '../charts/pieChart';

export function SingleDeck() {
    const { deckId } = useParams();
    const [cardList, setCardList] = useState([]);
    const [isLegal, setIsLegal] = useState('');
    const [duplicatedCardsArray, setDuplicatedCardsArray] = useState([]);
    const [showConfirm, setShowConfirm] = useState(false);
    const [groupedCards, setGroupedCards] = useState({});
    const [hoveredCardId, setHoveredCardId] = useState(null);
    const [confirmingCard, setConfirmingCard] = useState(null);
    const [deckNotFound, setDeckNotFound] = useState(false);
    const [collectionList, setCollectionList] = useState('');
    const [containsDuplicates, setContainsDuplicates] = useState(false);
    const [mismatchedIdentities, setMismatchedIdentities] = useState('');
    const [mismatchedArray, setMismatchedArray] = useState([]);
    const [doIdentitiesMatch, setDoIdentitiesMatch] = useState(false);
    const [manaCurve, setManaCurve] = useState([]);
    const [collectionTooBigError, setCollectionTooBigError] = useState(false);
    const [deckName, setDeckName] = useState('');
    const [hoverPlacement, setHoverPlacement] = useState('right')

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
                const res = await api.get(`/decks?deckId=${deckId}`)
                const data = res.data;
                const resultsArray = [...data];
                setCardList(resultsArray);
                setDeckNotFound(false);
                setDeckName(resultsArray[0].deckName)

                const duplicates = duplicateCardCheck(resultsArray);
                setDuplicatedCardsArray(duplicates);
                const noDuplicates = duplicates.length === 0;
                setContainsDuplicates(noDuplicates);

                const checkMismatchedIdentities = colorIdentityCheck(resultsArray);
                setMismatchedArray(checkMismatchedIdentities);
                const identitiesMatch = checkMismatchedIdentities.length === 0;
                setDoIdentitiesMatch(identitiesMatch);

                setIsLegal(noDuplicates && identitiesMatch);

                const grouped = groupCardsByType(resultsArray);
                setGroupedCards(grouped);

                const curve = calculateManaCurve(resultsArray)
                setManaCurve(curve)
            } catch (e) {
                console.log("Deck not found", e)
                setDeckNotFound(true);
            }
        }

        fetchDeck();

    }, [deckId])
    
    const groupCardsByType = (cards) => {
        const groups = {};

        cards.forEach(card => {
            let typeCategory = '';

            if (card.name === card.deckCommander) {
                typeCategory = 'Commander';
            } else if (card.type.includes('Creature')) {
                typeCategory = 'Creatures';
            } else if (card.type.includes('Instant')) {
                typeCategory = 'Instants';
            } else if (card.type.includes('Sorcery')) {
                typeCategory = 'Sorceries';
            } else if (card.type.includes('Artifact')) {
                typeCategory = 'Artifacts';
            } else if (card.type.includes('Enchantment')) {
                typeCategory = 'Enchantments';
            } else if (card.type.includes('Planeswalker')) {
                typeCategory = 'Planeswalkers';
            } else if (card.type.includes('Land')) {
                typeCategory = 'Lands';
            } else {
                typeCategory = 'Other';
            }

            if (!groups[typeCategory]) {
                groups[typeCategory] = {};
            }

            const key = card.scryfallId;

            if (!groups[typeCategory][key]) {
                groups[typeCategory][key] = {
                    ...card,
                };
            } else {
                groups[typeCategory][key].quantity += card.quantity;
            }
        });

        for (const type in groups) {
            groups[type] = Object.values(groups[type]);
        }

        return groups;
    };

    const deleteFromDeck = async (card) => {
        const res = await api.delete('/decks/remove', { data: {
            deckId: deckId, 
            cardDto: {
                scryfallId: card.scryfallId
                }
            }
        })
        if(res) window.location.reload()
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

        if (response.status === 200){
            window.location.reload();
        }
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

    if (deckNotFound) {
        return (
            <div>
                Deck not found
            </div>
        )
    }

    if (cardList) {
        return (
            <div>
                {!containsDuplicates && (
                    <div>
                    <div>
                        Deck is not legal. The cards below are duplicated, but are only permitted to have one per deck.
                    </div>
                    {duplicatedCardsArray.map((item, index) => (
                        <div key={index}>{item}</div>
                    ))}
                    </div>
                )}

                {mismatchedIdentities.length > 0 && (
                    <div>
                        <div>
                            Deck is not legal. The cards below do not match your commander's color identity.
                        </div>
                        {mismatchedArray.map((item, index) => (
                            <div key={index}>{item}</div>
                        ))}
                    </div>
                )}
                {collectionTooBigError && <div className="error">Users may only submit 75 cards at a time.</div>}
                <div className="deck-page">
                    <h1 className="deckName-row">{deckName}</h1>
                    <div className="charts-row">
                        {manaCurve.length > 0 && <BarChart manaValues={manaCurve} />}
                        {cardList.length > 0 && <PieChart groupedCards={groupedCards}/>}
                    </div>
                    <div className="content-row">
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
                        <div className="cards-container">
                            {renderOrder.map((type) => {
                                const cards = groupedCards[type];

                                if (!cards || cards.length === 0) return null;

                                return (
                                    <div key={type} className="card-group">
                                        <h4 className="card-group-title">{type}</h4>
                                            {cards.map((card, index) => (
                                                <div key={card.scryfallId} className="card"
                                                    onMouseEnter={(e) => {
                                                        const rect = e.currentTarget
                                                            .querySelector('.card-name')
                                                            .getBoundingClientRect();
                                                        const previewHeight = 300;
                                                        const spaceBelow = window.innerHeight - rect.bottom;
                                                        const spaceAbove = rect.top;

                                                        if (spaceBelow < previewHeight && spaceAbove > previewHeight) {
                                                            setHoverPlacement('above')
                                                        } else {
                                                            setHoverPlacement('center')
                                                        }

                                                        setHoveredCardId(card.scryfallId)

                                                    }}
                                                    onMouseLeave={() => setHoveredCardId(null)}
                                                >
                                                    <div className="card-row">
                                                        <span className="card-qty">{card.quantity}</span>

                                                        <span className="card-name">
                                                            {card.name}

                                                            {hoveredCardId === card.scryfallId && (
                                                                <div className={`hover-image-preview ${hoverPlacement}`}>
                                                                <img src={card.imageLink} alt={card.name} />
                                                                <button type="button" onClick={() => handleDelete(card)}>
                                                                    Remove From Deck
                                                                </button>
                                                                </div>
                                                            )}
                                                        </span>
                                                        <span
                                                        className="card-cost"
                                                        dangerouslySetInnerHTML={{
                                                            __html: replaceTextWithManaSymbols(card.manaCost),
                                                        }}
                                                        />
                                                    </div>

                                                    {confirmingCard === card && (
                                                        <DeleteConfirmationModal
                                                        card={confirmingCard}
                                                        onCancel={cancelDelete}
                                                        onConfirm={deleteFromDeck}
                                                        />
                                                    )}
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
 
}