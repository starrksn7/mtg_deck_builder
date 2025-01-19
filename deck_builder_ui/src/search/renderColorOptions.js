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
                Black
            </label>
            <label>
                <input type='radio' name="identitySelect" value='blue' onChange={handleColorChange}/>
                Blue
            </label>
            <label>
                <input type='radio' name="identitySelect" value='green' onChange={handleColorChange}/>
                Green
            </label>
            <label>
                <input type='radio' name="identitySelect" value='red' onChange={handleColorChange}/>
                Red
            </label>
            <label>
                <input type='radio' name="identitySelect" value='white' onChange={handleColorChange}/>
                White
            </label>
            <label>
                <input type='radio' name="identitySelect" value='azorius' onChange={handleColorChange}/>
                Azorius
            </label>
            <label>
                <input type='radio' name="identitySelect" value='boros' onChange={handleColorChange}/>
                Boros
            </label>
            <label>
                <input type='radio' name="identitySelect" value='dimir' onChange={handleColorChange}/>
                Dimir
            </label>
            <label>
                <input type='radio' name="identitySelect" value='golgari' onChange={handleColorChange}/>
                Golgari
            </label>
            <label>
                <input type='radio' name="identitySelect" value='gruul' onChange={handleColorChange}/>
                Gruul
            </label>
            <label>
                <input type='radio' name="identitySelect" value='izzet' onChange={handleColorChange}/>
                Izzet
            </label>
            <label>
                <input type='radio' name="identitySelect" value='orzhov' onChange={handleColorChange}/>
                Orzhov
            </label>
            <label>
                <input type='radio' name="identitySelect" value='rakdos' onChange={handleColorChange}/>
                Rakdos
            </label>
            <label>
                <input type='radio' name="identitySelect" value='selesnya' onChange={handleColorChange}/>
                Selesnya
            </label>
            <label>
                <input type='radio' name="sidentitySelect" value='simic' onChange={handleColorChange}/>
                Simic
            </label>
            <label>
                <input type='radio' name="identitySelect" value='abzan' onChange={handleColorChange}/>
                Abzan
            </label>
            <label>
                <input type='radio' name="identitySelect" value='bant' onChange={handleColorChange}/>
                Bant
            </label>
            <label>
                <input type='radio' name="identitySelect" value='esper' onChange={handleColorChange}/>
                Esper
            </label>
            <label>
                <input type='radio' name="identitySelect" value='grixis' onChange={handleColorChange}/>
                Grixis
            </label>
            <label>
                <input type='radio' name="identitySelect" value='jeskai' onChange={handleColorChange}/>
                Jeskai
            </label>
            <label>
                <input type='radio' name="identitySelect" value='jund' onChange={handleColorChange}/>
                Jund
            </label>
            <label>
                <input type='radio' name="identitySelect" value='mardu' onChange={handleColorChange}/>
                Mardu
            </label>
            <label>
                <input type='radio' name="identitySelect" value='naya' onChange={handleColorChange}/>
                Naya
            </label>
            <label>
                <input type='radio' name="identitySelect" value='sultai' onChange={handleColorChange}/>
                Sultai
            </label>
            <label>
                <input type='radio' name="identitySelect" value='temur' onChange={handleColorChange}/>
                Temur
            </label>
            <label>
                <input type='radio' name="identitySelect" value='glint' onChange={handleColorChange}/>
                Glint
            </label>
            <label>
                <input type='radio' name="identitySelect" value='dune' onChange={handleColorChange}/>
                Dune
            </label>
            <label>
                <input type='radio' name="identitySelect" value='ink' onChange={handleColorChange}/>
                Ink
            </label>
            <label>
                <input type='radio' name="identitySelect" value='witch' onChange={handleColorChange}/>
                Witch
            </label>
            <label>
                <input type='radio' name="identitySelect" value='yore' onChange={handleColorChange}/>
                Yore
            </label>
            <label>
                <input type='radio' name="identitySelect" value='wurbg' onChange={handleColorChange}/>
                WUBRG
            </label>
            <label>
                <input type='radio' name="identitySelect" value='colorless' onChange={handleColorChange}/>
                Colorless
            </label>
        </div>
    )
}