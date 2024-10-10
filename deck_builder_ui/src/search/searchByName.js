import axios from 'axios';
import { useState, useEffect } from 'react';


export async function SearchByName(){

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
        return resultsArray;
    }
  
    const data = await cardSearch();
    console.log("data =")
    console.log(data)
    useEffect(() => {
        if(data) setSearchResults(data);
    }, [data])

    if(searchResults) {
        console.log("searchResults =")
        console.log(searchResults)
        searchResults.map(card => {
            console.log(card.name)
            return (
                <div>
                    <div>
                        {card.name}
                    </div>
                    <div>
                        {card.mana_cost}
                    </div>
                    <div>
                        <img href={card.image_link} alt="small pic for searched card"/>
                    </div>
                </div>
            )
        })
    } else {
        return <div>What the hell happened here</div>
    }
}