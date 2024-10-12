import axios from 'axios';
import { useState, useEffect } from 'react';

export function SearchByName(){
    const [searchResults, setSearchResults] = useState([]);
    const [showResults, setShowResults] = useState(false);

    const params = {
        name: "Prosper, Tome-Bound"
    }

    const cardSearch = async () => {
        let resultsArray = [];
        try{
            const res =  await axios.post('http://localhost:8080/card/searchByName', params)
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
    }
  
    useEffect(() => {
        const fetchData = async () => {
            await cardSearch();
            setShowResults(true)
        }
        fetchData();
    }, [])
    
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
            {showResults && cards(searchResults)}
        </div>
    )

}