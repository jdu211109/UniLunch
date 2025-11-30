<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'items',
        'total_price',
        'pickup_time',
        'payment_method',
        'status',
    ];

    protected $casts = [
        'items' => 'array',
        'total_price' => 'decimal:2',
    ];

    const STATUS_PENDING = 'pending';
    const STATUS_CONFIRMED = 'confirmed';
    const STATUS_COMPLETED = 'completed';
    const STATUS_CANCELLED = 'cancelled';

    const PAYMENT_CASH = 'cash';
    const PAYMENT_CARD = 'card';

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
