# Deployment Guide

## Production Deployment

### Prerequisites
- Linux server (Ubuntu 20.04+ recommended)
- PostgreSQL 12+
- Python 3.8+
- Nginx (recommended)
- SSL certificate

### Step 1: Server Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install required packages
sudo apt install -y python3 python3-pip python3-venv postgresql postgresql-contrib nginx certbot python3-certbot-nginx
```

### Step 2: Database Setup

```bash
# Switch to postgres user
sudo -u postgres psql

# Create database and user
CREATE DATABASE bythepowerofmemory;
CREATE USER bythepowerofmemory WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE bythepowerofmemory TO bythepowerofmemory;
\q
```

### Step 3: Application Setup

```bash
# Create application directory
sudo mkdir -p /opt/bythepowerofmemory
sudo chown $USER:$USER /opt/bythepowerofmemory
cd /opt/bythepowerofmemory

# Clone repository
git clone <your-repo-url> .

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
pip install gunicorn
```

### Step 4: Environment Configuration

```bash
# Create .env file
nano .env
```

```env
DATABASE_URL=postgresql+psycopg2://bythepowerofmemory:your_secure_password@localhost/bythepowerofmemory
LOG_PATH=/var/log/games/ByThePowerOfMemory.log
DEBUG=false
```

### Step 5: Systemd Service

Create systemd service file:
```bash
sudo nano /etc/systemd/system/bythepowerofmemory.service
```

```ini
[Unit]
Description=ByThePowerOfMemory Game
After=network.target postgresql.service

[Service]
Type=notify
User=www-data
Group=www-data
WorkingDirectory=/opt/bythepowerofmemory
Environment=PATH=/opt/bythepowerofmemory/venv/bin
ExecStart=/opt/bythepowerofmemory/venv/bin/gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 127.0.0.1:8000
ExecReload=/bin/kill -s HUP $MAINPID
Restart=always
RestartSec=3

[Install]
WantedBy=multi-user.target
```

```bash
# Enable and start service
sudo systemctl daemon-reload
sudo systemctl enable bythepowerofmemory
sudo systemctl start bythepowerofmemory
sudo systemctl status bythepowerofmemory
```

### Step 6: Nginx Configuration

```bash
sudo nano /etc/nginx/sites-available/bythepowerofmemory
```

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Redirect to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;

    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;

    # Static files
    location /static/ {
        alias /opt/bythepowerofmemory/static/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # API and SPA routes
    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/bythepowerofmemory /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### Step 7: SSL Certificate

```bash
# Obtain Let's Encrypt certificate
sudo certbot --nginx -d your-domain.com

# Set up auto-renewal
sudo crontab -e
```

Add line:
```
0 12 * * * /usr/bin/certbot renew --quiet
```

### Step 8: Log Rotation

```bash
sudo nano /etc/logrotate.d/bythepowerofmemory
```

```
/var/log/games/ByThePowerOfMemory.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    create 644 www-data www-data
    postrotate
        systemctl reload bythepowerofmemory
    endscript
}
```

### Step 9: Monitoring

#### Basic Health Check
Add to `/opt/bythepowerofmemory/health_check.sh`:
```bash
#!/bin/bash
response=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8000/api/scoreboard)
if [ $response != "200" ]; then
    echo "Service is down, restarting..."
    sudo systemctl restart bythepowerofmemory
fi
```

```bash
# Make executable and add to crontab
chmod +x /opt/bythepowerofmemory/health_check.sh
sudo crontab -e
```

Add line:
```
*/5 * * * * /opt/bythepowerofmemory/health_check.sh
```

## Docker Deployment

### Dockerfile
```dockerfile
FROM python:3.9-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
RUN pip install gunicorn

# Copy application
COPY . .

# Create non-root user
RUN useradd -m -u 1000 appuser && chown -R appuser:appuser /app
USER appuser

# Expose port
EXPOSE 8000

# Run application
CMD ["gunicorn", "main:app", "-w", "4", "-k", "uvicorn.workers.UvicornWorker", "--bind", "0.0.0.0:8000"]
```

### docker-compose.yml
```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql+psycopg2://postgres:password@db:5432/bythepowerofmemory
      - LOG_PATH=/app/logs/game.log
      - DEBUG=false
    depends_on:
      - db
    volumes:
      - ./logs:/app/logs

  db:
    image: postgres:13
    environment:
      - POSTGRES_DB=bythepowerofmemory
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/ssl/certs
    depends_on:
      - app

volumes:
  postgres_data:
```

## Troubleshooting

### Common Issues

1. **Service won't start**
   ```bash
   sudo journalctl -u bythepowerofmemory -f
   ```

2. **Database connection errors**
   - Check PostgreSQL is running
   - Verify credentials in .env
   - Check firewall settings

3. **Static files not loading**
   - Verify Nginx configuration
   - Check file permissions
   - Clear browser cache

4. **High memory usage**
   - Adjust worker count in gunicorn
   - Monitor with `htop`

### Performance Tuning

1. **Database Optimization**
   - Add indexes to frequently queried columns
   - Use connection pooling
   - Regular VACUUM and ANALYZE

2. **Application Optimization**
   - Enable gzip compression in Nginx
   - Use CDN for static assets
   - Implement caching headers

3. **Scaling**
   - Use load balancer for multiple instances
   - Consider Redis for session storage
   - Implement database read replicas
