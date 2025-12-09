// src/pages/AdminPage.jsx
import React, { useState } from "react";
import MealsManager from "../components/admin/MealsManager";
import MenusManager from "../components/admin/MenusManager";
import OrdersManager from "../components/admin/OrdersManager";
import OrderStatistics from "../components/admin/OrderStatistics";
import { LayoutDashboard, UtensilsCrossed, ShoppingBag, BarChart3 } from "lucide-react";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("menus");

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex justify-center mb-8">
        <div className="bg-muted p-1 rounded-lg flex">
          <button
            onClick={() => setActiveTab("menus")}
            className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === "menus"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
              }`}
          >
            <LayoutDashboard size={16} className="mr-2" />
            Menus
          </button>
          <button
            onClick={() => setActiveTab("meals")}
            className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === "meals"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
              }`}
          >
            <UtensilsCrossed size={16} className="mr-2" />
            Meals
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === "orders"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
              }`}
          >
            <ShoppingBag size={16} className="mr-2" />
            Orders
          </button>
          <button
            onClick={() => setActiveTab("statistics")}
            className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === "statistics"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
              }`}
          >
            <BarChart3 size={16} className="mr-2" />
            Statistics
          </button>
        </div>
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
        {activeTab === "menus" && <MenusManager />}
        {activeTab === "meals" && <MealsManager />}
        {activeTab === "orders" && <OrdersManager />}
        {activeTab === "statistics" && <OrderStatistics />}
      </div>
    </div>
  );
}