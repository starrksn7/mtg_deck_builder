import axios from 'axios';
import { useState, useEffect } from 'react';

export function SearchByName(){
    const [searchResults, setSearchResults] = useState([]);
    const [showResults, setShowResults] = useState(false);
    const [searchInput, setSearchInput] = useState('');

    // const params = {
    //     name: "Prosper, Tome-Bound"
    // }

    const handleChange = (e) => {
        console.log("handle change went off")
        setSearchInput(e.target.value)
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('handle submit fired')
        let resultsArray = [];
        try{
            const res =  await axios.post('http://localhost:8080/card/searchByName', {name: searchInput})
            let data = res.data;
            data.forEach(entry => {
                entry = entry.replace(/\\|\n/g, (match) => match === '\n' ? ' ' : '');
            })
            const uniqueNamedEntries = data.reduce((accumulator, current) => {
                const names = new Set(accumulator.map(item => item.name));
                if (!names.has(current.name)) {
                  accumulator.push(current);
                }
                return accumulator;
              }, []);

            setSearchResults(data);
            console.log("Results array", resultsArray)           
        } catch (error){
            console.log("Error fetching data: ", error)
        }

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
            </form>

            <button type="submit">Search</button>
            {showResults && cards(searchResults)}
        </div>
    )

}