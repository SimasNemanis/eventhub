# EventHub Deployment Guide

This guide covers deploying EventHub to a VPS with the recommended architecture:
- **Backend + PostgreSQL**: Hosted together on VPS (e.g., Hetzner, DigitalOcean)
- **Frontend**: Deployed separately on Vercel

## Prerequisites

- VPS with Ubuntu 22.04 or later
- Domain name with DNS configured
- GitHub account (for Vercel deployment)

## Part 1: VPS Setup (Backend + Database)

### 1.1 Initial Server Setup

```bash
# SSH into your VPS
ssh root@your-vps-ip

# Update system packages
sudo apt update && sudo apt upgrade -y

# Create a non-root user
sudo adduser eventhub
sudo usermod -aG sudo eventhub

# Switch to new user
su - eventhub
```

### 1.2 Install Required Software

```bash
# Install Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Verify installation
node --version
npm --version

# Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Install PM2 (process manager)
sudo npm install -g pm2

# Install Nginx (reverse proxy)
sudo apt install -y nginx

# Install Git
sudo apt install -y git
```

### 1.3 Configure PostgreSQL

```bash
# Switch to postgres user
sudo -u postgres psql

# In PostgreSQL prompt, create database and user:
CREATE DATABASE eventhub;
CREATE USER eventhub_user WITH PASSWORD 'your_secure_password_here';
GRANT ALL PRIVILEGES ON DATABASE eventhub TO eventhub_user;
\q

# Test connection
psql -U eventhub_user -d eventhub -h localhost
```

### 1.4 Deploy Backend Application

```bash
# Clone your repository
cd ~
git clone https://github.com/yourusername/eventhub.git
cd eventhub/backend

# Install dependencies
npm install --production

# Create .env file
cp .env.example .env
nano .env
```

Configure your `.env` file:
```env
PORT=5000
NODE_ENV=production

DATABASE_URL=postgresql://eventhub_user:your_secure_password_here@localhost:5432/eventhub

JWT_SECRET=generate_a_secure_random_string_min_32_characters
JWT_EXPIRE=7d

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-gmail-app-password
EMAIL_FROM=EventHub <noreply@yourdomain.com>

UPLOAD_PATH=./uploads
MAX_FILE_SIZE=5242880

FRONTEND_URL=https://yourdomain.com
```

```bash
# Initialize database schema
psql -U eventhub_user -d eventhub -h localhost -f database/schema.sql

# Test the application
npm start

# If it works, stop it (Ctrl+C) and start with PM2
pm2 start server.js --name eventhub-api
pm2 save
pm2 startup
# Follow the instructions from the startup command

# Check status
pm2 status
pm2 logs eventhub-api
```

### 1.5 Configure Nginx as Reverse Proxy

```bash
# Create Nginx configuration
sudo nano /etc/nginx/sites-available/eventhub-api
```

Add the following configuration:
```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Proxy to Node.js backend
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

    # Increase upload size limit
    client_max_body_size 10M;
}
```

```bash
# Enable the site
sudo ln -s /etc/nginx/sites-available/eventhub-api /etc/nginx/sites-enabled/

# Test Nginx configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx

# Enable Nginx to start on boot
sudo systemctl enable nginx
```

### 1.6 Setup SSL with Let's Encrypt

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Obtain SSL certificate
sudo certbot --nginx -d api.yourdomain.com

# Test automatic renewal
sudo certbot renew --dry-run
```

### 1.7 Configure Firewall

```bash
# Enable UFW firewall
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable

# Check status
sudo ufw status
```

### 1.8 Create Admin User

```bash
# Connect to database
psql -U eventhub_user -d eventhub -h localhost

# After registering through the UI, update user role:
UPDATE users SET role = 'admin' WHERE email = 'your-admin-email@example.com';
\q
```

## Part 2: Frontend Deployment (Vercel)

### 2.1 Prepare Frontend for Deployment

1. Push your code to GitHub:
```bash
cd ~/eventhub
git add .
git commit -m "Prepare for deployment"
git push origin main
```

2. Create production environment file:
```bash
cd frontend
# Create .env.production (this will be configured in Vercel)
```

### 2.2 Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub

2. Click "Add New Project"

3. Import your GitHub repository

4. Configure the project:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

5. Add Environment Variables:
   - `VITE_API_URL`: `https://api.yourdomain.com/api`

