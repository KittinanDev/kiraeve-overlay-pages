# Kiraeve Overlay - Cloudflare Pages

**Static overlay with real-time data from Cloudflare KV**

## 🎯 What is this?

This is the **frontend** for Kiraeve Overlay that runs on **Cloudflare Pages**.

- 🌐 **Domain**: `kiraeve-overlay.com`
- 🔒 **HTTPS**: Automatic SSL
- ⚡ **CDN**: Global edge network
- 💾 **Storage**: Cloudflare KV
- 🆓 **Cost**: Free (unlimited requests)

## 📁 File Structure

```
cloudflare-pages/
├── index.html              # Main overlay page
├── style.css               # Styling
├── main.js                 # Overlay logic
├── functions/              # Cloudflare Pages Functions (API)
│   ├── api/
│   │   ├── data/
│   │   │   └── [sessionId].js    # GET /api/data/:sessionId
│   │   └── update/
│   │       └── [sessionId].js    # POST /api/update/:sessionId
│   └── overlay/
│       └── [sessionId]/
│           └── [[player]].js     # GET /overlay/:sessionId(/p1|/p2)
├── DEPLOYMENT.md           # Step-by-step deployment guide
└── README.md               # This file
```

## 🚀 Quick Start

### For Development

1. Clone the repo
2. Make changes to files
3. Push to GitHub
4. Cloudflare Pages auto-deploys ✅

### For Testing Locally

```bash
# Install Wrangler
npm install -g wrangler

# Run dev server
wrangler pages dev .
```

Open: `http://localhost:8788/`

## 🔗 URLs

### Overlay Display

```
https://kiraeve-overlay.com/overlay/:sessionId
https://kiraeve-overlay.com/overlay/:sessionId/p1
https://kiraeve-overlay.com/overlay/:sessionId/p2
```

### API Endpoints

```bash
# GET data
GET https://kiraeve-overlay.com/api/data/:sessionId

# UPDATE data
POST https://kiraeve-overlay.com/api/update/:sessionId
Content-Type: application/json

{
  "mode": "dual",
  "maxWins": 2,
  "players": {
    "p1": { "wins": 1, "name": "Player 1", "showName": true },
    "p2": { "wins": 0, "name": "Player 2", "showName": true }
  },
  "settings": {
    "font": "MrBeast",
    "fontSize": 120,
    "fontColor": "#FFFFFF",
    "borderEnabled": true,
    "borderColor": "#000000",
    "borderSize": 4
  }
}
```

## ⚙️ How It Works

### 1. Electron App (Desktop)

```
User changes win count
    ↓
App sends POST to /api/update/:sessionId
    ↓
Data stored in Cloudflare KV
```

### 2. Overlay (Browser/TikTok)

```
Open https://kiraeve-overlay.com/overlay/:sessionId
    ↓
JavaScript fetches from /api/data/:sessionId
    ↓
Display updates every 2 seconds
```

### 3. Data Flow

```
Electron App → Cloudflare KV → Browser Overlay
```

## 🎨 Customization

### Change Fonts

Edit `style.css`:
```css
@import url('https://fonts.cdnfonts.com/css/your-font');

body {
    font-family: 'YourFont', Arial, sans-serif;
}
```

### Change Colors

Edit `style.css`:
```css
.counter {
    color: #FF0000; /* Red */
    text-shadow: -4px -4px 0 #0000FF; /* Blue border */
}
```

### Change Refresh Rate

Edit `main.js`:
```javascript
// Change from 2000ms to your desired interval
setInterval(() => {
    this.fetchData();
}, 2000); // 2 seconds
```

## 🔒 Security

- **Session IDs** are secrets - only users with ID can access
- **CORS** enabled for cross-origin requests
- **HTTPS** enforced automatically
- **Data expires** after 24 hours

## 📊 Analytics

View analytics in Cloudflare Dashboard:
- Page views
- Unique visitors
- Geographic distribution
- API requests
- KV operations

## 🆘 Troubleshooting

### Overlay not updating?

1. Check browser console for errors
2. Verify API endpoint: `https://kiraeve-overlay.com/api/data/YOUR-SESSION-ID`
3. Check KV binding in Pages settings
4. Redeploy the Pages project

### CORS errors?

Functions include proper CORS headers. If still seeing errors:
1. Check that `functions/` folder is deployed
2. Verify KV namespace is bound correctly
3. Check browser console for specific error

### Data not persisting?

1. Verify KV namespace `OVERLAY_DATA` exists
2. Check binding name matches: `OVERLAY_DATA`
3. Test with curl to verify API works

## 🎯 Best Practices

### 1. Keep It Simple
- Static files only in root
- API logic in `/functions`
- No build step needed

### 2. Optimize Images
- Use WebP format
- Compress images
- Use CDN URLs for fonts

### 3. Cache Control
- API responses: `no-cache`
- Static assets: `public, max-age=3600`

### 4. Error Handling
- Always return JSON
- Include CORS headers
- Log errors for debugging

## 📚 Resources

- [Cloudflare Pages Docs](https://developers.cloudflare.com/pages/)
- [Pages Functions](https://developers.cloudflare.com/pages/platform/functions/)
- [KV Documentation](https://developers.cloudflare.com/workers/runtime-apis/kv/)
- [Deployment Guide](./DEPLOYMENT.md)

## 🎉 Done!

Your overlay is now live at:
```
https://kiraeve-overlay.com
```

**Fast, secure, and free!** ✅
