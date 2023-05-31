import { Bar, Pie } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

function getBarStats(title, label, data, ariaLabel) {
    if (data) {
        const barOptions = {
            responsive: true,
            plugins: {
                legend: {
                    display: false,
                },
                title: {
                    display: true,
                    text: title,
                },
            },
            scales: {
                y: {
                    ticks: {
                        stepSize: 1
                    }
                }
            }
        };

        const barData = {
            datasets: [
                {
                    label: label,
                    data: data,
                    backgroundColor: 'rgba(105, 227, 113, 0.8)',
                },
            ],
        };
        return <Bar aria-label={ariaLabel} style={{ maxWidth: '600px' }} options={barOptions} data={barData} />
    }
}

function getPieStats(title, label, data, ariaLabel, plan = false) {
    if (data) {
        const pieOptions = {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: title,
                },
            },
        };

        const pieData = {
            labels: Object.keys(data),
            datasets: [
                {
                    label: label,
                    data: Object.values(data),
                    borderWidth: 1,
                    backgroundColor: plan ?
                        [
                            '#A5F2AA',
                            '#F8EA70',
                            '#E17596',
                        ] :
                        [
                            'rgba(255, 0, 0, 0.5)',
                            'rgba(54, 162, 235, 0.5)',
                            'rgba(254, 250, 0, 0.5)',
                            'rgba(77, 255, 0, 0.5)',
                            'rgba(213, 0, 255, 0.5)',
                            'rgba(255, 158, 0, 0.5)',
                            'rgba(0, 255, 197, 0.5)',
                        ],
                },
            ],
        };
        return <Pie aria-label={ariaLabel} style={{ maxWidth: '600px' }} options={pieOptions} data={pieData} />
    }
}

export { getBarStats, getPieStats }