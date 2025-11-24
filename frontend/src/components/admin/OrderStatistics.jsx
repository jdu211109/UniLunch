import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../../utils/apiClient";
import { Card } from "../ui";
import { DollarSign, ShoppingBag, CheckCircle, XCircle, TrendingUp } from "lucide-react";

export default function OrderStatistics() {
    const { data: orders = [], isLoading } = useQuery({
        queryKey: ["admin-orders"],
        queryFn: apiClient.listAllReservations
    });

    const stats = useMemo(() => {
        const totalOrders = orders.length;
        const completedOrders = orders.filter(o => o.status === 'completed').length;
        const cancelledOrders = orders.filter(o => o.status === 'cancelled').length;
        const pendingOrders = orders.filter(o => o.status === 'pending').length;

        const totalRevenue = orders
            .filter(o => o.status !== 'cancelled')
            .reduce((sum, order) => sum + (order.totalPrice || 0), 0);

        // Calculate popular items
        const itemCounts = {};
        orders.forEach(order => {
            if (order.status !== 'cancelled') {
                if (order.items && order.items.length > 0) {
                    order.items.forEach(item => {
                        itemCounts[item.mealName] = (itemCounts[item.mealName] || 0) + item.quantity;
                    });
                } else {
                    // Fallback for old single-item orders
                    itemCounts[order.mealName] = (itemCounts[order.mealName] || 0) + order.quantity;
                }
            }
        });

        const popularItems = Object.entries(itemCounts)
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);

        return {
            totalOrders,
            completedOrders,
            cancelledOrders,
            pendingOrders,
            totalRevenue,
            popularItems
        };
    }, [orders]);

    if (isLoading) {
        return <div className="p-8 text-center">Loading statistics...</div>;
    }

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">Order Statistics</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="p-6">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-green-100 rounded-full text-green-600">
                            <DollarSign size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Total Revenue</p>
                            <h3 className="text-2xl font-bold">${stats.totalRevenue.toFixed(2)}</h3>
                        </div>
                    </div>
                </Card>

                <Card className="p-6">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-100 rounded-full text-blue-600">
                            <ShoppingBag size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Total Orders</p>
                            <h3 className="text-2xl font-bold">{stats.totalOrders}</h3>
                        </div>
                    </div>
                </Card>

                <Card className="p-6">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-emerald-100 rounded-full text-emerald-600">
                            <CheckCircle size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Completed</p>
                            <h3 className="text-2xl font-bold">{stats.completedOrders}</h3>
                        </div>
                    </div>
                </Card>

                <Card className="p-6">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-red-100 rounded-full text-red-600">
                            <XCircle size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Cancelled</p>
                            <h3 className="text-2xl font-bold">{stats.cancelledOrders}</h3>
                        </div>
                    </div>
                </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <TrendingUp size={20} className="text-primary" />
                        <h3 className="text-lg font-bold">Popular Items</h3>
                    </div>
                    <div className="space-y-4">
                        {stats.popularItems.length > 0 ? (
                            stats.popularItems.map((item, index) => (
                                <div key={index} className="flex justify-between items-center border-b pb-2 last:border-0 last:pb-0">
                                    <span className="font-medium">{item.name}</span>
                                    <span className="text-sm bg-secondary px-2 py-1 rounded-full">
                                        {item.count} sold
                                    </span>
                                </div>
                            ))
                        ) : (
                            <p className="text-muted-foreground text-sm">No sales data yet.</p>
                        )}
                    </div>
                </Card>
            </div>
        </div>
    );
}
