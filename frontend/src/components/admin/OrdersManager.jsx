import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../../utils/apiClient";
import { CheckCircle, XCircle, Clock, Search, CreditCard, Banknote, Bell, Timer } from "lucide-react";
import { Button, Card, Badge, Input } from "../ui";
import { useLanguage } from "../../hooks/useLanguage";

export default function OrdersManager() {
    const queryClient = useQueryClient();
    const { t, language } = useLanguage();
    const [searchTerm, setSearchTerm] = useState("");
    const [countdown, setCountdown] = useState(null);

    const { data, isLoading } = useQuery({
        queryKey: ["admin-orders"],
        queryFn: apiClient.listAdminOrders,
        refetchInterval: 10000, // Refetch every 10 seconds for live updates
    });

    const orders = data?.orders || [];
    const pendingCount = data?.pendingCount || 0;

    // Countdown timer - updates every second when there are pending orders
    useEffect(() => {
        if (pendingCount > 0) {
            const timer = setInterval(() => {
                // Just trigger re-render to update countdown display
                setCountdown(Date.now());
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [pendingCount]);

    const updateStatusMutation = useMutation({
        mutationFn: apiClient.updateOrderStatus,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
        },
    });

    const filteredOrders = orders.filter(order => {
        const term = searchTerm.toLowerCase();
        return order.userName?.toLowerCase().includes(term) ||
            order.items?.some(item => item.mealName?.toLowerCase().includes(term)) ||
            String(order.id).includes(searchTerm);
    });

    const getStatusBadge = (status) => {
        switch (status) {
            case "completed":
                return <Badge className="!bg-green-600 hover:!bg-green-700 !text-white border-transparent">{t('ordersManager.completed')}</Badge>;
            case "cancelled":
                return <Badge variant="destructive">{t('ordersManager.cancelled')}</Badge>;
            case "confirmed":
                return <Badge className="bg-yellow-500 text-white">{t('ordersManager.confirmed')}</Badge>;
            default:
                return <Badge variant="secondary" className="bg-yellow-500 text-white">{t('ordersManager.pending')}</Badge>;
        }
    };

    const getPendingOrdersText = (count) => {
        if (language === 'ru') {
            if (count === 1) return t('ordersManager.newOrder');
            if (count >= 2 && count <= 4) return t('ordersManager.newOrders');
            return t('ordersManager.newOrdersMany');
        }
        return count === 1 ? t('ordersManager.newOrder') : t('ordersManager.newOrders');
    };

    const getLocaleForLanguage = () => {
        switch (language) {
            case 'en': return 'en-US';
            case 'uz': return 'uz-UZ';
            case 'ja': return 'ja-JP';
            default: return 'ru-RU';
        }
    };

    if (isLoading) {
        return <div className="p-8 text-center">{t('ordersManager.loadingOrders')}</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <h2 className="text-2xl font-bold">{t('ordersManager.title')}</h2>
                    {pendingCount > 0 && (
                        <div className="flex items-center gap-2 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 px-3 py-1.5 rounded-full animate-pulse">
                            <Bell size={16} />
                            <span className="text-sm font-medium">
                                {pendingCount} {getPendingOrdersText(pendingCount)} {t('ordersManager.waiting')}
                            </span>
                        </div>
                    )}
                </div>
                <div className="relative w-64">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder={t('ordersManager.searchOrders')}
                        className="h-9 w-full pl-8 rounded-full border-2 border-orange-500 bg-muted/50 focus:bg-background focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/70 focus-visible:ring-offset-0 focus-visible:border-orange-500 focus-visible:shadow-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredOrders.length === 0 ? (
                    <Card className="p-8 text-center text-muted-foreground col-span-full">
                        {t('ordersManager.noOrders')}
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
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="font-mono text-xs text-muted-foreground">#{order.id}</span>
                                        {getStatusBadge(order.status)}
                                    </div>

                                    <div className="text-sm text-muted-foreground mb-2">
                                        {t('ordersManager.client')}: <span className="font-medium text-foreground">{order.userName}</span>
                                    </div>

                                    <div className="space-y-1 mb-3">
                                        {order.items && order.items.map((item, idx) => (
                                            <div key={idx} className="flex justify-between text-sm">
                                                <span>{item.quantity}x {item.mealName}</span>
                                                <span className="text-muted-foreground">${(item.price * item.quantity).toFixed(2)}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="flex items-center gap-4 text-xs text-muted-foreground border-t pt-2">
                                        <span className="flex items-center gap-1">
                                            <Clock size={12} />
                                            {order.pickupTime}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            {order.paymentMethod === "card" ? <CreditCard size={12} /> : <Banknote size={12} />}
                                            {order.paymentMethod === "card" ? t('reservations.card') : t('reservations.cash')}
                                        </span>
                                        <span>
                                            {new Date(order.createdAt).toLocaleString(getLocaleForLanguage(), {
                                                day: "numeric",
                                                month: "short",
                                                hour: "2-digit",
                                                minute: "2-digit"
                                            })}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-2 border-t">
                                    <div className="text-lg font-bold">${order.totalPrice.toFixed(2)}</div>
                                    {order.status === 'confirmed' && (
                                        <div className="flex gap-2">
                                            <Button
                                                size="sm"
                                                className="!bg-green-600 hover:!bg-green-700 !text-white"
                                                onClick={() => updateStatusMutation.mutate({ id: order.id, status: 'completed' })}
                                            >
                                                <CheckCircle size={16} className="mr-1" />
                                                {t('ordersManager.complete')}
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                onClick={() => updateStatusMutation.mutate({ id: order.id, status: 'cancelled' })}
                                            >
                                                <XCircle size={16} className="mr-1" />
                                                {t('common.cancel')}
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
