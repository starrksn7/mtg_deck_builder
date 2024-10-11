import axios from 'axios';
import { useState, useEffect } from 'react';


export function SearchByName(){

    const [searchResults, setSearchResults] = useState();
    const params = {
        name: "Prosper, Tome-Bound"
    }
    const cardSearch = async () => {
        let resultsArray = [];
        await axios.post('http://localhost:8080/card/searchByName', params)
        .then((res) => {
            let data = res.data;
            // console.log(data)
            data.forEach(entry => {
                entry = entry.replace(/\\|\n/g, (match) => match === '\n' ? ' ' : '');
                resultsArray.push(JSON.parse(entry));
            })
        }); 
        setSearchResults(resultsArray);
    }
  
    useEffect(() => {
        if(searchResults) cardSearch();
    }, [searchResults])
    console.log(searchResults)
    return (
        <div>
            {searchResults.length > 0 && searchResults.map((card) => {
                return (
                    <div key={card.image_link}>
                        <div>
                            {card.name}
                        </div>
                        <img href={card.image_link} alt='alt text'/>
                    </div>
                )
            })}
        </div>
    )
}