import { useEffect, useState } from "react"
import api from "../api/axios";

export function Home(){
    //think i'm going to use brainstorm for the name
    const [topTenCommanders, setTopTenCommanders] = useState([]);

    useEffect(() => {
        const getTopTenCommanders = async () => {
            const res = await api.get('/decks/topTen');
            
            const data = res?.data;
            setTopTenCommanders(data);
        }

        getTopTenCommanders();
    }, [])
    
    return (
        <div>Getting started on a home page</div>
    )
}