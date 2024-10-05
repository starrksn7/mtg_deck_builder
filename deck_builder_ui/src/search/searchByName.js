import axios from 'axios';

export default async function SearchByName(){
    const params = {
        name: "Prosper, Tome-Bound"
    }
    const searchResults = async () => {
        axios.post('http://localhost:8080/card/searchByName', params)
        .then((res) => {
            let resultsArray = [];
            let data = res.data;
            // console.log(data)
            data.forEach(entry => {
                entry = entry.replace(/\\|\n/g, (match) => match === '\n' ? ' ' : '');
                console.log("entry after the regex")
                console.log(entry)
                resultsArray.push(JSON.parse(entry));
            })
            console.log(resultsArray)
        }); 
    }
  
    const data = await searchResults();

    data.forEach(card => {
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
    
}