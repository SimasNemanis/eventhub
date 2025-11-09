# EventHub

A comprehensive event management and resource booking platform built with React and Node.js.

## Features

- **Event Management**: Create, browse, and register for events
- **Resource Booking**: Book rooms, equipment, and facilities
- **User Authentication**: Secure JWT-based authentication
- **Admin Dashboard**: Manage events, resources, and bookings
- **Analytics**: View statistics and insights
- **Calendar View**: Visualize events and bookings
- **Waiting Lists**: Join waiting lists for fully booked events
- **Ratings & Reviews**: Rate and review events

## Tech Stack

### Frontend
- React 18
- React Router v6
- TanStack Query (React Query)
- Axios
- Tailwind CSS
- Vite
- Lucide Icons
- Recharts (Analytics)
- date-fns

### Backend
- Node.js
- Express.js
- PostgreSQL
- JWT Authentication
- bcryptjs
- Nodemailer
- Multer (File uploads)

## Project Structure

```
eventhub/
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── client.js          # API client
│   │   ├── components/
│   │   │   ├── admin/             # Admin components
│   │   │   ├── ui/                # UI components
│   │   │   ├── EventCard.jsx
│   │   │   ├── ResourceCard.jsx
│   │   │   ├── BookingDialog.jsx
│   │   │   ├── Layout.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── contexts/
│   │   │   └── AuthContext.jsx    # Authentication context
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Events.jsx
│   │   │   ├── Resources.jsx
│   │   │   ├── MyBookings.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── CalendarView.jsx
│   │   │   ├── Analytics.jsx
│   │   │   ├── Admin.jsx
│   │   │   ├── Landing.jsx
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   ├── utils/
│   │   │   └── navigation.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
└── backend/
    ├── config/
    │   ├── database.js
    │   ├── jwt.js
    │   └── email.js
    ├── controllers/
    │   ├── authController.js
    │   ├── eventController.js
    │   ├── resourceController.js
    │   ├── bookingController.js
    │   ├── ratingController.js
    │   ├── waitingListController.js
    │   └── userController.js
    ├── middleware/
    │   ├── auth.js
    │   ├── errorHandler.js
    │   ├── validate.js
    │   └── upload.js
    ├── models/
    │   ├── Event.js
    │   ├── Resource.js
    │   ├── Booking.js
    │   ├── Rating.js
    │   ├── WaitingList.js
    │   └── User.js
    ├── routes/
    │   ├── auth.js
    │   ├── events.js
    │   ├── resources.js
    │   ├── bookings.js
    │   ├── ratings.js
    │   ├── waitingList.js
    │   └── users.js
    ├── services/
    │   ├── conflictService.js
    │   ├── recurringEventService.js
    │   ├── notificationService.js
    │   └── waitingListService.js
    ├── utils/
    │   ├── validations.js
    │   ├── helpers.js
    │   └── constants.js
    ├── database/
    │   └── schema.sql
    ├── server.js
    └── package.json
```

## Setup Instructions

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a PostgreSQL database:
   ```bash
   createdb eventhub
   ```

4. Set up the database schema:
   ```bash
   psql -d eventhub -f database/schema.sql
   ```

5. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```

6. Configure your environment variables in `.env`:
   ```env
   PORT=5000
   NODE_ENV=development
   
   DATABASE_URL=postgresql://username:password@localhost:5432/eventhub
   
   JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_min_32_chars
   JWT_EXPIRE=7d
   
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASSWORD=your-app-password
   EMAIL_FROM=EventHub <noreply@eventhub.com>
   
   FRONTEND_URL=http://localhost:3000
   ```

7. Start the backend server:
   ```bash
   npm run dev
   ```

   The API will be available at `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file:
   ```bash
   cp .env.example .env
   ```

