import { useEffect, useState } from "react";
import api from "../api/axios";
import { SearchBar } from "../search/searchBar";

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
        <div className="home-page">

            <div
                className="image-container"
                style={{ backgroundImage: `url(${brainstormArtLink})` }}
            >
                <img
                    src={brainstormArtLink}
                    alt="Background scenery"
                    className="overlay-image"
                />

                <div className="text-overlay">
                    <h2>Welcome to BrianstorMTG</h2>
                    <p>My commander deck building project</p>
                    <SearchBar />
                </div>
            </div>

            <section className="top-ten-section">
                <h2 className="top-ten-title">Top Commanders</h2>

                <div className="top-ten-grid">
                    {topTenCommanders.map((card, i) => (
                        <div className="top-ten-card" key={i}>

                            <div className="top-ten-card-image">
                                <img
                                    src={card.imageLink}
                                    alt={card.commander}
                                />
                            </div>

                            <div className="top-ten-card-info">
                                <div className="top-ten-card-name">
                                    {card.commander}
                                </div>

                                <div className="top-ten-card-count">
                                    {card.count} {card.count === 1 ? "deck" : "decks"}
                                </div>
                            </div>

                        </div>
                    ))}
                </div>
            </section>

        </div>
    );

}
