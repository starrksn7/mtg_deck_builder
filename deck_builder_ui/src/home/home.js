import { useEffect, useState } from "react";
import api from "../api/axios";

export function Home() {
    const [topTenCommanders, setTopTenCommanders] = useState([]);

    const brainstormArtLink = "https://cards.scryfall.io/art_crop/front/3/f/3f3fb533-84a8-4414-ba1f-56bebe04b061.jpg?1783914759"

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
            <div className="image-container">
                <img 
                    src={brainstormArtLink} 
                    alt="Background scenery" 
                    className="overlay-image"
                />
                <div className="text-overlay">
                    <h2>Welcome to BrianstorMTG</h2>
                    <p>My commander deck building project</p>
                </div>
            </div>

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
