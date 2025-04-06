import axios from 'axios'
import { useState, useEffect } from 'react'
import { replaceTextWithManaSymbols } from '../helperFunctions'
import { isDeckLegal } from '../helperFunctions'

export function SingleDeck() {
    const [cardList, setCardList] = useState('')
    const [isLegal, setIsLegal] = useState('')
    const [duplicatedCardsArray, setDuplicatedCardsArray] = useState([])
    
    useEffect(() => {
        const res = axios.get('http://localhost:8080/decks?deckId=1')
            .then((res) => {
                let data = res.data
                let resultsArray = [];
                data.forEach(entry => {
                    resultsArray.push(entry);
                })
                setCardList(resultsArray);

                setDuplicatedCardsArray(isDeckLegal(resultsArray))
                duplicatedCardsArray.length > 0 ? setIsLegal(false) : setIsLegal(true)
            })


    }, [])
  
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
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }    
}