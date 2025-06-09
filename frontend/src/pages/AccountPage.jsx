// src/pages/AccountPage.jsx
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../utils/apiClient";
import { Settings, Leaf, Flame } from "lucide-react";
import { Card, Button, Label, Input, Badge, Separator, Switch } from "../components/ui";

export default function AccountPage() {
  const { data: user } = useQuery(["currentUser"], apiClient.getCurrentUser);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [theme, setTheme] = useState("light");

  const handleThemeChange = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    // Apply theme change logic
  };

  return (
    <div className="container mx-auto py-6 px-4">
      <h1 className="text-3xl font-bold mb-6">Account Settings</h1>

      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>
            Manage your account details and preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              value={user?.email || ""}
              disabled
              className="bg-muted"
            />
          </div>

          <div className="space-y-2">
            <Label>Account Type</Label>
            <div className="flex items-center gap-2">
              <Badge variant={user?.isAdmin ? "default" : "outline"}>
                {user?.isAdmin ? "Administrator" : "Student"}
              </Badge>
            </div>
          </div>

          <Separator className="my-4" />

          <div className="space-y-3">
            <h3 className="font-medium">Appearance</h3>
            <div className="flex items-center justify-between">
              <Label>Theme Mode</Label>
              <Button
                variant="outline"
                size="sm"
                onClick={handleThemeChange}
              >
                Switch to {theme === "light" ? "Dark" : "Light"}
              </Button>
            </div>
          </div>

          <Separator className="my-4" />

          <div className="space-y-3">
            <h3 className="font-medium">Payment Methods</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="cash"
                  name="paymentMethod"
                  value="cash"
                  checked={paymentMethod === "cash"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="h-4 w-4"
                />
                <Label htmlFor="cash">Cash Payment</Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="payme"
                  name="paymentMethod"
                  value="payme"
                  checked={paymentMethod === "payme"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="h-4 w-4"
                />
                <Label htmlFor="payme">PayMe</Label>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button>Save Changes</Button>
        </CardFooter>
      </Card>
    </div>
  );
}