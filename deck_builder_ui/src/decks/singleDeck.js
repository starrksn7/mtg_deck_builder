import api from '../api/axios';
import { useState, useEffect } from 'react'
import { replaceTextWithManaSymbols, duplicateCardCheck, colorIdentityCheck, calculateManaCurve } from '../helperFunctions'
import { useParams } from 'react-router-dom';
import '../App.css';
import { BarChart } from '../charts/barChart';

export function SingleDeck() {
    const { deckId } = useParams();
    const [cardList, setCardList] = useState([]);
    const [isLegal, setIsLegal] = useState('');
    const [duplicatedCardsArray, setDuplicatedCardsArray] = useState([]);
    const [showConfirm, setShowConfirm] = useState(false);
    const [groupedCards, setGroupedCards] = useState({});
    const [hoveredCard, setHoveredCard] = useState(null);
    const [confirmingCard, setConfirmingCard] = useState(null);
    const [deckNotFound, setDeckNotFound] = useState(false);
    const [collectionList, setCollectionList] = useState('');
    const [containsDuplicates, setContainsDuplicates] = useState(false);
    const [mismatchedIdentities, setMismatchedIdentities] = useState('')
    const [mismatchedArray, setMismatchedArray] = useState([]);
    const [doIdentitiesMatch, setDoIdentitiesMatch] = useState(false);
    const [manaCurve, setManaCurve] = useState([]);

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

                const curve = calculateManaCurve(cardList)
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

            if (card.name === card.deckCommander){
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
                groups[typeCategory] = [];
            }
            groups[typeCategory].push(card);
        });

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

        const identifiers = identifiersArray.map((item) => ({ name: item }))
        
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

                {!mismatchedIdentities && (
                    <div>
                    <div>
                        Deck is not legal. The cards below do not match your commander's color identity.
                    </div>
                    {mismatchedArray.map((item, index) => (
                        <div key={index}>{item}</div>
                    ))}
                    </div>
                )}

                <form>
                    <textarea 
                    value={collectionList}
                    onChange={handleChange}
                    placeholder="Add cards to deck"
                    />
                    <button type="button" onClick={handleAddCollection}>
                    Submit
                    </button>
                </form>
                
                {manaCurve.length > 0 && <BarChart manaValues={manaCurve} />}

                <div>
                    {renderOrder.map((type) => {
                        const cards = groupedCards[type];
                        if (!cards || cards.length === 0) return null; // skip missing/empty groups

                        return (
                            <div key={type}>
                                <h2>{type}</h2>
                                <div className="card-section">
                                    {cards.map((card, index) => (
                                        <div key={index} className="card">
                                            <div
                                            onMouseEnter={() => setHoveredCard(card)}
                                            onMouseLeave={() => setHoveredCard(null)}
                                            style={{ position: 'relative', display: 'inline-block' }}
                                            >   <div>
                                                    {card.quantity}
                                                </div>
                                                <div>
                                                {card.name}
                                                </div>
                                                {hoveredCard === card && (
                                                    <div className="hover-image-preview">
                                                    <img src={card.imageLink} alt={card.name} />
                                                    <button
                                                        type="submit"
                                                        onClick={() => handleDelete(card)}
                                                    >
                                                        Remove From Deck
                                                    </button>
                                                    </div>
                                                )}
                                            </div>

                                            <div
                                            dangerouslySetInnerHTML={{
                                                __html: replaceTextWithManaSymbols(card.manaCost),
                                            }}
                                            />

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
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }
 
}