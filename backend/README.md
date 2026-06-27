# EcomX Backend — Flask API

## Quick Start

```bash
cd backend
pip install -r requirements.txt
python app.py
```

Server starts at **http://localhost:5000**
- Frontend is served at `/`
- API is at `/api/`

## Demo Accounts
| Role     | Email                  | Password |
|----------|------------------------|----------|
| Customer | customer@ecomx.com     | pass123  |
| Seller   | seller@ecomx.com       | pass123  |
| Admin    | admin@ecomx.com        | pass123  |

## API Reference

### Auth  `/api/auth`
| Method | Path        | Description            | Auth |
|--------|-------------|------------------------|------|
| POST   | /register   | Create account         | No   |
| POST   | /login      | Login → returns JWT    | No   |
| GET    | /me         | Current user info      | Yes  |
| POST   | /logout     | (client discards JWT)  | No   |

### Products  `/api/products`
| Method | Path        | Description                  | Auth         |
|--------|-------------|------------------------------|--------------|
| GET    | /           | List all (with filters)      | No           |
| GET    | /:id        | Single product               | No           |
| GET    | /my         | Seller's own products        | Seller/Admin |
| POST   | /           | Create product               | Seller/Admin |
| PUT    | /:id        | Update product               | Seller/Admin |
| DELETE | /:id        | Soft-delete product          | Seller/Admin |

**Query params for GET /:** `cat`, `search`, `min_price`, `max_price`, `min_rating`, `in_stock=1`, `on_sale=1`, `sort` (price_asc / price_desc / rating / popular)

### Cart  `/api/cart`
| Method | Path    | Description      | Auth |
|--------|---------|------------------|------|
| GET    | /       | Get cart         | Yes  |
| POST   | /       | Add item         | Yes  |
| PUT    | /:id    | Update quantity  | Yes  |
| DELETE | /:id    | Remove item      | Yes  |
| DELETE | /       | Clear cart       | Yes  |

### Orders  `/api/orders`
| Method | Path           | Description            | Auth     |
|--------|----------------|------------------------|----------|
| POST   | /              | Place order from cart  | Customer |
| GET    | /              | List orders (by role)  | Yes      |
| GET    | /:id           | Order details          | Yes      |
| PUT    | /:id/status    | Update status          | Seller/Admin |

### Admin  `/api/admin`
| Method | Path                    | Description           | Auth  |
|--------|-------------------------|-----------------------|-------|
| GET    | /stats                  | Platform statistics   | Admin |
| GET    | /users                  | All users             | Admin |
| PUT    | /users/:id              | Update user           | Admin |
| GET    | /products               | All products          | Admin |
| PUT    | /products/:id/approve   | Approve/reject        | Admin |
| GET    | /orders                 | All orders            | Admin |
| PUT    | /orders/:id/status      | Update order status   | Admin |

## Database
SQLite by default (`backend/ecomx.db`). To use MySQL, set env var:
```
DATABASE_URL=mysql+pymysql://user:pass@localhost/ecomx
```
Then add `PyMySQL` to requirements.txt.
