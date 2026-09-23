import { useEffect, useState } from "react";
import api from "../api/axios";

export function Home() {
    const [topTenCommanders, setTopTenCommanders] = useState([]);

    useEffect(() => {
        const getTopTenCommanders = async () => {
            const res = await api.get("/decks/topTen");
            const data = res?.data;

            setTopTenCommanders(data);
        };

        getTopTenCommanders();
    }, []);

    return (
        <div>
            <div>Getting started on a home page</div>

            {topTenCommanders.map((card, i) => (
                <div key={i}>
                    <div className="topTenCardImage">
                        <img
                            src={card.imageLink}
                            alt={card.commander}
                        />
                    </div>
                    <div className="topTenCardName">
                        {card.commander}
                    </div>
                    <div className="topTenCardCount">
                        {card.count}
                    </div>
                </div>
            ))}
        </div>
    );
}
