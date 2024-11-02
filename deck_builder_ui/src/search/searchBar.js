import axios from 'axios';
import { useState, useEffect } from 'react';

export function SearchBar(){
    const [searchResults, setSearchResults] = useState([]);
    const [showResults, setShowResults] = useState(false);
    const [searchInput, setSearchInput] = useState('');

    const handleChange = (e) => {
        setSearchInput(e.target.value)
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        let resultsArray = [];
        try{
            console.log({name: searchInput})
            const res =  await axios.post('http://localhost:8080/card/searchByName', {name: searchInput})
            let data = res.data;
            data.forEach(entry => {
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
            </form>

            
            {showResults && cards(searchResults)}
        </div>
    )
}