# Inkora — MilesWeb Deployment Guide

This guide gives you the exact step-by-step instructions to deploy **Inkora** on **MilesWeb**.

---

## 📦 Prepared Files Ready for Deployment

All production files have already been compiled and packaged for you:

1. **Frontend Package**: [`dist.zip`](dist.zip) (in project root)
   - Contains the compiled React application + production [`.htaccess`](frontend/public/.htaccess) configured for Apache / cPanel clean routing.
2. **Database Dump**: [`database.sql`](database.sql) (in project root)
   - Full MySQL database schema (9 tables, constraints, indexes) and seeded demo data.
3. **Backend Executable JAR**: [`backend/target/inkora-backend-0.0.1-SNAPSHOT.jar`](backend/target/inkora-backend-0.0.1-SNAPSHOT.jar)
   - Standalone Spring Boot 3 + Java 21 application with embedded production web server.

---

## PART 1: Deployment on MilesWeb cPanel (Shared Hosting)

Follow these steps if your MilesWeb account is a standard cPanel hosting plan:

### Step 1: Create the MySQL Database & Import `database.sql`
1. Log into your **MilesWeb cPanel**.
2. Under the **Databases** section, click **MySQL Databases** (or **MySQL Database Wizard**).
3. Create a new database:
   - Name: e.g. `cpaneluser_inkoradb`
4. Create a new database user:
   - Username: e.g. `cpaneluser_inkora`
   - Password: generate a strong password and save it securely.
5. Add the user to the database with **ALL PRIVILEGES**.
6. Return to the cPanel home screen and click **phpMyAdmin**.
7. In phpMyAdmin, click on your newly created database in the left sidebar.
8. Click the **Import** tab at the top.
9. Click **Choose File** -> select [`database.sql`](database.sql) from your project folder.
10. Scroll down and click **Import** (or **Go**).
    *All tables (`users`, `blogs`, `tags`, `comments`, etc.) and seed data will be imported immediately.*

---

### Step 2: Deploy the Frontend to `public_html`
1. In cPanel, click **File Manager**.
2. Navigate to the **`public_html`** folder (or your subdomain folder, e.g. `blog.yourdomain.com`).
3. If there is a default `index.html` or `default.html` placeholder from MilesWeb, delete or rename it.
4. Click **Upload** in the top toolbar.
5. Drag and drop **[`dist.zip`](dist.zip)** from your project root.
6. Once upload reaches 100%, close the upload tab and return to File Manager.
7. Right-click **`dist.zip`** and click **Extract**. Extract the files directly into `public_html`.
8. Ensure the extracted files (`index.html`, `assets/`, `.htaccess`) are directly inside `public_html`.
   *(The included `.htaccess` file prevents 404 errors when visitors reload `/dashboard` or `/explore`.)*

---

### Step 3: Run the Spring Boot Backend

Spring Boot is a standalone Java application that runs on port 8080. Depending on your MilesWeb plan:

#### If your cPanel has Terminal access:
1. In cPanel, open **Terminal**.
2. Verify Java 21 is installed:
   ```bash
   java -version
   ```
3. Upload `inkora-backend-0.0.1-SNAPSHOT.jar` to a folder outside `public_html` (e.g. `/home/username/app/`).
4. Run the backend with your cPanel database credentials:
   ```bash
   nohup java -jar inkora-backend-0.0.1-SNAPSHOT.jar \
     --spring.datasource.url="jdbc:mysql://localhost:3306/cpaneluser_inkoradb?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true" \
     --spring.datasource.username="cpaneluser_inkora" \
     --spring.datasource.password="YOUR_DB_PASSWORD" \
     --server.port=8080 > app.log 2>&1 &
   ```

#### If your cPanel is Standard Shared Hosting without Java 21:
Standard shared hosting plans only run PHP/Apache and do not support long-running Java processes.
If so, you can run the backend for free or low-cost on **Render** or **Railway**, and connect it to your MilesWeb MySQL database:
1. Connect your GitHub repository to Render/Railway.
2. Set root directory to `backend`.
3. Provide environment variables for your database connection (`DB_URL`, `DB_USERNAME`, `DB_PASSWORD`).
4. In `frontend/src/services/api.js`, set `VITE_API_BASE_URL` to your backend URL.

