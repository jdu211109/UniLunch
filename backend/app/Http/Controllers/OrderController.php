<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Meal;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class OrderController extends Controller
{
    /**
     * Get user's orders (for regular users - their own orders)
     */
    public function index()
    {
        $orders = Order::where('user_id', Auth::id())
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'orders' => $orders->map(function ($order) {
                return [
                    'id' => $order->id,
                    'items' => $order->items,
                    'totalPrice' => (float) $order->total_price,
                    'pickupTime' => $order->pickup_time,
                    'paymentMethod' => $order->payment_method,
                    'status' => $order->status,
                    'createdAt' => $order->created_at,
                    'updatedAt' => $order->updated_at,
                ];
            }),
        ]);
    }

    /**
     * Get all confirmed orders (for admin) - only orders older than 2 minutes
     */
    public function adminIndex()
    {
        $twoMinutesAgo = now()->subMinutes(2);
        
        // Orders visible to admin (older than 2 minutes)
        $orders = Order::with('user')
            ->whereIn('status', ['confirmed', 'completed', 'cancelled'])
            ->where('created_at', '<=', $twoMinutesAgo)
            ->orderBy('created_at', 'desc')
            ->get();

        // Count of pending orders (less than 2 minutes old, not cancelled)
        $pendingCount = Order::where('status', 'confirmed')
            ->where('created_at', '>', $twoMinutesAgo)
            ->count();

        return response()->json([
            'success' => true,
            'pendingCount' => $pendingCount,
            'orders' => $orders->map(function ($order) {
                return [
                    'id' => $order->id,
                    'userId' => $order->user_id,
                    'userName' => $order->user->name ?? 'Unknown',
                    'items' => $order->items,
                    'totalPrice' => (float) $order->total_price,
                    'pickupTime' => $order->pickup_time,
                    'paymentMethod' => $order->payment_method,
                    'status' => $order->status,
                    'createdAt' => $order->created_at,
                    'updatedAt' => $order->updated_at,
                ];
            }),
        ]);
    }

    /**
     * Create a new order (confirm cart)
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'items' => 'required|array|min:1',
            'items.*.mealId' => 'required|exists:meals,id',
            'items.*.quantity' => 'required|integer|min:1',
            'pickupTime' => 'required|date_format:H:i',
            'paymentMethod' => 'required|in:cash,card',
        ]);

        // Calculate total and enrich items
        $enrichedItems = [];
        $totalPrice = 0;

        foreach ($validated['items'] as $item) {
            $meal = Meal::findOrFail($item['mealId']);
            $itemTotal = $meal->price * $item['quantity'];
            $totalPrice += $itemTotal;

            $enrichedItems[] = [
                'mealId' => $meal->id,
                'mealName' => $meal->name,
                'quantity' => $item['quantity'],
                'price' => (float) $meal->price,
                'imageUrl' => $meal->image_url,
            ];
        }

        $order = Order::create([
            'user_id' => Auth::id(),
            'items' => $enrichedItems,
            'total_price' => $totalPrice,
            'pickup_time' => $validated['pickupTime'],
            'payment_method' => $validated['paymentMethod'],
            'status' => Order::STATUS_CONFIRMED, // Сразу подтверждён и виден админу
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Order confirmed successfully',
            'order' => [
                'id' => $order->id,
                'items' => $order->items,
                'totalPrice' => (float) $order->total_price,
                'pickupTime' => $order->pickup_time,
                'paymentMethod' => $order->payment_method,
                'status' => $order->status,
                'createdAt' => $order->created_at,
            ],
        ], 201);
    }

    /**
     * Update order status (admin only)
     */
    public function updateStatus(Request $request, Order $order)
    {
        $validated = $request->validate([
            'status' => 'required|in:confirmed,completed,cancelled',
        ]);

        $order->update(['status' => $validated['status']]);

        return response()->json([
            'success' => true,
            'message' => 'Order status updated',
            'order' => [
                'id' => $order->id,
                'status' => $order->status,
            ],
        ]);
    }

    /**
     * Cancel order (user can cancel within 10 minutes)
     */
    public function cancel(Order $order)
    {
        // User can only cancel their own orders
        if ($order->user_id !== Auth::id()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized',
            ], 403);
        }

        // Check if order is already cancelled or completed
        if ($order->status !== Order::STATUS_CONFIRMED) {
            return response()->json([
                'success' => false,
                'message' => 'Cannot cancel this order',
            ], 400);
        }

        // Check if within 2 minutes
        $secondsSinceCreation = $order->created_at->diffInSeconds(now());
        if ($secondsSinceCreation > 120) {
            return response()->json([
                'success' => false,
                'message' => 'Order can only be cancelled within 2 minutes of creation',
            ], 400);
        }

        $order->update(['status' => Order::STATUS_CANCELLED]);

        return response()->json([
            'success' => true,
            'message' => 'Order cancelled successfully',
            'order' => [
                'id' => $order->id,
                'status' => $order->status,
            ],
        ]);
    }

    /**
     * Delete order (user can delete their own pending orders)
     */
    public function destroy(Order $order)
    {
        // User can only delete their own orders
        if ($order->user_id !== Auth::id() && Auth::user()->role !== 'admin') {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized',
            ], 403);
        }

        $order->delete();

        return response()->json([
            'success' => true,
            'message' => 'Order deleted',
        ]);
    }
}
