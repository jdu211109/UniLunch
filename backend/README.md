## Project Overview

UniLunch Backend - A Laravel 12 API backend for a university lunch management system with authentication and role-based access control.

## Essential Development Commands

### Initial Setup
```bash
composer install
npm install
cp .env.example .env
php artisan key:generate
touch database/database.sqlite
php artisan migrate
```

### Development
```bash
composer dev              # Runs all services concurrently (recommended)
php artisan serve        # Laravel server only (http://localhost:8000)
npm run dev              # Vite dev server for assets
```

### Testing
```bash
composer test            # Run all tests
php artisan test        # Alternative test command
```

### Code Quality
```bash
./vendor/bin/pint       # Format PHP code
./vendor/bin/pint --test # Check formatting without changes
```

### Database
```bash
php artisan migrate
php artisan migrate:fresh --seed
php artisan db:seed --class=AdminUserSeeder
```

### Production Build
```bash
npm run build
php artisan optimize
```

## Architecture Overview

### Authentication System
- **Laravel Sanctum** for API token authentication
- Tokens created with `createToken('API Token')` - no expiration
- Supports both token-based and stateful SPA authentication
- Key endpoints: `/api/register`, `/api/login`, `/api/logout`, `/api/logout-all`

### Role-Based Access Control
- Two roles: `user` (default) and `admin`
- Role stored as ENUM in users table
- Custom `CheckRole` middleware (aliased as 'role')
- User model methods: `isAdmin()`, `hasRole($role)`

### API Response Pattern
All API responses follow this structure:
```json
{
    "success": true/false,
    "message": "Operation message",
    "data": { ... }  // Optional
}
```

### Route Organization
1. **Public**: `/api/register`, `/api/login`
2. **Protected** (`auth:sanctum`): `/api/user`, `/api/logout`
3. **Admin** (`auth:sanctum`, `role:admin`): `/api/admin/users`, `/api/admin/users/{user}/role`

### Key Files
- **Controllers**: `app/Http/Controllers/` - AuthController handles authentication
- **Models**: `app/Models/User.php` - includes role-checking methods
- **Middleware**: `app/Http/Middleware/CheckRole.php` - role verification
- **Routes**: `routes/api.php` - all API endpoints
- **Config**: Uses SQLite database by default

### Development Patterns
- Direct controller logic (no service layer yet)
- Eloquent ORM without repository pattern
- Consistent JSON response structure
- Strong input validation on all endpoints
- Password security using Laravel's Password facade rules

## API Routes

### Public Routes (No Authentication Required)

| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|--------------|
| POST | `/api/register` | Register new user | `name`, `email`, `password`, `password_confirmation` |
| POST | `/api/login` | User authentication | `email`, `password` |

### Protected Routes (Require API Token)

| Method | Endpoint | Description | Headers |
|--------|----------|-------------|---------|
| GET | `/api/user` | Get current user info | `Authorization: Bearer {token}` |
| POST | `/api/logout` | Logout current session | `Authorization: Bearer {token}` |
| POST | `/api/logout-all` | Logout all user sessions | `Authorization: Bearer {token}` |

### Admin-Only Routes (Require Admin Role)

| Method | Endpoint | Description | Headers | Request Body |
|--------|----------|-------------|---------|--------------|
| GET | `/api/admin/users` | List all users | `Authorization: Bearer {admin_token}` | - |
| PUT | `/api/admin/users/{id}/role` | Update user role | `Authorization: Bearer {admin_token}` | `role: "user"\|"admin"` |

### Response Examples

**Successful Login/Register:**
```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  },
  "token": "1|abc123...",
  "token_type": "Bearer"
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Insufficient permissions."
}
```

### Test Accounts
- **Admin**: `admin@unilunch.com` / `password123`
- **User**: `user@unilunch.com` / `password123`

## Future Development Roadmap

### Phase 1: Core Lunch Management (Next Sprint)
- [ ] **Menu Management**
  - CRUD operations for daily menus
  - Menu categories (breakfast, lunch, dinner, snacks)
  - Nutritional information tracking
  - Price management

- [ ] **Order System**
  - Place lunch orders
  - Order history
  - Order status tracking (pending, confirmed, ready, completed)
  - Order cancellation (within time limits)

### Phase 2: Enhanced Features
- [ ] **Payment Integration**
  - Campus card/wallet system
  - Payment history
  - Balance management
  - Refund processing

- [ ] **Notification System**
  - Order confirmations
  - Menu updates
  - Special offers
  - Queue notifications

- [ ] **Queue Management**
  - Real-time queue status
  - Estimated pickup times
  - QR code pickup system

### Phase 3: Analytics & Optimization
- [ ] **Admin Dashboard**
  - Sales analytics
  - Popular items tracking
  - User behavior insights
  - Revenue reporting

- [ ] **Inventory Management**
  - Stock tracking
  - Low inventory alerts
  - Supplier management
  - Waste tracking

### Phase 4: Advanced Features
- [ ] **Multi-Location Support**
  - Multiple dining halls
  - Location-specific menus
  - Campus-wide ordering

- [ ] **Social Features**
  - User reviews and ratings
  - Menu recommendations
  - Group ordering
  - Favorite items

- [ ] **Mobile App Integration**
  - Push notifications
  - Offline mode
  - Biometric authentication
  - Campus integration

### Phase 5: Enterprise Features
- [ ] **Advanced Authentication**
  - SSO integration
  - Multi-factor authentication
  - Password reset via email
  - Account verification

- [ ] **Performance & Scalability**
  - API rate limiting
  - Database optimization
  - Caching layer (Redis)
  - Load balancing preparation

- [ ] **Security Enhancements**
  - API versioning
  - Request logging
  - Security headers
  - Vulnerability scanning

### Technical Debt & Improvements
- [ ] **Code Architecture**
  - Implement service layer pattern
  - Add repository pattern for complex queries
  - Create form request classes
  - Add API resources for response transformation

- [ ] **Testing**
  - Unit tests for all models
  - Feature tests for all endpoints
  - Integration tests
  - Performance testing

- [ ] **Documentation**
  - OpenAPI/Swagger documentation
  - Postman collection
  - Developer onboarding guide
  - API versioning strategy

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/lunch-orders`)
3. Commit changes (`git commit -am 'Add lunch ordering system'`)
4. Push to branch (`git push origin feature/lunch-orders`)
5. Create Pull Request

## Development Standards

- Follow PSR-12 coding standards
- Use Laravel best practices
- Write tests for new features
- Update documentation
- Use conventional commit messages