---

## PART 2: Deployment on MilesWeb VPS / Cloud Server (Recommended)

If you have a MilesWeb **VPS** with Ubuntu/Debian and root SSH access, this is the most reliable setup:

### Step 1: Connect via SSH
```bash
ssh root@YOUR_SERVER_IP
```

### Step 2: Install Java 21, MySQL 8 & Nginx
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y openjdk-21-jdk mysql-server nginx unzip
```

### Step 3: Setup MySQL & Import Data
```bash
# Secure MySQL and create database
sudo mysql -e "CREATE DATABASE IF NOT EXISTS inkora_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
sudo mysql -e "CREATE USER 'inkora'@'localhost' IDENTIFIED BY 'YourStrongPassword123!';"
sudo mysql -e "GRANT ALL PRIVILEGES ON inkora_db.* TO 'inkora'@'localhost';"
sudo mysql -e "FLUSH PRIVILEGES;"

# Upload and import database.sql
mysql -u inkora -p"YourStrongPassword123!" inkora_db < database.sql
```

### Step 4: Deploy the Backend as a System Service
1. Create app directory:
   ```bash
   mkdir -p /var/www/inkora/backend
   mkdir -p /var/www/inkora/backend/uploads
   ```
2. Upload `inkora-backend-0.0.1-SNAPSHOT.jar` to `/var/www/inkora/backend/`.
3. Create a systemd service file:
   ```bash
   sudo nano /etc/systemd/system/inkora.service
   ```
4. Paste the following configuration:
   ```ini
   [Unit]
   Description=Inkora Spring Boot Backend
   After=syslog.target network.target mysql.service

   [Service]
   User=root
   WorkingDirectory=/var/www/inkora/backend
   ExecStart=/usr/bin/java -jar /var/www/inkora/backend/inkora-backend-0.0.1-SNAPSHOT.jar \
     --spring.datasource.url="jdbc:mysql://localhost:3306/inkora_db?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true" \
     --spring.datasource.username="inkora" \
     --spring.datasource.password="YourStrongPassword123!" \
     --server.port=8080
   SuccessExitStatus=143
   Restart=always
   RestartSec=10

   [Install]
   WantedBy=multi-user.target
   ```
5. Enable and start the service:
   ```bash
   sudo systemctl daemon-reload
   sudo systemctl enable inkora
   sudo systemctl start inkora
   sudo systemctl status inkora
   ```

### Step 5: Deploy Frontend to Nginx
1. Extract `dist.zip` to `/var/www/inkora/frontend`:
   ```bash
   mkdir -p /var/www/inkora/frontend
   unzip dist.zip -d /var/www/inkora/frontend
   ```
2. Configure Nginx:
   ```bash
   sudo nano /etc/nginx/sites-available/inkora
   ```
3. Add Nginx server block:
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com www.yourdomain.com;

       # Frontend Static Files
       root /var/www/inkora/frontend;
       index index.html;

       location / {
           try_files $uri $uri/ /index.html;
       }

       # Backend API Proxy
       location /api/ {
           proxy_pass http://127.0.0.1:8080/api/;
           proxy_http_version 1.1;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
       }

       # Uploaded Images Proxy
       location /uploads/ {
           proxy_pass http://127.0.0.1:8080/uploads/;
           proxy_http_version 1.1;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
       }
   }
   ```
4. Activate the site and restart Nginx:
   ```bash
   sudo ln -s /etc/nginx/sites-available/inkora /etc/nginx/sites-enabled/
   sudo rm /etc/nginx/sites-enabled/default
   sudo nginx -t
   sudo systemctl restart nginx
   ```

### Step 6: Enable Free SSL with Let's Encrypt
```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

---

## 🚀 Verification Checklist
- [ ] Visit `https://yourdomain.com` — verify Home page loads.
- [ ] Visit `https://yourdomain.com/explore` — verify blogs render.
- [ ] Visit `https://yourdomain.com/login` — log in with `alexrivera` / `SecurePassword123!`.
- [ ] Visit `https://yourdomain.com/dashboard` — open Edit Profile modal, upload a picture from laptop, save, and verify picture updates!
