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
            })
    }, [])


    if(cardList) {
        setDuplicatedCardsArray(isDeckLegal(cardList))
        duplicatedCardsArray.length > 0 ? setIsLegal(false) : setIsLegal(true)

        //need to figure out a way to list what is illegal about the deck if isLegal isn't true
        if (!isLegal) {
            return (
            <div>
                <div>Deck is not legal. Please check your deck contents.</div>
                {duplicatedCardsArray.map((item, index) => (
                    <div key={index}>{item}</div>
                ))}
            </div>

        );
        }

        return cardList.map((card, index) => {
            return (
                <div key={index}>
                    <div>
                        <img src={card.imageLink} alt='alternate text'/>
                        <div>{card.name}</div>
                        <div dangerouslySetInnerHTML={{ __html: replaceTextWithManaSymbols(card.manaCost) }} ></div>
                        <div>Type: {card.type}</div>
                        <div dangerouslySetInnerHTML={{ __html: replaceTextWithManaSymbols(card.oracleText) }} ></div>
                        {/* <form onSubmit={addToDeck}> */}
                            {/* <button type="submit" onClick={() => addToDeck(card)}>Add to Deck</button> */}
                        {/* </form> */}
                    </div>  
                </div>
            )
        })
    }
}