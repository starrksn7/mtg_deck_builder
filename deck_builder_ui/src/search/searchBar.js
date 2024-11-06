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

    // useEffect(() => {
    //     const fetchData = async () => {
    //         await cardSearch();
    //         setShowResults(true)
    //     }
    //     fetchData();
    // }, [])

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
                    <input type='radio' value='searchByName' checked={searchType === 1} />
                    Search By Name
                </label>
                <label>
                    <input type='radio' value='searchByIdentityAndType' checked={searchType === 2} />
                    Search By Identity and Type
                </label>
                <label>
                    <input type='radio' value='searchByColorAndCost' checked={searchType === 3} />
                    Search By Color and Cost
                </label>
                <label>
                    <input type='radio' value='searchByKeyword' checked={searchType === 4} />
                    Search By Keyword
                </label>
                <label>
                    <input type='radio' value='searchByColors' checked={searchType === 5} />
                    Search By Colors
                </label>
                <label>
                    <input type='radio' value='searchByColorIdentity' checked={searchType === 6} />
                    Search By Color Identity
                </label>
            </form>

            
            {showResults && cards(searchResults)}
        </div>
    )
}