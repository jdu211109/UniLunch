<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Восстановление пароля - UniLunch</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f7f7f7;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 40px auto;
            background-color: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
            background: linear-gradient(135deg, #f97316 0%, #ef4444 100%);
            padding: 40px 30px;
            text-align: center;
        }
        .header h1 {
            color: #ffffff;
            margin: 0;
            font-size: 32px;
            font-weight: bold;
        }
        .content {
            padding: 40px 30px;
        }
        .content h2 {
            color: #1f2937;
            margin-top: 0;
            font-size: 24px;
        }
        .content p {
            color: #4b5563;
            margin: 15px 0;
            font-size: 16px;
        }
        .code-container {
            background: linear-gradient(135deg, #fef3c7 0%, #fed7aa 100%);
            border-radius: 8px;
            padding: 30px;
            text-align: center;
            margin: 30px 0;
            border: 2px solid #fb923c;
        }
        .code {
            font-size: 42px;
            font-weight: bold;
            color: #ea580c;
            letter-spacing: 8px;
            font-family: 'Courier New', monospace;
        }
        .expiry {
            background-color: #fef3c7;
            border-left: 4px solid #f59e0b;
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
        }
        .expiry p {
            margin: 0;
            color: #92400e;
            font-size: 14px;
        }
        .footer {
            background-color: #f9fafb;
            padding: 30px;
            text-align: center;
            color: #6b7280;
            font-size: 14px;
            border-top: 1px solid #e5e7eb;
        }
        .footer p {
            margin: 5px 0;
        }
        .warning {
            background-color: #fee2e2;
            border-left: 4px solid #ef4444;
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
        }
        .warning p {
            margin: 0;
            color: #991b1b;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>UniLunch</h1>
        </div>
        
        <div class="content">
            <h2>Восстановление пароля</h2>
            <p>Здравствуйте!</p>
            <p>Вы получили это письмо, потому что мы получили запрос на восстановление пароля для вашего аккаунта.</p>
            
            <div class="code-container">
                <p style="margin: 0 0 10px 0; color: #78350f; font-weight: 600;">Ваш код подтверждения:</p>
                <div class="code">{{ $code }}</div>
            </div>
            
            <div class="expiry">
                <p><strong>⏰ Важно:</strong> Этот код действителен в течение 10 минут.</p>
            </div>
            
            <p>Введите этот код на странице восстановления пароля, чтобы продолжить.</p>
            
            <div class="warning">
                <p><strong>⚠️ Не запрашивали восстановление пароля?</strong><br>
                Если вы не отправляли запрос на восстановление пароля, просто проигнорируйте это письмо. Ваш аккаунт в безопасности.</p>
            </div>
        </div>
        
        <div class="footer">
            <p><strong>UniLunch</strong></p>
            <p>Ваш умный помощник для заказа обедов</p>
            <p style="margin-top: 15px; font-size: 12px;">
                Это автоматическое письмо. Пожалуйста, не отвечайте на него.
            </p>
        </div>
    </div>
</body>
</html>
