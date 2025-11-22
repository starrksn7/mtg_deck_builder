import Chart from 'chart.js/auto'
import { useEffect, useRef } from 'react';


export const BarChart = ({manaValues}) => {
    const canvasRef = useRef(null);
    const chartRef = useRef(null);

    useEffect(() => {
        if (!canvasRef.current) return;

        if (chartRef.current) {
            chartRef.current.destroy();
        }

        const minCost = Math.min(...manaValues.map(x => x.cost));
        const maxCost = Math.max(...manaValues.map(x => x.cost));

        let filledValues = [];

        for(let i = minCost; i <= maxCost; i++){
            const found = manaValues.find(x => x.cost === i);
            filledValues.push({
                cost: i,
                amountOfCards: found ? found.amountOfCards : 0
            });
        }

        chartRef.current = new Chart(canvasRef.current, {
            type: 'bar',
            data: {
                labels: filledValues.map(row => row.cost),
                datasets: [
                    {
                        label: 'Your mana curve',
                        data: filledValues.map(row => row.amountOfCards),
                        backgroundColor: '#4B80F4'
                    }
                ]
            },
            options: {
                scales: {
                    y: {
                    ticks: {
                        callback: (value) => Number.isInteger(value) ? value : ''
                    }
                    }
                },
                responsive: false
            }
        });

    }, [manaValues]);

    return <canvas id="manaCurve" ref={canvasRef} width={400} height={300} />;
}