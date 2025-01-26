export const RenderColorsForSearch3 = ({setColorIdentity}) => {

    //do I need a use effect here to watch for the selection of these radio buttons and then 
    //append new letters to it each time one is selected? Should I switch these to checkboxes?
    
    const handleColorChange = (event) => {
        let { value } = event.target;
        setColorIdentity(value);
   }

    return (
        <div>        
            Select The Color Identity
            <label>
                <input type='radio' name="colorSelectBlack" value='b' onChange={handleColorChange}/>
                Black
            </label>
            <label>
                <input type='radio' name="colorSelectBlue" value='u' onChange={handleColorChange}/>
                Blue
            </label>
            <label>
                <input type='radio' name="colorSelectGreen" value='g' onChange={handleColorChange}/>
                Green
            </label>
            <label>
                <input type='radio' name="colorSelectRed" value='r' onChange={handleColorChange}/>
                Red
            </label>
            <label>
                <input type='radio' name="colorSelectWhite" value='w' onChange={handleColorChange}/>
                White
            </label>
            <label>
                <input type='radio' name="colorSelectColorless" value='c' onChange={handleColorChange}/>
                Colorless
            </label>
        </div>
    )
}