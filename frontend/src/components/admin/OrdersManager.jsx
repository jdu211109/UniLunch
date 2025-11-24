import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../../utils/apiClient";
import { CheckCircle, XCircle, Clock, Search } from "lucide-react";
import { Button, Card, Badge, Input } from "../ui";

export default function OrdersManager() {
    const queryClient = useQueryClient();
    const [searchTerm, setSearchTerm] = React.useState("");

    const { data: orders = [], isLoading } = useQuery({
        queryKey: ["admin-orders"],
        queryFn: apiClient.listAllReservations
    });

    const updateStatusMutation = useMutation({
        mutationFn: apiClient.updateReservationStatus,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
        },
    });

    const filteredOrders = orders.filter(order => {
        const term = searchTerm.toLowerCase();
        return order.userName.toLowerCase().includes(term) ||
               order.mealName?.toLowerCase().includes(term) ||
               order.items?.some(item => item.mealName?.toLowerCase().includes(term)) ||
               order.id.includes(searchTerm);
    });

    const getStatusBadge = (status) => {
        switch (status) {
            case "completed":
                return <Badge className="bg-green-600 hover:bg-green-700 text-white border-transparent">Completed</Badge>;
            case "cancelled":
                return <Badge variant="destructive">Cancelled</Badge>;
            default:
                return <Badge variant="secondary" className="bg-yellow-500 text-white">Pending</Badge>;
        }
    };

    if (isLoading) {
        return <div className="p-8 text-center">Loading orders...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Orders Management</h2>
                <div className="relative w-64">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search orders..."
                        className="pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredOrders.length === 0 ? (
                    <Card className="p-8 text-center text-muted-foreground col-span-full">
                        No orders found.
                    </Card>
                ) : (
                    filteredOrders.map((order) => (
                        <Card
                            key={order.id}
                            className={`p-4 flex flex-col h-full ${order.status === 'completed' ? 'bg-green-50 dark:bg-green-900/10 border-green-200' :
                                order.status === 'cancelled' ? 'bg-red-50 dark:bg-red-900/10 border-red-200' :
                                    'bg-yellow-50 dark:bg-yellow-900/10 border-yellow-200'
                                }`}
                        >
                            <div className="flex flex-col justify-between h-full gap-3">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="font-mono text-xs text-muted-foreground">#{order.id.slice(-6)}</span>
                                        {getStatusBadge(order.status)}
                                        <span className="text-sm text-muted-foreground">
                                            {new Date(order.createdAt).toLocaleString()}
                                        </span>
                                    </div>

                                    <div className="mt-1 space-y-1">
                                        {order.items && order.items.length > 0 ? (
                                            order.items.map((item, idx) => (
                                                <div key={idx} className="flex justify-between text-sm">
                                                    <span>{item.quantity}x {item.mealName}</span>
                                                    <span className="text-muted-foreground">${(item.price * item.quantity).toFixed(2)}</span>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="flex justify-between text-sm">
                                                <span>{order.quantity}x {order.mealName}</span>
                                                <span className="text-muted-foreground">${order.totalPrice.toFixed(2)}</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="text-xs text-muted-foreground mt-1 pt-1 border-t">
                                        Ordered by: <span className="font-medium text-foreground">{order.userName}</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-6">
                                    <div className="text-right">
                                        <div className="text-xs text-muted-foreground">Total</div>
                                        <div className="text-base font-bold">${order.totalPrice.toFixed(2)}</div>
                                    </div>
                                </div>

                                {order.status === 'pending' && (
                                    <div className="flex gap-2">
                                        <Button
                                            size="sm"
                                            className="bg-green-600 hover:bg-green-700 text-white"
                                            onClick={() => updateStatusMutation.mutate({ id: order.id, status: 'completed' })}
                                        >
                                            <CheckCircle size={16} className="mr-1" />
                                            Complete
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                            onClick={() => updateStatusMutation.mutate({ id: order.id, status: 'cancelled' })}
                                        >
                                            <XCircle size={16} className="mr-1" />
                                            Cancel
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
