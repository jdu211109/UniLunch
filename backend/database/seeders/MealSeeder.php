<?php

namespace Database\Seeders;

use App\Models\Meal;
use Illuminate\Database\Seeder;

class MealSeeder extends Seeder
{
    public function run(): void
    {
        $meals = [
            // Mains
            [
                'name' => 'Spicy Thai Curry Tofu',
                'description' => 'Crispy tofu cubes in a rich, spicy Thai red curry with bamboo shoots, bell peppers, and Thai basil. Served with jasmine rice.',
                'price' => 10.99,
                'image_url' => 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=400&h=300&fit=crop',
                'category' => 'main',
                'is_vegetarian' => true,
                'is_spicy' => true,
            ],
            [
                'name' => 'Classic Burger',
                'description' => 'Juicy beef patty with lettuce, tomato, and special sauce',
                'price' => 12.99,
                'image_url' => 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop',
                'category' => 'main',
                'is_vegetarian' => false,
                'is_spicy' => false,
            ],
            [
                'name' => 'Grilled Chicken Breast',
                'description' => 'Tender grilled chicken breast served with steamed vegetables and mashed potatoes.',
                'price' => 14.50,
                'image_url' => 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=400&h=300&fit=crop',
                'category' => 'main',
                'is_vegetarian' => false,
                'is_spicy' => false,
            ],
            [
                'name' => 'Pasta Carbonara',
                'description' => 'Classic Italian pasta with creamy egg sauce, pancetta, and parmesan cheese.',
                'price' => 13.90,
                'image_url' => 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=400&h=300&fit=crop',
                'category' => 'main',
                'is_vegetarian' => false,
                'is_spicy' => false,
            ],
            [
                'name' => 'Beef Stir Fry',
                'description' => 'Slices of beef stir-fried with broccoli, carrots, and snap peas in a savory soy-ginger sauce.',
                'price' => 15.00,
                'image_url' => 'https://images.unsplash.com/photo-1527224538127-6deb285516a1?w=400&h=300&fit=crop',
                'category' => 'main',
                'is_vegetarian' => false,
                'is_spicy' => false,
            ],
            
            // Salads
            [
                'name' => 'Caesar Salad',
                'description' => 'Crisp romaine lettuce with croutons, parmesan cheese, and Caesar dressing.',
                'price' => 8.50,
                'image_url' => 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=400&h=300&fit=crop',
                'category' => 'salad',
                'is_vegetarian' => true,
                'is_spicy' => false,
            ],
            [
                'name' => 'Greek Salad',
                'description' => 'Fresh cucumbers, tomatoes, red onion, kalamata olives, and feta cheese with oregano.',
                'price' => 9.00,
                'image_url' => 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&h=300&fit=crop',
                'category' => 'salad',
                'is_vegetarian' => true,
                'is_spicy' => false,
            ],
            [
                'name' => 'Quinoa Avocado Salad',
                'description' => 'Healthy quinoa salad with avocado, cherry tomatoes, and lemon vinaigrette.',
                'price' => 11.50,
                'image_url' => 'https://images.unsplash.com/photo-1615486511484-92e172cc4fe0?w=400&h=300&fit=crop',
                'category' => 'salad',
                'is_vegetarian' => true,
                'is_spicy' => false,
            ],

            // Soups
            [
                'name' => 'Tomato Basil Soup',
                'description' => 'Rich and creamy tomato soup garnished with fresh basil.',
                'price' => 6.50,
                'image_url' => 'https://images.unsplash.com/photo-1547592166-23acbe346499?w=400&h=300&fit=crop',
                'category' => 'soup',
                'is_vegetarian' => true,
                'is_spicy' => false,
            ],
            [
                'name' => 'Miso Soup',
                'description' => 'Traditional Japanese soybean paste soup with tofu, seaweed, and green onions.',
                'price' => 4.50,
                'image_url' => 'https://images.unsplash.com/photo-1547592180-85f173990554?w=400&h=300&fit=crop',
                'category' => 'soup',
                'is_vegetarian' => true,
                'is_spicy' => false,
            ],
            [
                'name' => 'Chicken Noodle Soup',
                'description' => 'Comforting chicken broth with egg noodles, carrots, and celery.',
                'price' => 7.00,
                'image_url' => 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=400&h=300&fit=crop',
                'category' => 'soup',
                'is_vegetarian' => false,
                'is_spicy' => false,
            ],

            // Desserts
            [
                'name' => 'Chocolate Brownie',
                'description' => 'Warm, fudgy chocolate brownie served with a scoop of vanilla ice cream.',
                'price' => 5.50,
                'image_url' => 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&h=300&fit=crop',
                'category' => 'dessert',
                'is_vegetarian' => true,
                'is_spicy' => false,
            ],
            [
                'name' => 'Cheesecake',
                'description' => 'Classic New York style cheesecake with a strawberry topping.',
                'price' => 6.00,
                'image_url' => 'https://images.unsplash.com/photo-1524351199678-c41988e044f9?w=400&h=300&fit=crop',
                'category' => 'dessert',
                'is_vegetarian' => true,
                'is_spicy' => false,
            ],
            [
                'name' => 'Fruit Tart',
                'description' => 'Crispy tart shell filled with custard and topped with fresh seasonal fruits.',
                'price' => 5.00,
                'image_url' => 'https://images.unsplash.com/photo-1519915093369-e0b6c4180dce?w=400&h=300&fit=crop',
                'category' => 'dessert',
                'is_vegetarian' => true,
                'is_spicy' => false,
            ],

            // Drinks
            [
                'name' => 'Fresh Lemonade',
                'description' => 'Squeezed fresh daily with a hint of mint.',
                'price' => 3.50,
                'image_url' => 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=400&h=300&fit=crop',
                'category' => 'drink',
                'is_vegetarian' => true,
                'is_spicy' => false,
            ],
            [
                'name' => 'Iced Coffee',
                'description' => 'Cold brew coffee served over ice with milk.',
                'price' => 4.00,
                'image_url' => 'https://images.unsplash.com/photo-1517701604599-bb29b5c7355c?w=400&h=300&fit=crop',
                'category' => 'drink',
                'is_vegetarian' => true,
                'is_spicy' => false,
            ],
            [
                'name' => 'Green Tea',
                'description' => 'Hot premium Japanese green tea.',
                'price' => 2.50,
                'image_url' => 'https://images.unsplash.com/photo-1627435601361-ec25f5b1d0e5?w=400&h=300&fit=crop',
                'category' => 'drink',
                'is_vegetarian' => true,
                'is_spicy' => false,
            ],
             [
                'name' => 'Mango Lassi',
                'description' => 'Creamy yogurt-based drink with mango pulp.',
                'price' => 4.50,
                'image_url' => 'https://images.unsplash.com/photo-1543362906-ac1b452601d8?w=400&h=300&fit=crop',
                'category' => 'drink',
                'is_vegetarian' => true,
                'is_spicy' => false,
            ],
        ];

        foreach ($meals as $meal) {
            Meal::create($meal);
        }
    }
}
