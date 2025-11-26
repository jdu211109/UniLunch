<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Check if table exists and drop it to recreate with our structure
        if (Schema::hasTable('password_reset_tokens')) {
            Schema::drop('password_reset_tokens');
        }
        
        Schema::create('password_reset_tokens', function (Blueprint $table) {
            $table->id();
            $table->string('email')->index();
            $table->string('token', 6);
            $table->timestamp('expires_at');
            $table->timestamp('created_at')->useCurrent();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('password_reset_tokens');
    }
};
