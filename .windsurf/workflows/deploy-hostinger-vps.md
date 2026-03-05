---
description: Deploy Constra (Next.js + Express + MySQL) to a Hostinger VPS
---

# Deploy Constra on a Hostinger VPS (Ubuntu) — Step-by-step

This guide deploys:
- **Frontend**: Next.js 14 (App Router)
- **Backend**: Node.js + Express API (`backend/server.js`)
- **Database**: MySQL (recommended: VPS local MySQL)
- **Reverse proxy + SSL**: Nginx + Let’s Encrypt
- **Process manager**: PM2

## 0) Assumptions / What you need

- A Hostinger **VPS running Ubuntu 22.04/24.04**
- A domain name (optional but recommended)
- Your code available via **GitHub** or you can upload via SFTP
- Ports to use:
  - Backend: `4000` (internal)
  - Frontend: `3000` (internal)
  - Public: `80/443` (Nginx)

## 1) Connect to the VPS

SSH in:

```bash
ssh root@YOUR_VPS_IP
```

(Optional but recommended) Create a non-root user and use sudo.

## 2) Install system dependencies

### 2.1 Update packages

```bash
sudo apt update && sudo apt -y upgrade
```

### 2.2 Install Node.js (LTS) + build tools

Recommended: Node 20 LTS.

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

Verify:

```bash
node -v
npm -v
```

### 2.3 Install MySQL

```bash
sudo apt-get install -y mysql-server
sudo systemctl enable mysql
sudo systemctl start mysql
```

### 2.4 Install Nginx

```bash
sudo apt-get install -y nginx
sudo systemctl enable nginx
sudo systemctl start nginx
```

### 2.5 Install PM2

```bash
sudo npm i -g pm2
pm2 -v
```

## 3) Create the database + user

Enter MySQL:

```bash
sudo mysql
```

Create DB/user (replace values):

```sql
CREATE DATABASE constra CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'constra_user'@'localhost' IDENTIFIED BY 'CHANGE_ME_STRONG_PASSWORD';
GRANT ALL PRIVILEGES ON constra.* TO 'constra_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

## 4) Get the code onto the server

Choose one:

### Option A: Git clone (recommended)

```bash
sudo mkdir -p /var/www/constra
sudo chown -R $USER:$USER /var/www/constra
cd /var/www/constra

git clone YOUR_GIT_REPO_URL .
```

### Option B: Upload files

Upload the whole project folder to `/var/www/constra`.

## 5) Configure environment variables

### 5.1 Backend `.env`

On the VPS, create/edit:

`/var/www/constra/backend/.env`

Use your project’s existing keys (these names must match your backend code). Typical example:

```env
PORT=4000
JWT_SECRET=CHANGE_ME_SUPER_SECRET
DB_HOST=localhost
DB_USER=constra_user
DB_PASSWORD=CHANGE_ME_STRONG_PASSWORD
DB_NAME=constra
```

### 5.2 Frontend environment

Your frontend calls the backend via `API_URL` (in code it was `http://localhost:4000/api` for local dev).

On VPS, you want it to call your **public domain**:

- If backend is served as `https://api.YOURDOMAIN.com/api`:

Create/edit:

`/var/www/constra/frontend/.env.production`

```env
NEXT_PUBLIC_API_URL=https://api.YOURDOMAIN.com/api
```

If your frontend currently uses a hardcoded API_URL inside files, update it to use `process.env.NEXT_PUBLIC_API_URL`.

## 6) Install dependencies + build

### 6.1 Backend install

```bash
cd /var/www/constra/backend
npm ci
```

### 6.2 Frontend install + build

```bash
cd /var/www/constra/frontend
npm ci
npm run build
```

## 7) Run backend + frontend with PM2

### 7.1 Start backend

```bash
cd /var/www/constra/backend
pm2 start server.js --name constra-backend
```

### 7.2 Start frontend

Next.js production server:

```bash
cd /var/www/constra/frontend
pm2 start npm --name constra-frontend -- start
```

### 7.3 Configure PM2 to start on reboot

```bash
pm2 save
pm2 startup
```

Run the command PM2 prints (it’s usually a `sudo` command).

## 8) Configure Nginx reverse proxy

You can deploy with **one domain** (e.g. `YOURDOMAIN.com` for frontend and `/api` proxied to backend), OR **two subdomains**.

### Option A (recommended):
- Frontend: `https://YOURDOMAIN.com`
- Backend API: `https://api.YOURDOMAIN.com`

#### 8.1 Frontend Nginx config

Create:

`/etc/nginx/sites-available/constra-frontend`

```nginx
server {
  listen 80;
  server_name YOURDOMAIN.com www.YOURDOMAIN.com;

  location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
  }
}
```

Enable it:

```bash
sudo ln -s /etc/nginx/sites-available/constra-frontend /etc/nginx/sites-enabled/
```

#### 8.2 Backend Nginx config

Create:

`/etc/nginx/sites-available/constra-backend`

```nginx
server {
  listen 80;
  server_name api.YOURDOMAIN.com;

  client_max_body_size 50M;

  location / {
    proxy_pass http://127.0.0.1:4000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
  }
}
```

Enable it:

```bash
sudo ln -s /etc/nginx/sites-available/constra-backend /etc/nginx/sites-enabled/
```

Test + reload:

```bash
sudo nginx -t
sudo systemctl reload nginx
```

## 9) Enable HTTPS (Let’s Encrypt)

Install certbot:

```bash
sudo apt-get install -y certbot python3-certbot-nginx
```

Issue certificates:

```bash
sudo certbot --nginx -d YOURDOMAIN.com -d www.YOURDOMAIN.com
sudo certbot --nginx -d api.YOURDOMAIN.com
```

Auto-renew is usually installed automatically. You can verify:

```bash
sudo systemctl status certbot.timer
```

## 10) Fix uploads / file storage

Your backend stores uploaded files under:

`/var/www/constra/backend/uploads`

Make sure the folder exists and is writable by the user running Node:

```bash
mkdir -p /var/www/constra/backend/uploads
```

If you use PM2 as your user, typically it is fine. If you run as `www-data`, adjust permissions accordingly.

### Serving uploads publicly

If your backend serves `/uploads` via Express static, you’re done.

If not, add an Nginx location for `/uploads` to proxy to backend or serve directly.

## 11) Firewall

Allow required ports:

```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
sudo ufw status
```

## 12) Sanity checks

- Frontend:
  - Open `https://YOURDOMAIN.com`
- Backend health:
  - `https://api.YOURDOMAIN.com/api/health`
- Test login + document upload + ZIP download.

## 13) Updating (deploying new code)

```bash
cd /var/www/constra
git pull

cd backend
npm ci
pm2 restart constra-backend

cd ../frontend
npm ci
npm run build
pm2 restart constra-frontend
```

## Common issues

- **CORS errors**: ensure backend `cors()` allows your frontend domain.
- **Large file uploads fail**: increase `client_max_body_size` in Nginx and verify multer limits.
- **PM2 not starting on reboot**: run `pm2 startup` and then `pm2 save`.

