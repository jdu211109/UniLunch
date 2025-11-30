<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\PasswordResetController;
use App\Http\Controllers\MealController;
use App\Http\Controllers\OrderController;

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'authenticate']);

// Password Reset routes
Route::post('/password/send-code', [PasswordResetController::class, 'sendResetCode']);
Route::post('/password/verify-code', [PasswordResetController::class, 'verifyResetCode']);
Route::post('/password/reset', [PasswordResetController::class, 'resetPassword']);

// Meals routes - public access for viewing, admin for creating/updating/deleting
Route::get('/meals', [MealController::class, 'index']); // Everyone can view
Route::get('/meals/categories', [MealController::class, 'categories']); // Get categories
Route::get('/meals/{meal}', [MealController::class, 'show']); // Everyone can view

// Protected routes (require API token)
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/logout-all', [AuthController::class, 'logoutAll']);
    
    // User orders
    Route::get('/orders', [OrderController::class, 'index']);
    Route::post('/orders', [OrderController::class, 'store']);
    Route::put('/orders/{order}/cancel', [OrderController::class, 'cancel']);
    Route::delete('/orders/{order}', [OrderController::class, 'destroy']);
});

// Admin only routes
Route::middleware(['auth:sanctum', 'role:admin'])->group(function () {
    Route::get('/admin/users', function (Request $request) {
        return response()->json([
            'success' => true,
            'users' => \App\Models\User::all(['id', 'name', 'email', 'role', 'created_at'])
        ]);
    });
    
    Route::put('/admin/users/{user}/role', function (Request $request, \App\Models\User $user) {
        $request->validate([
            'role' => ['required', 'in:user,admin']
        ]);
        
        $user->update(['role' => $request->role]);
        
        return response()->json([
            'success' => true,
            'message' => 'User role updated successfully',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
            ]
        ]);
    });
    
    // Admin routes for meals management
    Route::post('/meals', [MealController::class, 'store']);
    Route::put('/meals/{meal}', [MealController::class, 'update']);
    Route::delete('/meals/{meal}', [MealController::class, 'destroy']);
    
    // Admin routes for orders management
    Route::get('/admin/orders', [OrderController::class, 'adminIndex']);
    Route::put('/admin/orders/{order}/status', [OrderController::class, 'updateStatus']);
});
