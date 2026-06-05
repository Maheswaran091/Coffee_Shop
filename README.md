# BrewHaven ☕ — Full-Stack Coffee Shop Web Application

A complete coffee shop web application with React frontend, Django REST API backend, and MySQL database.

---

## 🗂 Project Structure

```
coffeeshop_project/
├── backend/               # Django REST API
│   ├── api/               # Main app (models, views, serializers)
│   ├── coffeeshop_backend/ # Project settings & urls
│   ├── manage.py
│   └── requirements.txt
└── frontend/              # React Application
    ├── src/
    │   ├── pages/         # All page components
    │   ├── components/    # Reusable components (Navbar, Footer, MenuCard)
    │   ├── context/       # Auth & Cart context
    │   ├── styles/        # Global CSS
    │   └── api.js         # Axios API config
    └── package.json
```

---

## ⚙️ Backend Setup (Django)

### 1. Prerequisites
- Python 3.9+
- MySQL 8.0+

### 2. Create MySQL Database
```sql
CREATE DATABASE coffeeshop_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 3. Install Python Dependencies
```bash
cd backend
pip install -r requirements.txt
```

### 4. Configure Database
Edit `coffeeshop_backend/settings.py`:
```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'coffeeshop_db',
        'USER': 'root',
        'PASSWORD': 'YOUR_MYSQL_PASSWORD',  # ← change this
        'HOST': 'localhost',
        'PORT': '3306',
    }
}
```
> **Using SQLite instead?** Comment out the MySQL block and uncomment the SQLite block in settings.py — no extra setup needed!

### 5. Run Migrations
```bash
python manage.py makemigrations
python manage.py migrate
```

### 6. Seed Sample Data
```bash
python manage.py seed_data
```
This creates:
- 6 categories (Coffee, Cookies, Cakes, Biscuits, Snacks, Beverages)
- 33 menu items with full details
- 12 tables (Window, Indoor, Outdoor, Conference)
- 3 active offers with promo codes
- Admin user: `admin` / `admin123`
- Demo user: `demo` / `demo123`

### 7. Start Backend Server
```bash
python manage.py runserver
```
API runs at: **http://localhost:8000**
Admin panel: **http://localhost:8000/admin/**

---

## 🎨 Frontend Setup (React)

### 1. Prerequisites
- Node.js 16+

### 2. Install Dependencies
```bash
cd frontend
npm install
```

### 3. Start Frontend
```bash
npm start
```
App runs at: **http://localhost:3000**

---

## 🔑 Default Login Credentials

| User  | Username | Password  | Role  |
|-------|----------|-----------|-------|
| Admin | `admin`  | `admin123`| Staff |
| Demo  | `demo`   | `demo123` | User  |

---

## 🚀 Features

### Customer Features
- **Authentication** — Register, Login, JWT token auth, auto-refresh
- **Home Page** — Hero section, featured items, category grid, offers, why us
- **Menu** — Browse all items with filters (category, search, veg-only)
- **Cart** — Add/remove/update items, order type (Dine-in/Takeaway/Delivery)
- **Order Placement** — Full order with payment method selection, tax calculation
- **My Orders** — View order history, expandable details, cancel orders
- **Table Booking** — Book tables with date/time/guests, see table features
- **My Bookings** — View & cancel bookings
- **Offers Page** — View promo codes, copy with one click
- **Contact** — Send messages (stored in DB)
- **Profile** — Update phone, address, view loyalty points

### Admin Features (Django Admin Panel)
- Manage menu items, categories, tables
- View all orders, bookings, contact messages
- Manage users, offers

---

## 📡 API Endpoints

| Method | URL | Auth | Description |
|--------|-----|------|-------------|
| POST | `/api/auth/register/` | No | Register |
| POST | `/api/auth/login/` | No | Login |
| GET/PUT | `/api/auth/profile/` | Yes | Profile |
| GET | `/api/categories/` | No | Categories |
| GET | `/api/menu/` | No | Menu items |
| GET | `/api/tables/` | No | Tables |
| GET/POST | `/api/bookings/` | Yes | Bookings |
| GET/POST | `/api/orders/` | Yes | Orders |
| GET | `/api/offers/` | No | Offers |
| POST | `/api/contact/` | No | Contact |

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Router v6, Axios |
| Backend | Django 4.2, Django REST Framework |
| Auth | JWT (djangorestframework-simplejwt) |
| Database | MySQL 8.0 (SQLite supported) |
| Styling | Pure CSS with CSS variables |

---

## 💡 Quick Test

1. Start both servers (backend on :8000, frontend on :3000)
2. Open http://localhost:3000
3. Login with `demo` / `demo123`
4. Browse menu → add to cart → place order
5. Book a table via "Book a Table"
6. Check your orders at "My Orders"
