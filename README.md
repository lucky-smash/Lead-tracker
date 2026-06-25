# Lead Management & Email Tracking System

An automated system where users submit details through a form, data is stored in MongoDB, a personalized email is sent automatically, and email engagement is tracked through an analytics dashboard.

## 🚀 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, Vite 8, Vanilla CSS |
| **Backend** | Node.js, Express 5 |
| **Database** | MongoDB Atlas (Mongoose 9) |
| **Email** | Nodemailer (Gmail SMTP) |
| **Deployment** | Vercel (frontend) + Render (backend) |

## 📋 Features

### 1. Lead Capture Form
- Collects: Full Name, Email, Phone, Company (optional), Requirement
- Form validation and loading states
- Success/error feedback via toast notifications

### 2. Database Storage
- MongoDB Atlas cloud database
- Stores all user-submitted data with timestamps
- Fields: name, email, phone, company, requirement, emailSent, opened, clicked

### 3. Automated Personalized Email
- Sends a beautifully styled HTML email on form submission
- Dynamically uses the user's name and requirement
- Contains a trackable CTA link

### 4. Email Open Tracking
- Embeds an invisible 1×1 tracking pixel in the email
- When the email client loads the pixel, the server records the open event
- Dashboard shows: Total Emails Sent, Total Emails Opened, Open Rate %

### 5. Link Click Tracking
- The email CTA link routes through the server before redirecting
- Server records the click event and redirects to the actual URL
- Dashboard shows: Total Links Clicked, Click Rate %

### 6. Analytics Dashboard
- Real-time metrics: Total Leads, Emails Sent, Emails Opened, Open Rate, Links Clicked, Click Rate
- Leads table with name, email, requirement, open/click status badges
- Auto-refreshes every 30 seconds

## 🏗️ Architecture

```
User → Lead Form (React) → POST /api/leads → Express Server → MongoDB Atlas
                                                    ↓
                                              Nodemailer → Gmail SMTP → User's Email
                                                                            ↓
                                              Email contains:
                                              - Tracking Pixel (<img> → GET /api/track/open/:id)
                                              - Trackable Link (→ GET /api/track/click/:id → 302 redirect)
                                                    ↓
                                              Dashboard (React) ← GET /api/analytics
```

## 📡 How Tracking Works

### Email Open Tracking
1. Email contains an invisible `<img src="server/api/track/open/:leadId" />` (1×1 pixel)
2. When the recipient opens the email, their email client fetches this image
3. The server receives the GET request, marks `opened: true` + `openedAt` timestamp
4. Returns a transparent 1×1 GIF with no-cache headers

### Link Click Tracking
1. Email CTA points to `server/api/track/click/:leadId?redirect=actualURL`
2. When clicked, the server records `clicked: true` + `clickedAt` timestamp
3. Server responds with a 302 redirect to the actual destination URL

## 🛠️ Setup & Run Locally

### Prerequisites
- Node.js 18+
- MongoDB Atlas account

### Backend
```bash
cd server
npm install
# Create .env file with:
# MONGO_URI=your_mongodb_atlas_uri
# PORT=5000
# EMAIL_USER=your@gmail.com
# EMAIL_PASS=your-gmail-app-password
# SERVER_URL=http://localhost:5000
# REDIRECT_URL=https://yoursite.com
npm run dev
```

### Frontend
```bash
cd client
npm install
npm run dev
```

Open http://localhost:5173

## 📁 Project Structure

```
lead-tracker/
├── client/                  # React Frontend (Vite)
│   └── src/
│       ├── components/
│       │   ├── LeadForm.jsx    # Lead capture form
│       │   └── Dashboard.jsx   # Analytics dashboard
│       ├── App.jsx             # Main app with tab navigation
│       ├── App.css             # Component styles
│       └── index.css           # Global theme (dark mode)
│
├── server/                  # Express Backend
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── controllers/
│   │   └── leadController.js  # CRUD + email logic
│   ├── models/
│   │   └── Lead.js            # Mongoose schema
│   ├── routes/
│   │   ├── leadRoutes.js      # /api/leads CRUD
│   │   ├── trackRoutes.js     # /api/track (open + click)
│   │   └── analyticsRoutes.js # /api/analytics
│   ├── utils/
│   │   └── emailService.js    # Nodemailer + HTML template
│   └── server.js              # Entry point
```