4. Configure the API URL in `.env`:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:3000`

### Default Admin Account

After setting up the database, you can create an admin account by registering through the UI and then manually updating the user role in the database:

```sql
UPDATE users SET role = 'admin' WHERE email = 'your-email@example.com';
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/me` - Update user profile
- `POST /api/auth/logout` - Logout user

### Events
- `GET /api/events` - List all events
- `GET /api/events/:id` - Get event by ID
- `POST /api/events` - Create event (admin only)
- `PUT /api/events/:id` - Update event (admin only)
- `DELETE /api/events/:id` - Delete event (admin only)

### Resources
- `GET /api/resources` - List all resources
- `GET /api/resources/:id` - Get resource by ID
- `POST /api/resources` - Create resource (admin only)
- `PUT /api/resources/:id` - Update resource (admin only)
- `DELETE /api/resources/:id` - Delete resource (admin only)

### Bookings
- `GET /api/bookings` - List all bookings
- `GET /api/bookings/:id` - Get booking by ID
- `POST /api/bookings` - Create booking
- `PUT /api/bookings/:id` - Update booking
- `DELETE /api/bookings/:id` - Delete booking

### Ratings
- `GET /api/ratings` - List all ratings
- `POST /api/ratings` - Create rating
- `PUT /api/ratings/:id` - Update rating
- `DELETE /api/ratings/:id` - Delete rating

### Waiting List
- `GET /api/waiting-list` - List waiting list entries
- `POST /api/waiting-list` - Join waiting list
- `DELETE /api/waiting-list/:id` - Leave waiting list

## Deployment

### VPS Deployment (Backend + Database)

The recommended architecture is to host the backend and PostgreSQL database together on a VPS (e.g., Hetzner, DigitalOcean).

#### 1. Prepare VPS

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Install PM2 for process management
sudo npm install -g pm2

# Install Nginx
sudo apt install -y nginx
```

#### 2. Setup PostgreSQL

```bash
# Switch to postgres user
sudo -u postgres psql

# Create database and user
CREATE DATABASE eventhub;
CREATE USER eventhub_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE eventhub TO eventhub_user;
\q
```

#### 3. Deploy Backend

```bash
# Clone repository
git clone <your-repo-url>
cd eventhub/backend

# Install dependencies
npm install --production

# Setup environment variables
cp .env.example .env
nano .env  # Edit with production values

# Run database migrations
psql -U eventhub_user -d eventhub -f database/schema.sql

# Start with PM2
pm2 start server.js --name eventhub-api
pm2 save
pm2 startup
```

#### 4. Configure Nginx

Create `/etc/nginx/sites-available/eventhub`:

```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/eventhub /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### 5. Setup SSL with Let's Encrypt

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d api.yourdomain.com
```

### Frontend Deployment (Vercel)

The frontend can be deployed separately on Vercel for optimal performance.

#### 1. Prepare for Deployment

Update `frontend/.env.production`:
```env
VITE_API_URL=https://api.yourdomain.com/api
```

#### 2. Deploy to Vercel

```bash
cd frontend

# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

Or connect your GitHub repository to Vercel for automatic deployments.

### Alternative: Docker Deployment

Docker Compose files are provided for containerized deployment.

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## Environment Variables

### Backend (.env)

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment | `production` |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@localhost:5432/eventhub` |
| `JWT_SECRET` | Secret for JWT signing | `your_secret_key_min_32_chars` |
| `JWT_EXPIRE` | JWT expiration time | `7d` |
| `SMTP_HOST` | SMTP server host | `smtp.gmail.com` |
| `SMTP_PORT` | SMTP server port | `587` |
| `SMTP_USER` | SMTP username | `your-email@gmail.com` |
| `SMTP_PASSWORD` | SMTP password | `your-app-password` |
| `EMAIL_FROM` | From email address | `EventHub <noreply@eventhub.com>` |
| `FRONTEND_URL` | Frontend URL for CORS | `https://yourdomain.com` |

### Frontend (.env)

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `https://api.yourdomain.com/api` |

## Development

### Running Tests

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

### Code Formatting

```bash
# Backend
cd backend
npm run lint

# Frontend
cd frontend
npm run lint
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For issues and questions, please open an issue on GitHub.
