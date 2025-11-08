# 🚀 Cloudflare Pages Deployment Guide

## Domain: kiraeve-overlay.com

---

## ✅ Step 1: เตรียม GitHub Repository

### 1.1 สร้าง GitHub Repo ใหม่

1. ไป https://github.com/new
2. ตั้งชื่อ: `kiraeve-overlay-pages`
3. Public หรือ Private ก็ได้
4. **ไม่ต้อง** initialize with README
5. Create repository

### 1.2 Push Code ไป GitHub

```bash
cd c:\G\cloudflare-pages

# Initialize git
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: Kiraeve Overlay for Cloudflare Pages"

# Add remote (แทนที่ YOUR_USERNAME ด้วย GitHub username จริง)
git remote add origin https://github.com/YOUR_USERNAME/kiraeve-overlay-pages.git

# Push
git branch -M main
git push -u origin main
```

---

## ✅ Step 2: ตั้งค่าโดเมนใน Cloudflare

### 2.1 Add Domain

1. ไป https://dash.cloudflare.com
2. คลิก **Add a Site**
3. ใส่: `kiraeve-overlay.com`
4. เลือก Plan: **Free**
5. คลิก **Continue**

### 2.2 เปลี่ยน Nameservers

Cloudflare จะให้ nameservers 2 ตัว เช่น:
```
anya.ns.cloudflare.com
reza.ns.cloudflare.com
```

**ไปที่ Domain Registrar ที่คุณซื้อโดเมน:**
1. หา DNS Management หรือ Nameserver Settings
2. เปลี่ยนจาก nameserver เดิม → ใส่ของ Cloudflare
3. Save changes

⏰ **รอ 5-10 นาที** (บางครั้งอาจนานถึง 24 ชม.)

Cloudflare จะแสดง **Active** เมื่อเสร็จ ✅

---

## ✅ Step 3: สร้าง KV Namespace

### 3.1 ไปที่ Workers & Pages

1. ใน Cloudflare Dashboard → **Workers & Pages**
2. ไปที่แท็บ **KV**
3. คลิก **Create namespace**

### 3.2 ตั้งค่า KV

- **Namespace Name**: `OVERLAY_DATA`
- คลิก **Add**

✅ จด **Namespace ID** ไว้ (จะใช้ในขั้นตอนถัดไป)

---

## ✅ Step 4: Deploy ด้วย Cloudflare Pages

### 4.1 Create Pages Project

1. ใน Cloudflare Dashboard → **Workers & Pages**
2. คลิก **Create application**
3. เลือกแท็บ **Pages**
4. คลิก **Connect to Git**

### 4.2 เชื่อมต่อ GitHub

1. เลือก **GitHub**
2. Authorize Cloudflare
3. เลือก Repository: `kiraeve-overlay-pages`
4. คลิก **Begin setup**

### 4.3 Build Settings

```
Project name: kiraeve-overlay
Production branch: main
Framework preset: None
Build command: (เว้นว่าง)
Build output directory: /
Root directory: /
```

คลิก **Save and Deploy**

⏰ รอ 1-2 นาที - Deployment จะเสร็จ

---

## ✅ Step 5: ผูก KV Namespace

### 5.1 ไปที่ Pages Project Settings

1. เลือก Project: `kiraeve-overlay`
2. ไปที่ **Settings**
3. คลิกแท็บ **Functions**

### 5.2 Add KV Binding

1. Scroll ลงไปที่ **KV namespace bindings**
2. คลิก **Add binding**

```
Variable name: OVERLAY_DATA
KV namespace: เลือก OVERLAY_DATA ที่สร้างไว้
```

3. คลิก **Save**

### 5.3 Redeploy

1. ไปที่ **Deployments**
2. คลิก **Retry deployment** (หรือ push code ใหม่)

---

## ✅ Step 6: ตั้งค่า Custom Domain

### 6.1 Add Custom Domain

1. ใน Pages Project → **Custom domains**
2. คลิก **Set up a custom domain**
3. ใส่: `kiraeve-overlay.com`
4. คลิก **Continue**

### 6.2 DNS Configuration

Cloudflare จะตั้งค่า DNS record อัตโนมัติ:
```
Type: CNAME
Name: @
Content: kiraeve-overlay.pages.dev
```

### 6.3 Add Subdomain (Optional)

ถ้าต้องการ subdomain เช่น `overlay.kiraeve-overlay.com`:

1. คลิก **Set up a custom domain** อีกครั้ง
2. ใส่: `overlay.kiraeve-overlay.com`
3. Cloudflare จะสร้าง CNAME record

### 6.4 SSL Certificate

⏰ รอ 1-10 นาที สำหรับ SSL provisioning

เมื่อเสร็จจะแสดง: **Active ✅**

---

## ✅ Step 7: ทดสอบ

### 7.1 เปิดในเบราว์เซอร์

```
https://kiraeve-overlay.com
```

