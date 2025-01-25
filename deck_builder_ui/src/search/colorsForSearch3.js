export const RenderColorsForSearch3 = ({setColorIdentity}) => {
    const handleColorChange = (event) => {
        let { value } = event.target;
        setColorIdentity(value);
   }

    return (
        <div>        
            Select The Color Identity
            <label>
                <input type='radio' name="colorSelect" value='b' onChange={handleColorChange}/>
                Black
            </label>
            <label>
                <input type='radio' name="colorSelect" value='u' onChange={handleColorChange}/>
                Blue
            </label>
            <label>
                <input type='radio' name="colorSelect" value='g' onChange={handleColorChange}/>
                Green
            </label>
            <label>
                <input type='radio' name="colorSelect" value='r' onChange={handleColorChange}/>
                Red
            </label>
            <label>
                <input type='radio' name="colorSelect" value='w' onChange={handleColorChange}/>
                White
            </label>
        </div>
    )
}