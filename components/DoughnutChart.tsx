'use client'

import React from 'react'
import { Doughnut } from 'react-chartjs-2'
import { Chart, ArcElement, Tooltip } from 'chart.js'
Chart.register(ArcElement, Tooltip);

const DoughnutChart = ({ accounts }: DoughnutChartProps) => {
    const accountNames = accounts.map((account) => account.name);
    const balances = accounts.map((account) => account.currentBalance);

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