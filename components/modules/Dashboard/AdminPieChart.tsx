"use client"

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip, Legend } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChartData } from "@/types/dashboard.types"

interface AdminPieChartProps {
    data: PieChartData[]
}

const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6"]

const AdminPieChart = ({ data }: AdminPieChartProps) => {
    return (
        <Card className="col-span-1 shadow-sm">
            <CardHeader>
                <CardTitle className="text-xl font-semibold">Idea Status Distribution</CardTitle>
            </CardHeader>
            <CardContent className="h-[350px] w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            dataKey="count"
                            nameKey="status"
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                             innerRadius={60}
                            paddingAngle={5}
                        >
                            {data.map((_, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip 
                             contentStyle={{ 
                                backgroundColor: '#fff', 
                                border: '1px solid #e2e8f0', 
                                borderRadius: '8px',
                                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                            }}
                        />
                        <Legend verticalAlign="bottom" height={36}/>
                    </PieChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    )
}

export default AdminPieChart
