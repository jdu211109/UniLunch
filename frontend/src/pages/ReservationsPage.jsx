// src/pages/ReservationsPage.jsx
import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { apiClient } from "../utils/apiClient";
import { Trash2, Plus, Minus, CreditCard, Banknote, Clock, X } from "lucide-react";
import { Button, Card, Badge } from "../components/ui";
import { useToast } from "../components/navigation/useToast.jsx";
import { useLanguage } from "../hooks/useLanguage";

export default function ReservationsPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { t, language } = useLanguage();

  const [cart, setCart] = useState([]);
  const [, forceUpdate] = useState(0); // For re-rendering cancel timer

  // Get minimum pickup time: current time + 10 minutes, rounded up to next 5 minutes
  const getMinPickupTime = () => {
    const now = new Date();
    // Add 10 minutes to current time
    now.setMinutes(now.getMinutes() + 10);
    // Round up to next 5 minutes
    const minutes = now.getMinutes();
    const roundedMinutes = Math.ceil(minutes / 5) * 5;
    now.setMinutes(roundedMinutes);
    now.setSeconds(0);
    return now.toTimeString().slice(0, 5);
  };

  const [pickupTime, setPickupTime] = useState(getMinPickupTime());
  const [paymentMethod, setPaymentMethod] = useState("cash");

  // Update minTime every minute
  const [minTime, setMinTime] = useState(getMinPickupTime());

  // Timer for cancel button countdown
  useEffect(() => {
    const interval = setInterval(() => {
      forceUpdate(n => n + 1); // Force re-render every second for cancel timer
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  React.useEffect(() => {
    const interval = setInterval(() => {
      const newMinTime = getMinPickupTime();
      setMinTime(newMinTime);
      // If current pickup time is now in the past, update it
      if (pickupTime < newMinTime) {
        setPickupTime(newMinTime);
      }
    }, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, [pickupTime]);

  // Load cart from localStorage
  useEffect(() => {
    setCart(apiClient.getCart());
  }, []);

  // Get confirmed orders
  const { data: orders = [] } = useQuery({
    queryKey: ["userOrders"],
    queryFn: apiClient.listUserOrders,
  });

  const confirmOrderMutation = useMutation({
    mutationFn: apiClient.confirmOrder,
    onSuccess: () => {
      toast({
        title: t('reservations.orderConfirmed'),
        description: t('reservations.orderSentForProcessing'),
      });
      setCart([]);
      queryClient.invalidateQueries({ queryKey: ["userOrders"] });
    },
    onError: (error) => {
      toast({
        title: t('reservations.error'),
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateQuantity = (mealId, newQuantity) => {
    const updatedCart = apiClient.updateCartItem(mealId, newQuantity);
    setCart(updatedCart);
  };

  const clearCart = () => {
    apiClient.clearCart();
    setCart([]);
  };

  const handleConfirmOrder = () => {
    if (cart.length === 0) {
      toast({
        title: t('reservations.cartEmpty'),
        description: t('reservations.addItemsToCart'),
        variant: "destructive",
      });
      return;
    }
    confirmOrderMutation.mutate({ pickupTime, paymentMethod });
  };

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const getLocaleForLanguage = () => {
    switch (language) {
      case 'en': return 'en-US';
      case 'uz': return 'uz-UZ';
      case 'ja': return 'ja-JP';
      default: return 'ru-RU';
    }
  };

  const formatDate = (dateInput) => {
    if (!dateInput) return "Date not available";
    try {
      const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
      return date.toLocaleDateString(getLocaleForLanguage(), {
        day: "numeric",
        month: "long",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "Invalid Date";
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "completed":
        return <Badge className="!bg-green-600 !text-white">{t('status.completed')}</Badge>;
      case "cancelled":
        return <Badge variant="destructive">{t('status.cancelled')}</Badge>;
      case "confirmed":
        return <Badge className="bg-yellow-500 text-white">{t('status.confirmed')}</Badge>;
      default:
        return <Badge variant="secondary" className="bg-yellow-500 text-white">{t('status.pending')}</Badge>;
    }
  };

  const cancelOrderMutation = useMutation({
    mutationFn: apiClient.cancelOrder,
    onSuccess: () => {
      toast({
        title: t('reservations.orderCancelled'),
        description: t('reservations.orderCancelledSuccess'),
      });
      queryClient.invalidateQueries({ queryKey: ["userOrders"] });
    },
    onError: (error) => {
      toast({
        title: t('reservations.error'),
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleCancelOrder = (orderId) => {
    if (confirm(t('reservations.cancelConfirmation'))) {
      cancelOrderMutation.mutate(orderId);
    }
  };

  return (
    <div className="container mx-auto py-6 px-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6 text-center">{t('reservations.title')}</h1>

      {/* Cart Section */}
      {cart.length > 0 && (
        <Card className="p-6 mb-8">
          <div className="mb-4">
            <h2 className="text-xl font-bold">
              {t('reservations.cart')}
            </h2>
          </div>

          {/* Cart Items */}
          <div className="space-y-3 mb-6">
            {cart.map((item) => (
              <div key={item.mealId} className="flex items-center gap-4 bg-muted/30 p-3 rounded-lg">
                <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={item.imageUrl || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100&h=100&fit=crop"}
                    alt={item.mealName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{item.mealName}</h3>
                  <p className="text-muted-foreground">${item.price.toFixed(2)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => updateQuantity(item.mealId, item.quantity - 1)}
                  >
                    <Minus size={14} />
                  </Button>
                  <span className="w-8 text-center font-medium">{item.quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => updateQuantity(item.mealId, item.quantity + 1)}
                  >
                    <Plus size={14} />
                  </Button>
                </div>
                <p className="font-bold w-20 text-right">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}
          </div>

          {/* Pickup Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                <Clock size={16} />
                {t('reservations.pickupTime')}
              </label>
              <input
                type="time"
                value={pickupTime}
                min={minTime}
                onChange={(e) => {
                  // Only allow times >= current time
                  if (e.target.value >= minTime) {
                    setPickupTime(e.target.value);
                  } else {
                    setPickupTime(minTime);
                  }
                }}
                onClick={(e) => e.target.showPicker()}
                className="w-full px-3 py-2 border rounded-lg bg-background cursor-pointer"
              />
              <p className="text-xs text-muted-foreground mt-1">{t('reservations.minimum')}: {minTime}</p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">{t('reservations.paymentMethod')}</label>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setPaymentMethod("cash")}
                  className={`flex-1 ${paymentMethod === "cash" ? "bg-blue-600 text-white hover:bg-blue-700 border-blue-600" : ""}`}
                >
                  <Banknote size={16} className="mr-2" />
                  {t('reservations.cash')}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setPaymentMethod("card")}
                  className={`flex-1 ${paymentMethod === "card" ? "bg-blue-600 text-white hover:bg-blue-700 border-blue-600" : ""}`}
                >
                  <CreditCard size={16} className="mr-2" />
                  {t('reservations.card')}
                </Button>
              </div>
            </div>
          </div>

          {/* Total and Actions */}
          <div className="border-t pt-4">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-medium">{t('reservations.total')}:</span>
              <span className="text-2xl font-bold text-primary">${totalPrice.toFixed(2)}</span>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1 text-destructive hover:bg-destructive/10 border-destructive/50"
                onClick={clearCart}
              >
                {t('reservations.clearAll')}
              </Button>
              <Button
                className="flex-1 !bg-green-600 hover:!bg-green-700 !text-white"
                onClick={handleConfirmOrder}
                disabled={confirmOrderMutation.isPending}
              >
                {confirmOrderMutation.isPending ? t('reservations.sending') : t('reservations.confirmOrder')}
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Empty Cart */}
      {cart.length === 0 && orders.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">{t('reservations.noOrders')}</p>
          <Button onClick={() => navigate("/menu")}>
            {t('reservations.goToMenu')}
          </Button>
        </div>
      )}

      {/* Confirmed Orders History */}
      {orders.length > 0 && (
        <div>
          <h2 className="text-xl font-bold mb-4">{t('reservations.orderHistory')}</h2>
          <div className="space-y-4">
            {orders.map((order) => (
              <Card key={order.id} className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="font-mono text-sm text-muted-foreground">{t('reservations.order')} #{order.id}</p>
                    <p className="text-sm text-muted-foreground">{formatDate(order.createdAt)}</p>
                  </div>
                  {getStatusBadge(order.status)}
                </div>

                <div className="space-y-2 mb-3">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span>{item.quantity}x {item.mealName}</span>
                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-3 flex justify-between items-center text-sm">
                  <div className="flex gap-4 text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock size={14} />
                      {order.pickupTime}
                    </span>
                    <span className="flex items-center gap-1">
                      {order.paymentMethod === "card" ? <CreditCard size={14} /> : <Banknote size={14} />}
                      {order.paymentMethod === "card" ? t('reservations.card') : t('reservations.cash')}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    {order.status === "confirmed" && apiClient.canCancelOrder(order.createdAt) && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-500 border-red-500 hover:bg-red-50 hover:text-red-600"
                        onClick={() => handleCancelOrder(order.id)}
                        disabled={cancelOrderMutation.isPending}
                      >
                        <X size={14} className="mr-1" />
                        {t('reservations.cancelButton')} ({apiClient.getRemainingCancelTime(order.createdAt)} {t('reservations.sec')})
                      </Button>
                    )}
                    <span className="font-bold text-lg">${order.totalPrice.toFixed(2)}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}