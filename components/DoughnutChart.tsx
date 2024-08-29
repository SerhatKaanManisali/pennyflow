'use client'

import React from 'react'
import { Doughnut } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip } from "chart.js"

ChartJS.register(ArcElement, Tooltip);

const DoughnutChart = ({ accounts }: DoughnutChartProps) => {
    const flattenedAccounts = accounts[0];
    const accountNames = flattenedAccounts.map((account: Account) => account.name);
    const balances = flattenedAccounts.map((account: Account) => account.currentBalance);

    const data = {
        datasets: [
            {
                label: "Banks",
                data: balances,
                backgroundColor: ["#0747b6", "#2265d8", "#2f91fa"]
            }
        ],
        labels: accountNames
    }
    
    return <Doughnut
        data={data}
        options={{
            cutout: "60%"
        }}
    />
}

export default DoughnutChart