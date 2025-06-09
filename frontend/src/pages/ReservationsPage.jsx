// src/pages/ReservationsPage.jsx
import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { apiClient } from "../utils/apiClient";
import { Calendar } from "lucide-react";
import { Button, Card, Badge } from "../components/ui";

export default function ReservationsPage() {
  const { data: reservations = [] } = useQuery(
    ["userReservations"],
    apiClient.listUserReservations
  );
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const formatDate = (dateInput) => {
    const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const cancelReservationMutation = useMutation(
    apiClient.cancelReservation,
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["userReservations"]);
      },
    }
  );

  const rebookMealMutation = useMutation(apiClient.createReservation, {
    onSuccess: () => {
      queryClient.invalidateQueries(["userReservations"]);
    },
  });

  const handleRebookMeal = (mealId) => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    rebookMealMutation.mutate({
      mealId,
      date: tomorrow.toISOString(),
    });
  };

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Reservations</h1>
        <Button onClick={() => navigate("/menu")}>Book New Reservation</Button>
      </div>

      {reservations.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            You don't have any reservations yet.
          </p>
          <Button className="mt-4" onClick={() => navigate("/menu")}>
            Browse Menu
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {reservations.map((reservation) => (
            <Card key={reservation.id} className="overflow-hidden">
              <div className="sm:flex">
                <div className="sm:w-1/5 h-32 sm:h-auto">
                  <img
                    src={reservation.meal.imageUrl}
                    alt={reservation.meal.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="p-4 flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-bold">{reservation.meal.name}</h3>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(reservation.date)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-sm mr-2">
                        ${reservation.meal.price.toFixed(2)}
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRebookMeal(reservation.meal.id)}
                      >
                        Rebook
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-destructive"
                        onClick={() =>
                          cancelReservationMutation.mutate(reservation.id)
                        }
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2 mb-2 line-clamp-2">
                    {reservation.meal.description}
                  </p>
                  <div className="flex gap-1">
                    {reservation.meal.isVegetarian && (
                      <Badge variant="outline" className="text-xs bg-green-50">
                        <Leaf size={12} className="mr-1 text-green-500" />
                        Veg
                      </Badge>
                    )}
                    {reservation.meal.isSpicy && (
                      <Badge variant="outline" className="text-xs bg-red-50">
                        <Flame size={12} className="mr-1 text-red-500" />
                        Spicy
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}