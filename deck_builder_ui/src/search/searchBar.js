import axios from 'axios';
import { useState, useEffect } from 'react';

export function SearchBar(){
    const [searchResults, setSearchResults] = useState([]);
    const [showResults, setShowResults] = useState(false);
    const [searchInput, setSearchInput] = useState('');
    const [searchType, setSearchType] = useState('');

    const handleChange = (e) => {
        setSearchInput(e.target.value)
    }
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        let resultsArray = [];
        try{
            console.log({name: searchInput})
            let searchUrl = '';
            
            switch(searchType) {
                case (1):
                    searchUrl = 'http://localhost:8080/card/searchByName';
                    break;
                case (2):
                    searchUrl = 'http://localhost:8080/card//searchByIdentityAndType'
                    break;
                case (3):
                    searchUrl = 'http://localhost:8080/card/searchByColorAndCost'
                    break;
                case (4):
                    searchUrl = 'http://localhost:8080/card/searchByKeyword'
                    break;
                case (5):
                    searchUrl = 'http://localhost:8080/card/searchByColors'
                    break;
                case (6):
                    searchUrl = 'http://localhost:8080/card/searchByColorIdentity'
                    break;
                default:
                    searchUrl = ''
            }
            const res =  await axios.post(searchUrl, {name: searchInput})
            let data = res.data;
            data.forEach(entry => {
                //TODO: test if this regex is needed.  I'm running something similar in the api to remove line breaks and double quotes
                entry = entry.replace(/\\|\n/g, (match) => match === '\n' ? ' ' : '');
                resultsArray.push(JSON.parse(entry));
            })
            console.log("Results array", resultsArray)           
        } catch (error){
            console.log("Error fetching data: ", error)
        }
        setSearchResults(resultsArray);
        setShowResults(true);
    }

   const handleSearchChange = (event) => {
    console.log(event.target)
        let { value } = event.target
        setSearchType(value)
   }
console.log("searchType = ", searchType)
    const cards = (searchResults) => {
        if(searchResults.length) {
            return searchResults.map((card, index) => (
                    <div key={index}>
                        <div>{card.name}</div>
                        <img src={card.image_link} alt='alternate text'/>
                    </div>
            ))
        }
        return null
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Search here"
                    onChange={handleChange}
                    value={searchInput}
                />
                <button type="submit">Search</button>
                <label>
                    <input type='radio' checked="checked" name="searchType" value='1' onChange={handleSearchChange}/>
                    Search By Name
                </label>
                <label>
                    <input type='radio' name="searchType" value='2' onChange={handleSearchChange}/>
                    Search By Identity and Type
                </label>
                <label>
                    <input type='radio' name="searchType" value='3' onChange={handleSearchChange}/>
                    Search By Color and Cost
                </label>
                <label>
                    <input type='radio' name="searchType" value='4' onChange={handleSearchChange}/>
                    Search By Keyword
                </label>
                <label>
                    <input type='radio' name="searchType" value='5' onChange={handleSearchChange}/>
                    Search By Colors
                </label>
                <label>
                    <input type='radio' name="searchType" value='6' onChange={handleSearchChange}/>
                    Search By Color Identity
                </label>
            </form>

            
            {showResults && cards(searchResults)}
        </div>
    )
}