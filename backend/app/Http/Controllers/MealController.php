<?php

namespace App\Http\Controllers;

use App\Models\Meal;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class MealController extends Controller
{
    /**
     * Display a listing of all meals (visible to everyone).
     */
    public function index()
    {
        $meals = Meal::orderBy('created_at', 'desc')->get();
        
        return response()->json([
            'success' => true,
            'meals' => $meals
        ]);
    }

    /**
     * Store a newly created meal (admin only).
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'image_url' => 'nullable|string',
            'category' => 'required|in:set,main,salad,soup,dessert,drink,extra',
            'is_vegetarian' => 'boolean',
            'is_spicy' => 'boolean',
            'is_available' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $meal = Meal::create($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Meal created successfully',
            'meal' => $meal
        ], 201);
    }

    /**
     * Display the specified meal.
     */
    public function show(Meal $meal)
    {
        return response()->json([
            'success' => true,
            'meal' => $meal
        ]);
    }

    /**
     * Update the specified meal (admin only).
     */
    public function update(Request $request, Meal $meal)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'sometimes|required|numeric|min:0',
            'image_url' => 'nullable|string',
            'category' => 'sometimes|required|in:set,main,salad,soup,dessert,drink,extra',
            'is_vegetarian' => 'boolean',
            'is_spicy' => 'boolean',
            'is_available' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $meal->update($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Meal updated successfully',
            'meal' => $meal
        ]);
    }

    /**
     * Remove the specified meal (admin only).
     */
    public function destroy(Meal $meal)
    {
        $meal->delete();

        return response()->json([
            'success' => true,
            'message' => 'Meal deleted successfully'
        ]);
    }

    /**
     * Get available categories.
     */
    public function categories()
    {
        return response()->json([
            'success' => true,
            'categories' => Meal::CATEGORIES
        ]);
    }
}
