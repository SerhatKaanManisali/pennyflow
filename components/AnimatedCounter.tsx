'use client'

import React from 'react'
import CountUp from 'react-countup'

const AnimatedCounter = ({ amount }: { amount: number }) => {
    return (
        <div className="w-full">
            <CountUp decimal="," suffix="€" decimals={2} separator="." end={amount} />
        </div>
    )
}

export default AnimatedCounter