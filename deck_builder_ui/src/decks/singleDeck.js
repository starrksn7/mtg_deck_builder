import api from '../api/axios';
import { useState, useEffect } from 'react'
import { replaceTextWithManaSymbols, duplicateCardCheck } from '../helperFunctions'
import { useParams } from 'react-router-dom';
import '../App.css';

export function SingleDeck() {
    const { deckId } = useParams();
    const [cardList, setCardList] = useState('');
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
    const [doIdentitiesMatch, setDoIdentitiesMatch] = useState(false);

    console.log(cardList)
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
                setContainsDuplicates(duplicates.length === 0);

                const checkMismatchedIdentities = colorIdentityCheck(resultsArray);
                setMismatchedIdentities(checkMismatchedIdentities);
                setDoIdentitiesMatch(mismatchedIdentities.length === 0);
                
                if (containsDuplicates || doIdentitiesMatch) {
                    setIsLegal(false);
                }

                const grouped = groupCardsByType(resultsArray);
                setGroupedCards(grouped);
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

            if (card.type.includes('Creature')) {
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
        const identifiersArray = collectionList.split(/\r?\n/);

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
                {!isLegal && (
                    <div>
                        <div>Deck is not legal. The cards below are duplicated, but are only permitted to have one per deck.</div>
                        {duplicatedCardsArray.map((item, index) => (
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
                <div>
                    {Object.keys(groupedCards).map((type) => (
                        <div key={type}>
                            <h2>{type}</h2>
                            <div className="card-section">
                                {groupedCards[type].map((card, index) => (
                                    <div key={index} className="card">
                                        <div
                                            onMouseEnter={() => setHoveredCard(card)}
                                            onMouseLeave={() => setHoveredCard(null)}
                                            style={{ position: 'relative', display: 'inline-block' }}
                                        >
                                            {card.name}
                                            {hoveredCard === card && (
                                                <div className="hover-image-preview">
                                                    <img src={card.imageLink} alt={card.name} />
                                                    <button type="submit" onClick={() => handleDelete(card)}>Remove From Deck</button>

                                                </div>
                                            )}
                                        </div>
                                        <div dangerouslySetInnerHTML={{ __html: replaceTextWithManaSymbols(card.manaCost)}}></div>

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
                    ))}
                </div>
            </div>
        );
    }    
}