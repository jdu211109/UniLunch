// src/pages/ReservationsPage.jsx
import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { apiClient } from "../utils/apiClient";
import { Calendar, Leaf, Flame, Trash2 } from "lucide-react";
import { Button, Card, Badge } from "../components/ui";
import { useLanguage } from "../hooks/useLanguage";

export default function ReservationsPage() {
  const { t } = useLanguage();
  const { data: reservations = [] } = useQuery({
    queryKey: ["userReservations"],
    queryFn: apiClient.listUserReservations
  });

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const formatDate = (dateInput) => {
    if (!dateInput) return "Date not available";
    try {
      const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
      return date.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (e) {
      return "Invalid Date";
    }
  };

  const deleteReservationMutation = useMutation({
    mutationFn: apiClient.deleteReservation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userReservations"] });
    }
  });


  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{t('reservations.title')}</h1>
      </div>

      {reservations.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            {t('reservations.noReservations')}
          </p>
          <Button className="mt-4" onClick={() => navigate("/menu")}>
            {t('reservations.browseMenu')}
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reservations.map((reservation) => (
            <Card key={reservation.id} className="overflow-hidden flex flex-col h-full">
              <div className="p-3">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-base font-bold">Order #{reservation.id.slice(-6)}</h3>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(reservation.createdAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-base mr-2">
                      ${(reservation.totalPrice || 0).toFixed(2)}
                    </p>

                    {reservation.status === 'completed' && <Badge className="bg-green-500">Completed</Badge>}
                    {reservation.status === 'cancelled' && <Badge variant="destructive">Cancelled</Badge>}
                    {reservation.status === 'pending' && <Badge variant="secondary" className="bg-yellow-500 text-white">Pending</Badge>}

                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 hover:text-red-700 dark:hover:text-red-300 ml-1"
                      onClick={() => deleteReservationMutation.mutate(reservation.id)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  {reservation.items && reservation.items.length > 0 ? (
                    reservation.items.map((item, index) => (
                      <div key={index} className="flex items-center gap-3 bg-muted/30 p-1.5 rounded-md">
                        <div className="w-10 h-10 rounded-md overflow-hidden flex-shrink-0">
                          <img
                            src={item.imageUrl || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100&h=100&fit=crop"}
                            alt={item.mealName}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <span className="font-medium text-sm">{item.mealName}</span>
                            <span className="text-sm font-bold">x{item.quantity}</span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            ${(item.price || 0).toFixed(2)} each
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    // Fallback for old single-item reservations
                    <div className="flex items-center gap-3 bg-muted/30 p-1.5 rounded-md">
                      <div className="w-10 h-10 rounded-md overflow-hidden flex-shrink-0">
                        <img
                          src={reservation.meal?.imageUrl || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100&h=100&fit=crop"}
                          alt={reservation.mealName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <span className="font-medium text-sm">{reservation.mealName}</span>
                          <span className="text-sm font-bold">x{reservation.quantity}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}