6. Click "Deploy"

7. Once deployed, configure custom domain (optional):
   - Go to Project Settings → Domains
   - Add your domain (e.g., `yourdomain.com`)
   - Update DNS records as instructed

### 2.3 Update Backend CORS

Update the `FRONTEND_URL` in your backend `.env`:
```bash
ssh eventhub@your-vps-ip
cd ~/eventhub/backend
nano .env
```

Change:
```env
FRONTEND_URL=https://yourdomain.com
```

Restart the backend:
```bash
pm2 restart eventhub-api
```

## Part 3: Maintenance

### Monitoring

```bash
# View backend logs
pm2 logs eventhub-api

# Monitor system resources
pm2 monit

# Check Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### Updating the Application

```bash
# Backend updates
cd ~/eventhub/backend
git pull origin main
npm install --production
pm2 restart eventhub-api

# Database migrations (if needed)
psql -U eventhub_user -d eventhub -h localhost -f database/migrations/new_migration.sql
```

For frontend updates, simply push to GitHub and Vercel will automatically redeploy.

### Backup Database

```bash
# Create backup script
nano ~/backup-db.sh
```

Add:
```bash
#!/bin/bash
BACKUP_DIR="$HOME/backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
mkdir -p $BACKUP_DIR

pg_dump -U eventhub_user -d eventhub -h localhost > "$BACKUP_DIR/eventhub_$TIMESTAMP.sql"

# Keep only last 7 days of backups
find $BACKUP_DIR -name "eventhub_*.sql" -mtime +7 -delete

echo "Backup completed: eventhub_$TIMESTAMP.sql"
```

```bash
# Make executable
chmod +x ~/backup-db.sh

# Add to crontab (daily at 2 AM)
crontab -e
```

Add line:
```
0 2 * * * /home/eventhub/backup-db.sh
```

### Security Best Practices

1. **Keep software updated**:
```bash
sudo apt update && sudo apt upgrade -y
```

2. **Monitor failed login attempts**:
```bash
sudo tail -f /var/log/auth.log
```

3. **Use strong passwords** for database and JWT secrets

4. **Regularly review PM2 logs** for errors

5. **Set up monitoring** (optional):
   - Use services like UptimeRobot for uptime monitoring
   - Configure PM2 Plus for advanced monitoring

## Alternative: Docker Deployment

If you prefer Docker, you can use the provided `docker-compose.yml`:

```bash
# Install Docker and Docker Compose
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Install Docker Compose
sudo apt install -y docker-compose

# Deploy
cd ~/eventhub
cp .env.example .env
nano .env  # Configure variables

docker-compose up -d

# View logs
docker-compose logs -f

# Update
git pull origin main
docker-compose down
docker-compose up -d --build
```

## Troubleshooting

### Backend not starting
```bash
pm2 logs eventhub-api --lines 100
# Check for errors in environment variables or database connection
```

### Database connection issues
```bash
# Test connection
psql -U eventhub_user -d eventhub -h localhost

# Check PostgreSQL status
sudo systemctl status postgresql
```

### Nginx errors
```bash
# Test configuration
sudo nginx -t

# Check error logs
sudo tail -f /var/log/nginx/error.log
```

### CORS errors
- Ensure `FRONTEND_URL` in backend `.env` matches your Vercel domain
- Check browser console for specific CORS error messages

## Cost Estimation

**VPS (Hetzner CPX11)**:
- 2 vCPU, 2GB RAM, 40GB SSD
- ~€4.50/month

**Vercel**:
- Free tier (sufficient for most projects)
- Pro: $20/month (if needed)

**Domain**:
- ~$10-15/year

**Total**: ~€5-7/month for small to medium traffic

## Support

For issues:
1. Check logs: `pm2 logs eventhub-api`
2. Review Nginx logs: `sudo tail -f /var/log/nginx/error.log`
3. Check database: `psql -U eventhub_user -d eventhub`
4. Open GitHub issue with error details
