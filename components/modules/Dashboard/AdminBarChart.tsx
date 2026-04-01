"use client"

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChartData } from "@/types/dashboard.types"

interface AdminBarChartProps {
    data: BarChartData[]
}

const AdminBarChart = ({ data }: AdminBarChartProps) => {
    return (
        <Card className="col-span-1 shadow-sm">
            <CardHeader>
                <CardTitle className="text-xl font-semibold">Monthly Activity</CardTitle>
            </CardHeader>
            <CardContent className="h-[350px] w-full pt-4">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis 
                            dataKey="month" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fill: '#64748b', fontSize: 12 }}
                            dy={10}
                        />
                        <YAxis 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fill: '#64748b', fontSize: 12 }}
                        />
                        <Tooltip 
                            contentStyle={{ 
                                backgroundColor: '#fff', 
                                border: '1px solid #e2e8f0', 
                                borderRadius: '8px',
                                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                            }}
                            cursor={{ fill: '#f8fafc' }}
                        />
                        <Bar 
                            dataKey="count" 
                            fill="hsl(var(--primary))" 
                            radius={[6, 6, 0, 0]} 
                            barSize={40}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    )
}

export default AdminBarChart
