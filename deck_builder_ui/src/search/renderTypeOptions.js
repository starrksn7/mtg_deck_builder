export const RenderTypeOptions = ({setCardType}) => {

    const handleCardTypeChange = (event) => {
        let { value } = event.target;
        setCardType(value);
   }

    return (
        <div>
             Select The Card Type
            <label>
                <input type='radio' name="cardType" value='artifact' onChange={handleCardTypeChange}/>
                Artifact
            </label>
            <label>
                <input type='radio' name="cardType" value='battle' onChange={handleCardTypeChange}/>
                Battle
            </label>
            <label>
                <input type='radio' name="cardType" value='creature' onChange={handleCardTypeChange}/>
                Creature
            </label>
            <label>
                <input type='radio' name="cardType" value='enchantment' onChange={handleCardTypeChange}/>
                Enchantment
            </label>
            <label>
                <input type='radio' name="cardType" value='instant' onChange={handleCardTypeChange}/>
                Instant
            </label>
            <label>
                <input type='radio' name="cardType" value='land' onChange={handleCardTypeChange}/>
                Land
            </label>
            <label>
                <input type='radio' name="cardType" value='planeswalker' onChange={handleCardTypeChange}/>
                Planeswalker
            </label>
            <label>
                <input type='radio' name="searchType" value='sorcery' onChange={handleCardTypeChange}/>
                Sorcery
            </label>
        </div>
    )
}