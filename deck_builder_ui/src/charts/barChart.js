import Chart from 'chart.js/auto'

export const BarChart = (manaValues) => {
    
    new Chart(
        document.getElementById('manaCurve'),
        {
        type: 'bar',
        data: {
            labels: manaValues.map(row => row.amountOfCards),
            datasets: [
            {
                label: 'Your mana curve',
                data: manaValues.map(row => row.cost)
            }
            ]
        }
        }
  );
}