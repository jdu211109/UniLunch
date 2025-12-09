<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Meal extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'price',
        'image_url',
        'category',
        'is_vegetarian',
        'is_spicy',
        'is_available',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'is_vegetarian' => 'boolean',
        'is_spicy' => 'boolean',
        'is_available' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Allowed meal categories
     */
    const CATEGORIES = [
        'set' => 'Сет',
        'main' => 'Блюда',
        'salad' => 'Салаты',
        'soup' => 'Суп/Самса',
        'dessert' => 'Десерты',
        'drink' => 'Напиток',
        'extra' => 'Дополнительно',
    ];

    /**
     * Get the category name in Russian
     */
    public function getCategoryNameAttribute()
    {
        return self::CATEGORIES[$this->category] ?? $this->category;
    }
}
