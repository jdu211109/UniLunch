<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\Rules\Password;
use App\Models\User;
use Carbon\Carbon;

class PasswordResetController extends Controller
{
    /**
     * Send password reset code to user's email.
     */
    public function sendResetCode(Request $request): JsonResponse
    {
        $request->validate([
            'email' => ['required', 'email'],
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            // Don't reveal if user exists or not for security
            return response()->json([
                'success' => true,
                'message' => 'Если аккаунт с таким email существует, код был отправлен.'
            ], 200);
        }

        // Generate 6-digit code
        $code = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);
        
        // Delete old tokens for this email
        DB::table('password_reset_tokens')
            ->where('email', $request->email)
            ->delete();

        // Store new token (expires in 10 minutes)
        DB::table('password_reset_tokens')->insert([
            'email' => $request->email,
            'token' => Hash::make($code),
            'expires_at' => Carbon::now()->addMinutes(10),
            'created_at' => Carbon::now(),
        ]);

        // Send email with code
        try {
            Mail::send('emails.reset-password', ['code' => $code], function ($message) use ($request) {
                $message->to($request->email)
                    ->subject('Код восстановления пароля - UniLunch');
            });
        } catch (\Exception $e) {
            \Log::error('Failed to send password reset email: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Не удалось отправить email. Попробуйте позже.'
            ], 500);
        }

        return response()->json([
            'success' => true,
            'message' => 'Код подтверждения отправлен на ваш email'
        ], 200);
    }

    /**
     * Verify the reset code.
     */
    public function verifyResetCode(Request $request): JsonResponse
    {
        $request->validate([
            'email' => ['required', 'email'],
            'code' => ['required', 'string', 'size:6'],
        ]);

        $resetRecord = DB::table('password_reset_tokens')
            ->where('email', $request->email)
            ->first();

        if (!$resetRecord) {
            return response()->json([
                'success' => false,
                'message' => 'Неверный или истекший код'
            ], 400);
        }

        // Check if token expired
        if (Carbon::parse($resetRecord->expires_at)->isPast()) {
            DB::table('password_reset_tokens')
                ->where('email', $request->email)
                ->delete();
                
            return response()->json([
                'success' => false,
                'message' => 'Код истек. Запросите новый код.'
            ], 400);
        }

        // Verify code
        if (!Hash::check($request->code, $resetRecord->token)) {
            return response()->json([
                'success' => false,
                'message' => 'Неверный код'
            ], 400);
        }

        return response()->json([
            'success' => true,
            'message' => 'Код подтвержден'
        ], 200);
    }

    /**
     * Reset password using verified code.
     */
    public function resetPassword(Request $request): JsonResponse
    {
        $request->validate([
            'email' => ['required', 'email'],
            'code' => ['required', 'string', 'size:6'],
            'password' => ['required', 'confirmed', Password::defaults()],
        ]);

        $resetRecord = DB::table('password_reset_tokens')
            ->where('email', $request->email)
            ->first();

        if (!$resetRecord) {
            return response()->json([
                'success' => false,
                'message' => 'Неверный или истекший код'
            ], 400);
        }

        // Check if token expired
        if (Carbon::parse($resetRecord->expires_at)->isPast()) {
            DB::table('password_reset_tokens')
                ->where('email', $request->email)
                ->delete();
                
            return response()->json([
                'success' => false,
                'message' => 'Код истек. Запросите новый код.'
            ], 400);
        }

        // Verify code
        if (!Hash::check($request->code, $resetRecord->token)) {
            return response()->json([
                'success' => false,
                'message' => 'Неверный код'
            ], 400);
        }

        // Update user's password
        $user = User::where('email', $request->email)->first();
        
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Пользователь не найден'
            ], 404);
        }

        $user->update([
            'password' => Hash::make($request->password)
        ]);

        // Delete used token
        DB::table('password_reset_tokens')
            ->where('email', $request->email)
            ->delete();

        // Optionally, revoke all user tokens for security
        $user->tokens()->delete();

        return response()->json([
            'success' => true,
            'message' => 'Пароль успешно изменен'
        ], 200);
    }
}
