import { replaceTextWithManaSymbols } from "../helperFunctions";

export const RenderColorOptions = ({setColorIdentity}) => {

    const handleColorChange = (event) => {
        let { value } = event.target;
        setColorIdentity(value);
   }

    return (
        <div>        
            Select The Color Identity
            <label>
                <input type='radio' name="identitySelect" value='black' onChange={handleColorChange}/>
                <span dangerouslySetInnerHTML={{ __html: replaceTextWithManaSymbols("{B}") }} />
            </label>
            <label>
                <input type='radio' name="identitySelect" value='blue' onChange={handleColorChange}/>
                <span dangerouslySetInnerHTML={{ __html: replaceTextWithManaSymbols("{U}") }} />
            </label>
            <label>
                <input type='radio' name="identitySelect" value='green' onChange={handleColorChange}/>
                <span dangerouslySetInnerHTML={{ __html: replaceTextWithManaSymbols("{G}") }} />
            </label>
            <label>
                <input type='radio' name="identitySelect" value='red' onChange={handleColorChange}/>
                <span dangerouslySetInnerHTML={{ __html: replaceTextWithManaSymbols("{R}") }} />
            </label>
            <label>
                <input type='radio' name="identitySelect" value='white' onChange={handleColorChange}/>
                <span dangerouslySetInnerHTML={{ __html: replaceTextWithManaSymbols("{W}") }} />
            </label>
            <label>
                <input type='radio' name="identitySelect" value='c' onChange={handleColorChange}/>
                <span dangerouslySetInnerHTML={{ __html: replaceTextWithManaSymbols("{C}") }} />
            </label>
            <label>
                <input type='radio' name="identitySelect" value='azorius' onChange={handleColorChange}/>
                <span dangerouslySetInnerHTML={{ __html: replaceTextWithManaSymbols("{B}{W}") }} />
            </label>
            <label>
                <input type='radio' name="identitySelect" value='boros' onChange={handleColorChange}/>
                <span dangerouslySetInnerHTML={{ __html: replaceTextWithManaSymbols("{R}{W}") }} />
            </label>
            <label>
                <input type='radio' name="identitySelect" value='dimir' onChange={handleColorChange}/>
                <span dangerouslySetInnerHTML={{ __html: replaceTextWithManaSymbols("{U}{B}") }} />
            </label>
            <label>
                <input type='radio' name="identitySelect" value='golgari' onChange={handleColorChange}/>
                <span dangerouslySetInnerHTML={{ __html: replaceTextWithManaSymbols("{G}{B}") }} />
            </label>
            <label>
                <input type='radio' name="identitySelect" value='gruul' onChange={handleColorChange}/>
                <span dangerouslySetInnerHTML={{ __html: replaceTextWithManaSymbols("{R}{G}") }} />
            </label>
            <label>
                <input type='radio' name="identitySelect" value='izzet' onChange={handleColorChange}/>
                <span dangerouslySetInnerHTML={{ __html: replaceTextWithManaSymbols("{U}{R}") }} />
            </label>
            <label>
                <input type='radio' name="identitySelect" value='orzhov' onChange={handleColorChange}/>
                <span dangerouslySetInnerHTML={{ __html: replaceTextWithManaSymbols("{W}{B}") }} />
            </label>
            <label>
                <input type='radio' name="identitySelect" value='rakdos' onChange={handleColorChange}/>
                <span dangerouslySetInnerHTML={{ __html: replaceTextWithManaSymbols("{B}{R}") }} />
            </label>
            <label>
                <input type='radio' name="identitySelect" value='selesnya' onChange={handleColorChange}/>
                <span dangerouslySetInnerHTML={{ __html: replaceTextWithManaSymbols("{G}{W}") }} />
            </label>
            <label>
                <input type='radio' name="sidentitySelect" value='simic' onChange={handleColorChange}/>
                <span dangerouslySetInnerHTML={{ __html: replaceTextWithManaSymbols("{U}{G}") }} />
            </label>
            <label>
                <input type='radio' name="identitySelect" value='abzan' onChange={handleColorChange}/>
                <span dangerouslySetInnerHTML={{ __html: replaceTextWithManaSymbols("{W}{B}{G}") }} />
            </label>
            <label>
                <input type='radio' name="identitySelect" value='bant' onChange={handleColorChange}/>
                <span dangerouslySetInnerHTML={{ __html: replaceTextWithManaSymbols("{U}{G}{W}") }} />
            </label>
            <label>
                <input type='radio' name="identitySelect" value='esper' onChange={handleColorChange}/>
                <span dangerouslySetInnerHTML={{ __html: replaceTextWithManaSymbols("{U}{B}{W}") }} />
            </label>
            <label>
                <input type='radio' name="identitySelect" value='grixis' onChange={handleColorChange}/>
                <span dangerouslySetInnerHTML={{ __html: replaceTextWithManaSymbols("{U}{B}{R}") }} />
            </label>
            <label>
                <input type='radio' name="identitySelect" value='jeskai' onChange={handleColorChange}/>
                <span dangerouslySetInnerHTML={{ __html: replaceTextWithManaSymbols("{W}{U}{R}") }} />
            </label>
            <label>
                <input type='radio' name="identitySelect" value='jund' onChange={handleColorChange}/>
                <span dangerouslySetInnerHTML={{ __html: replaceTextWithManaSymbols("{B}{R}{G}") }} />
            </label>
            <label>
                <input type='radio' name="identitySelect" value='mardu' onChange={handleColorChange}/>
                <span dangerouslySetInnerHTML={{ __html: replaceTextWithManaSymbols("{W}{B}{R}") }} />
            </label>
            <label>
                <input type='radio' name="identitySelect" value='naya' onChange={handleColorChange}/>
                <span dangerouslySetInnerHTML={{ __html: replaceTextWithManaSymbols("{W}{R}{G}") }} />
            </label>
            <label>
                <input type='radio' name="identitySelect" value='sultai' onChange={handleColorChange}/>
                <span dangerouslySetInnerHTML={{ __html: replaceTextWithManaSymbols("{U}{B}{G}") }} />
            </label>
            <label>
                <input type='radio' name="identitySelect" value='temur' onChange={handleColorChange}/>
                <span dangerouslySetInnerHTML={{ __html: replaceTextWithManaSymbols("{U}{R}{G}") }} />
            </label>
            <label>
                <input type='radio' name="identitySelect" value='glint' onChange={handleColorChange}/>
                <span dangerouslySetInnerHTML={{ __html: replaceTextWithManaSymbols("{U}{R}{G}{B}") }} />
            </label>
            <label>
                <input type='radio' name="identitySelect" value='dune' onChange={handleColorChange}/>
                <span dangerouslySetInnerHTML={{ __html: replaceTextWithManaSymbols("{W}{B}{R}{G}") }} />
            </label>
            <label>
                <input type='radio' name="identitySelect" value='ink' onChange={handleColorChange}/>
                <span dangerouslySetInnerHTML={{ __html: replaceTextWithManaSymbols("{W}{U}{R}{G}") }} />
            </label>
            <label>
                <input type='radio' name="identitySelect" value='witch' onChange={handleColorChange}/>
                <span dangerouslySetInnerHTML={{ __html: replaceTextWithManaSymbols("{W}{U}{B}{G}") }} />
            </label>
            <label>
                <input type='radio' name="identitySelect" value='yore' onChange={handleColorChange}/>
                <span dangerouslySetInnerHTML={{ __html: replaceTextWithManaSymbols("{W}{U}{R}{B}") }} />
            </label>
            <label>
                <input type='radio' name="identitySelect" value='wurbg' onChange={handleColorChange}/>
                <span dangerouslySetInnerHTML={{ __html: replaceTextWithManaSymbols("{W}{U}{B}{R}{G}") }} />
            </label>
        </div>
    )
}