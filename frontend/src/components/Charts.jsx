import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LabelList } from 'recharts';

const CLASS_COLORS = {
    'High Risk': '#f43f5e',   // Hazard Red
    'Medium Risk': '#f59e0b', // Amber Warning
    'Low Risk': '#10b981',    // Safe Green
    'Hazard': '#f43f5e',
    'Safe': '#10b981'
};

const Charts = ({ result }) => {
    if (!result) return null;

    const probabilities = result.probabilities || {};
    
    // Exact probabilities from multi-class predict_proba
    const highProb = typeof probabilities['High Risk'] === 'number' ? probabilities['High Risk'] : 0;
    const medProb = typeof probabilities['Medium Risk'] === 'number' ? probabilities['Medium Risk'] : 0;
    const lowProb = typeof probabilities['Low Risk'] === 'number' ? probabilities['Low Risk'] : 0;

    // Display multi-class breakdown with exact values
    const chartData = [
        {
            name: 'High Risk',
            display: 'High Risk',
            value: parseFloat((highProb * 100).toFixed(1)),
            color: '#f43f5e'
        },
        {
            name: 'Medium Risk',
            display: 'Medium Risk',
            value: parseFloat((medProb * 100).toFixed(1)),
            color: '#f59e0b'
        },
        {
            name: 'Low Risk',
            display: 'Low Risk',
            value: parseFloat((lowProb * 100).toFixed(1)),
            color: '#10b981'
        }
    ];

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const item = payload[0].payload;
            return (
                <div className="bg-[#1c2740] border border-[#334155] px-3 py-2 rounded-lg shadow-2xl backdrop-blur-md">
                    <p className="text-[#94a3b8] text-xs font-semibold uppercase tracking-wider mb-0.5">{item.name}</p>
                    <p className="text-white font-mono text-sm font-bold">{item.value}% probability</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="w-full space-y-3">
            <div className="w-full h-36">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={chartData}
                        layout="vertical"
                        margin={{ top: 0, right: 35, left: 10, bottom: 0 }}
                        barSize={20}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} vertical={true} />
                        <XAxis type="number" domain={[0, 100]} hide />
                        <YAxis
                            dataKey="name"
                            type="category"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }}
                            width={82}
                        />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255, 255, 255, 0.04)' }} />
                        <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                            <LabelList
                                dataKey="value"
                                position="right"
                                formatter={(val) => `${val}%`}
                                fill="#cbd5e1"
                                fontSize={12}
                                fontWeight={600}
                            />
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Binary Aggregation Indicator: Hazard (High + Med) vs Safe (Low) */}
            <div className="pt-2 border-t border-[#334155]/60 flex items-center justify-between text-xs px-1 text-[#94a3b8]">
                <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#f43f5e]"></span>
                    <span>Aggregate Hazard: <strong>{((highProb + medProb) * 100).toFixed(1)}%</strong></span>
                </div>
                <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#10b981]"></span>
                    <span>Aggregate Safe: <strong>{(lowProb * 100).toFixed(1)}%</strong></span>
                </div>
            </div>
        </div>
    );
};

export default Charts;
