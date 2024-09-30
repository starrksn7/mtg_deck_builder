import axios from 'axios';

export default function SearchByName(){

    const searchResults = async () => {
        let response;
        await axios({
            method: 'post',
            url: 'http://localhost:8080/card/searchByName',
            params: {
                name: 'Prosper, Tome-Bound'
            }
        });
        
        return response
    }

  
    const { data } = searchResults();

    console.log(data);
    data.forEach(card => {
        return (
            <div>
                {card}
            </div>
        )
    })
    
}