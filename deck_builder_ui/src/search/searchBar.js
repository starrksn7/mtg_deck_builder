import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

export function SearchBar(){
    const [searchInput, setSearchInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setSearchInput(e.target.value)
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        let resultsArray = [];
        try{
            const res = await api.get(`/card/search?searchTerm=${searchInput}`);
 
            const data = res.data;
            data.forEach(entry => {
                resultsArray.push(JSON.parse(entry));
            })

            if (resultsArray.length === 1){
                //need to build out a page for this
                //and figure out what it's contents should be
                navigate(`cards/${data[0].scryfallId}`);
            } else {
                //need to build out a page for this
                navigate('cards/search', {
                    state: { resultsArray }
                });
            }

        } catch (error){
            console.log("Error fetching data: ", error)
        }

        setIsLoading(false);
    }
   
    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Search for cards..."
                    onChange={handleChange}
                    value={searchInput}
                />
                <button type="submit">Search</button>
            </form>
        </div>
    )
}