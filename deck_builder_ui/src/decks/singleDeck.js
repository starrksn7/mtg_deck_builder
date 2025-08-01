import axios from 'axios'
import { useState, useEffect } from 'react'
import { createCardObject, replaceTextWithManaSymbols, isDeckLegal } from '../helperFunctions'
import { useParams } from 'react-router-dom';

export function SingleDeck() {
    const { deckId } = useParams();
    const [cardList, setCardList] = useState('')
    const [isLegal, setIsLegal] = useState('')
    const [duplicatedCardsArray, setDuplicatedCardsArray] = useState([])
    const [showConfirm, setShowConfirm] = useState(false)
    
    useEffect(() => {
        const res = axios.get(`http://localhost:8080/decks?deckId=${deckId}`)
            .then((res) => {
                const data = res.data;
                const resultsArray = [...data];
                setCardList(resultsArray);
    
                const duplicates = isDeckLegal(resultsArray);
                setDuplicatedCardsArray(duplicates);
                setIsLegal(duplicates.length === 0);
            })


    }, [])

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
        setShowConfirm(false)
    }

    const handleDelete = () => {
        setShowConfirm(true)
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
                    {cardList.map((card, index) => (
                        <div key={index}>
                            <div>
                                <img src={card.imageLink} alt={card.name} />
                                <div>{card.name}</div>
                                <div dangerouslySetInnerHTML={{ __html: replaceTextWithManaSymbols(card.manaCost) }}></div>
                                <div>Type: {card.type}</div>
                                <div dangerouslySetInnerHTML={{ __html: replaceTextWithManaSymbols(card.oracleText) }}></div>
                                <button type="submit" onClick={handleDelete}>Remove From Deck</button>

                                {showConfirm && (
                                    <div className="confirmation-dialog">
                                    <p>Are you sure you want to delete {card.name} from this deck?</p>
                                    <button onClick={() => deleteFromDeck(card)}>Delete</button>
                                    <button onClick={cancelDelete}>Cancel</button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }    
}