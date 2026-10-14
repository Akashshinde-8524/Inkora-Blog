# Inkora — Production Deployment Guide

This guide details how to deploy **Inkora** to production across various cloud infrastructures and hosting models.

---

## Deployment Options at a Glance

| Deployment Model | Best For | Complexity | Estimated Cost |
| :--- | :--- | :--- | :--- |
| **Option 1: Docker Compose** | VPS (DigitalOcean, Hetzner, AWS EC2, Linode) | Low (Single Command) | \$5 - \$10/mo |
| **Option 2: Cloud PaaS (Render / Railway)** | Fast zero-infra cloud setup | Very Low | Free tier / \$7+/mo |
| **Option 3: Decoupled (Vercel + Cloud Backend)** | High performance edge static delivery | Medium | Free / \$5+/mo |
| **Option 4: Traditional Linux VM (Ubuntu)** | Bare-metal, total control | Medium | \$5 - \$10/mo |

---

## Option 1: Docker Compose (Recommended for VPS)

The easiest way to run the entire stack (MySQL 8, Spring Boot Backend, Nginx + React Frontend, and Persistent Volumes) is with Docker Compose.

### Step 1: Clone & Configure
```bash
git clone <your-repo-url> inkora
cd inkora

# Copy and configure environment variables
cp .env.example .env
nano .env
```
Ensure you change:
* `MYSQL_PASSWORD` and `MYSQL_ROOT_PASSWORD`
* `JWT_SECRET` (generate a secure 64+ char random string)
* `CORS_ALLOWED_ORIGINS` (your domain name, e.g., `https://yourdomain.com`)

### Step 2: Build & Start Containers
```bash
docker compose up -d --build
```

### Step 3: Verify Status
```bash
docker compose ps
docker compose logs -f backend
```
* **Frontend**: Accessible on port `80` (or configured `APP_PORT`)
* **API Health**: `http://localhost/api/health`

### Step 4: Add SSL / HTTPS with Let's Encrypt (Certbot)
If running on a VPS with a public domain, run an Nginx reverse proxy with Certbot on the host or use Traefik/Caddy:
```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

---

## Option 2: Cloud PaaS (Railway / Render)

### 1. Database (Managed MySQL)
* Create a **MySQL** instance on Railway, Render, AWS RDS, or your provider.
* Import the provided [database.sql](database.sql) script to set up all tables and seed data:
  ```bash
  mysql -h <host> -u <user> -p<password> <dbname> < database.sql
  ```
* Note the connection URL: `jdbc:mysql://<host>:<port>/<dbname>`.

### 2. Backend Service (Spring Boot)
* Connect your repository and set Root Directory to `backend`.
* **Build Command**: `./mvnw clean package -DskipTests`
* **Start Command**: `java -jar target/inkora-backend-0.0.1-SNAPSHOT.jar`
* **Environment Variables**:
  * `DB_URL`: `jdbc:mysql://<host>:<port>/<dbname>?useSSL=false&allowPublicKeyRetrieval=true`
  * `DB_USERNAME`: `<db_user>`
  * `DB_PASSWORD`: `<db_password>`
  * `JWT_SECRET`: `<your_secret_key>`
  * `CORS_ALLOWED_ORIGINS`: `https://your-frontend-domain.com`
  * `PORT`: `8080`

### 3. Frontend Service (Vite + React)
* Connect your repository and set Root Directory to `frontend`.
* **Build Command**: `npm run build`
* **Publish Directory**: `dist`
* **Environment Variables**:
  * `VITE_API_BASE_URL`: `https://your-backend-domain.com/api`

---

## Option 3: Decoupled (Vercel + Cloud Backend)

### Frontend on Vercel
1. Import repository on [Vercel](https://vercel.com).
2. Set Root Directory to `frontend`.
3. Add Environment Variable:
   * `VITE_API_BASE_URL`: `https://your-backend-api.com/api`
4. Add client-side rewrite in `frontend/vercel.json` for React Router:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```
5. Deploy!

---

## Option 4: Traditional Linux Server (Ubuntu 22.04 / 24.04)

### 1. Install Java 21 & MySQL
```bash
sudo apt update && sudo apt install -y openjdk-21-jdk mysql-server nginx
```

### 2. Configure MySQL
```sql
CREATE DATABASE inkora_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'inkora'@'localhost' IDENTIFIED BY 'StrongPassword123!';
GRANT ALL PRIVILEGES ON inkora_db.* TO 'inkora'@'localhost';
FLUSH PRIVILEGES;
```

### 3. Build & Deploy Backend as a systemd Service
Build the JAR:
```bash
cd backend
./mvnw clean package -DskipTests
sudo cp target/inkora-backend-0.0.1-SNAPSHOT.jar /opt/inkora/app.jar
```

Create `/etc/systemd/system/inkora.service`:
```ini
[Unit]
Description=Inkora Backend Service
After=syslog.target network.target mysql.service

[Service]
User=www-data
WorkingDirectory=/opt/inkora
ExecStart=/usr/bin/java -jar /opt/inkora/app.jar
Environment="DB_URL=jdbc:mysql://localhost:3306/inkora_db"
Environment="DB_USERNAME=inkora"
Environment="DB_PASSWORD=StrongPassword123!"
Environment="JWT_SECRET=Your64CharacterLongSecretKeyForSigningJWTTokensSecurityKey123456789"
SuccessExitStatus=143
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```
Enable and start:
```bash
sudo systemctl daemon-reload
sudo systemctl enable --now inkora
```

### 4. Build Frontend & Host on Nginx
```bash
cd frontend
npm install
npm run build
sudo cp -r dist/* /var/www/inkora/
```

Configure `/etc/nginx/sites-available/inkora`:
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    root /var/www/inkora;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://localhost:8080/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /uploads/ {
        proxy_pass http://localhost:8080/uploads/;
        proxy_set_header Host $host;
    }
}
```
Enable site and test:
```bash
sudo ln -s /etc/nginx/sites-available/inkora /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

## Production Security Checklist

- [x] **Stateless Authentication**: Passwords hashed with BCrypt, sessions managed via signed JWT tokens.
- [x] **XSS Sanitization**: Markdown rendered with DOMPurify on the client side.
- [x] **SQL Injection Defense**: All database queries executed through JPA parameter binding.
- [x] **CORS Protection**: Origin-checked via `CORS_ALLOWED_ORIGINS`.
- [x] **File Upload Validation**: Enforces MIME types and limits max upload size to 10MB.
- [x] **View Deduplication**: 2-hour IP throttling window prevents artificial metric manipulation.
- [x] **Non-Root Containers**: Docker runtime executes as unprivileged user `inkora`.
