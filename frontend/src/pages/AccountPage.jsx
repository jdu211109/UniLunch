// src/pages/AccountPage.jsx
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../utils/apiClient";
import { Settings, Leaf, Flame } from "lucide-react";
import {
  Card,
  Button,
  Label,
  Input,
  Badge,
  Separator,
  Switch,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../components/ui";
import { useAuth } from "../hooks/useAuth";
import { useLanguage } from "../hooks/useLanguage";

export default function AccountPage() {
  const { t } = useLanguage();
  const auth = useAuth();
  const { data: user } = useQuery({
    queryKey: ["currentUser"],
    queryFn: apiClient.getCurrentUser,
    enabled: auth.status === "authenticated",
  });
  const [paymentMethod, setPaymentMethod] = useState("cash");

  return (
    <div className="container mx-auto py-6 px-4">
      <h1 className="text-3xl font-bold mb-6">{t('common.settings')}</h1>

      <Card>
        <CardHeader>
          <CardTitle>{t('common.profileInfo')}</CardTitle>
          <CardDescription>
            {t('common.manageAccount')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">{t('common.email')}</Label>
            <Input
              id="email"
              value={user?.email || ""}
              disabled
              className="bg-muted"
            />
          </div>

          <div className="space-y-2">
            <Label>{t('common.accountType')}</Label>
            <div className="flex items-center gap-2">
              <Badge variant={user?.isAdmin ? "default" : "outline"}>
                {user?.isAdmin ? t('common.administrator') : t('common.student')}
              </Badge>
            </div>
          </div>

          <Separator className="my-4" />

          <div className="space-y-3">
            <h3 className="font-medium">{t('common.paymentMethods')}</h3>
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
                <Label htmlFor="cash">{t('common.cashPayment')}</Label>
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
          <Button>{t('common.save')}</Button>
        </CardFooter>
      </Card>
    </div>
  );
}