ควรเห็นหน้าว่าง (เพราะยังไม่มี session ID)

### 7.2 ทดสอบ API

```bash
# GET default data
curl https://kiraeve-overlay.com/api/data/KIRA-TEST-0000-DEMO

# POST update data
curl -X POST https://kiraeve-overlay.com/api/update/KIRA-TEST-0000-DEMO \
  -H "Content-Type: application/json" \
  -d '{"mode":"single","maxWins":2,"players":{"p1":{"wins":1,"name":"Test","showName":true}}}'

# GET updated data
curl https://kiraeve-overlay.com/api/data/KIRA-TEST-0000-DEMO
```

### 7.3 ทดสอบ Overlay

```
https://kiraeve-overlay.com/overlay/KIRA-TEST-0000-DEMO
https://kiraeve-overlay.com/overlay/KIRA-TEST-0000-DEMO/p1
https://kiraeve-overlay.com/overlay/KIRA-TEST-0000-DEMO/p2
```

---

## ✅ Step 8: อัพเดทแอป Kiraeve

### 8.1 แก้ไข Cloud Server URL

แก้ไฟล์ `src/lib/cloud-sync.ts` บรรทัด 16:

```typescript
private readonly DEFAULT_CLOUD_URL = 'https://kiraeve-overlay.com';
```

### 8.2 Rebuild แอป

```bash
cd c:\G
npm run build
```

### 8.3 ทดสอบ

```bash
npm start
```

1. เปิดแอป
2. ดู HTTPS URL ที่แสดง - ควรเป็น `https://kiraeve-overlay.com/overlay/KIRA-XXXX...`
3. คัดลอก URL
4. เปิดในเบราว์เซอร์
5. เปลี่ยนค่า counter ในแอป
6. ดู overlay ใน browser - ควรอัพเดตภายใน 2 วินาที ✅

---

## ✅ Step 9: Build และ Deploy แอปเวอร์ชั่นใหม่

### 9.1 Build Setup Files

```bash
npm run dist:both
```

### 9.2 ตรวจสอบ

ไฟล์ใน `dist-build/` และ `dist-build-admin/`:
- ✅ Kiraeve-Overlay-User-Setup-1.0.x.exe
- ✅ Kiraeve-Overlay-Admin-Setup-1.0.x.exe

### 9.3 ทดสอบ Setup

1. ลงจำลอง (VM หรือเครื่องอื่น)
2. เปิดแอป
3. ตรวจสอบ HTTPS URL
4. ทดสอบใน TikTok Studio

---

## 📊 Architecture สรุป

```
GitHub Repo
    ↓
Cloudflare Pages (Auto Deploy)
    ↓
https://kiraeve-overlay.com
    ├── /overlay/:sessionId → Display overlay
    ├── /overlay/:sessionId/p1 → P1 only
    ├── /overlay/:sessionId/p2 → P2 only
    ├── /api/data/:sessionId → GET data
    └── /api/update/:sessionId → POST data
    
KV Storage (OVERLAY_DATA)
    └── session:KIRA-XXXX-XXXX-XXXX → JSON data
```

---

## 🔧 Maintenance

### Push Updates

เมื่อมีการแก้ไขโค้ด:

```bash
cd c:\G\cloudflare-pages
git add .
git commit -m "Update overlay styles"
git push
```

Cloudflare Pages จะ **deploy อัตโนมัติ** ภายใน 1-2 นาที ✅

### View Logs

1. Cloudflare Dashboard → Pages → Project
2. คลิก **View build log**
3. ดู Real-time logs

### Rollback

ถ้ามีปัญหา:
1. ไปที่ **Deployments**
2. เลือก deployment ก่อนหน้า
3. คลิก **Rollback to this deployment**

---

## 💰 Costs

### Cloudflare Pages (Free Tier)
- ✅ 500 builds/month
- ✅ Unlimited requests
- ✅ Unlimited bandwidth
- ✅ Free SSL/TLS
- ✅ DDoS protection

### KV Storage (Free Tier)
- ✅ 100,000 reads/day
- ✅ 1,000 writes/day
- ✅ 1 GB storage

**เพียงพอสำหรับผู้ใช้หลายพันคนต่อวัน!**

---

## ✅ Checklist

- [ ] GitHub Repo created and pushed
- [ ] Domain added to Cloudflare
- [ ] Nameservers changed
- [ ] Domain active in Cloudflare
- [ ] KV namespace created
- [ ] Pages project created
- [ ] GitHub connected
- [ ] KV binding added
- [ ] Custom domain configured
- [ ] SSL certificate active
- [ ] App code updated with new URL
- [ ] App rebuilt
- [ ] Setup files created
- [ ] Tested in TikTok Studio

---

## 🎉 Done!

Users can now use:
```
https://kiraeve-overlay.com/overlay/KIRA-XXXX-XXXX-XXXX
```

**No server, no config, just works!** ✅
