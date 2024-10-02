import axios from 'axios';

export default async function SearchByName(){

    const searchResults = async () => {
        let response;
        axios.post('http://localhost:8080/card/searchByName', {
                params: {
                    name: 'Prosper, Tome-Bound'
            }
        }); 
        console.log("response in the searchResults function", response)
        return response
    }

  
    const data = await searchResults();
    // console.log(data)
    const [parsedResults] = JSON.parse(data);
    // console.log(parsedResults);
    data.forEach(card => {
        let object = JSON.parse(card)
        return (
            <div>
                {object}
            </div>
        )
    })
    
}