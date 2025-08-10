import axios from 'axios'
import { useState, useEffect } from 'react'
import { replaceTextWithManaSymbols, isDeckLegal } from '../helperFunctions'
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

    useEffect(() => {
        axios.get(`http://localhost:8080/decks?deckId=${deckId}`)
            .then((res) => {
                const data = res.data;
                const resultsArray = [...data];
                setCardList(resultsArray);
    
                const duplicates = isDeckLegal(resultsArray);
                setDuplicatedCardsArray(duplicates);
                setIsLegal(duplicates.length === 0);

                const grouped = groupCardsByType(resultsArray);
                setGroupedCards(grouped);
            })
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
        const res = await axios.delete('http://localhost:8080/decks/remove', { data: {
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
                                            <div className="confirmation-dialog">
                                                <p>Are you sure you want to delete {card.name} from this deck?</p>
                                                <button onClick={() => deleteFromDeck(card)}>Delete</button>
                                                <button onClick={cancelDelete}>Cancel</button>
                                            </div>
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