import axios from 'axios';

export default function SearchByName(){

    const searchResults = async () => {
        await axios({
            method: 'GET',
            url: 'card/searchByName',
            headers: {},
            data: {
                name: 'Prosper, Tome-Bound'
            }
        })
    }
    console.log("searchResults")
    console.log(searchResults)
    const data = searchResults.data;
    console.log(data);
    data.forEach(card => {
        return (
            <div>
                {card}
            </div>
        )
    })
    
}