import { useLocation } from "react-router-dom";
import { useState } from "react";


export function SingleCard() {
    const location = useLocation();
    const resultsArray = location.state?.resultsArray ?? [];

    console.log(resultsArray);
    return (
        <div>
            single card info here
        </div>
    )
}