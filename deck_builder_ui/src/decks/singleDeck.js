import axios from 'axios'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

export function SingleDeck() {
    const [cardList, setCardList] = useState('')
    
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
        return cardList.map((card, index) => {
            return (
                <div key={index}>
                    <div>
                        <img src={card.image_link} alt='alternate text'/>
                        <div>{card.name}</div>
                        <div dangerouslySetInnerHTML={{ __html: replaceTextWithManaSymbols(card.mana_cost) }} ></div>
                        <div>Type: {card.type}</div>
                        <div dangerouslySetInnerHTML={{ __html: replaceTextWithManaSymbols(card.oracle_text) }} ></div>
                        {/* <form onSubmit={addToDeck}> */}
                            {/* <button type="submit" onClick={() => addToDeck(card)}>Add to Deck</button> */}
                        {/* </form> */}
                    </div>  
                </div>
            )
        })
    }
}