# RunConnect - Instructor Testing Guide

**Student:** Michael Long  
**Project:** Capstone - Running Community Platform  
**Live Site:** https://capstone-project-mlong-println-oaknvtyo.on-forge.com

---

## Quick Start for Testing

### 1. Create Your Account
1. Visit: https://capstone-project-mlong-println-oaknvtyo.on-forge.com/register
2. Fill in your details:
   - Name: (Your name)
   - Email: (Your email)
   - Role: **Runner** (recommended for full feature testing)
   - Password: (Your choice)
3. Click "Register"

### 2. Existing Test Accounts (Optional)
If you prefer to use pre-existing accounts:
- **Admin:** michael.long@runconnect.com
- **Runner 1:** Teffy Binky
- **Runner 2:** Estefania Durand

*(Contact me for passwords if needed)*

---

## Core Features to Test

### Authentication & User Management
- ✅ Register new account (Runner or Trainer role)
- ✅ Login/Logout
- ✅ Edit profile (Dashboard → Profile)
- ✅ Upload profile photo

### Routes (Main Feature)
- ✅ **Browse Routes:** Click "Routes" in navigation
- ✅ **Create Route:** 
  - Click "Create Route"
  - Click on map to add waypoints
  - Route snaps to roads/paths automatically
  - Fill in name, description, difficulty
  - Submit
- ✅ **View Route Details:** Click any route card
- ✅ **Edit/Delete:** Your own routes only

### Runs (Activity Tracking)
- ✅ **Log a Run:**
  - Dashboard → "Log New Run"
  - Select a route (or manual entry)
  - Enter time, date, notes
  - Upload photo (optional)
  - Set public/private
- ✅ **View Run History:** Dashboard shows recent runs
- ✅ **Run Details:** Click any run to see full details with map

### Social Features
- ✅ **Follow Users:**
  - Click "Find Athletes" in navigation
  - Search for users
  - Click "Follow" button
  - Other user must approve request
- ✅ **Activity Feed:** Dashboard shows runs from followed users
- ✅ **Like Runs:** Click heart icon on any run
- ✅ **Comment on Runs:** Add comments on run detail pages
- ✅ **Notifications:** Bell icon shows likes, comments, follow requests

### Training Plans (Runner)
- ✅ **Complete Profile First:** Must fill out runner profile (experience level, weekly mileage, goals) before accessing training plans
- ✅ **Browse Plans:** Click "Training Plans" → "Browse Plans"
- ✅ **View Plan Details:** Click any plan to see weekly schedule
- ✅ **Assign Plan:** Click "Assign to Me" on plan detail page
- ✅ **Track Progress:** Dashboard → "My Active Plan"
- ✅ **Mark Workouts Complete:** Check off completed workouts

### Achievements
- ✅ **View Achievements:** Click "Achievements" in navigation
- ✅ **See Progress:** Distance and elevation milestones
- ✅ **Earn Achievements:** Log runs to earn badges

### Safety Alerts
- ✅ **View Alerts:** Click "Safety Alerts" in navigation
- ✅ **Create Alert:** Report hazards, wildlife, etc.
- ✅ **Alert Types:** Construction, Wildlife, Hazard, Weather, Other

### Events
- ✅ **Browse Events:** Click "Events" in navigation
- ✅ **Create Event:** Organize group runs
- ✅ **Join/Leave Events:** RSVP to events
- ✅ **View Participants:** See who's attending

### Forum
- ✅ **Browse Posts:** Click "Forum" in navigation
- ✅ **Create Post:** Share tips, ask questions, discuss running topics
- ✅ **Comment:** Reply to existing posts
- ✅ **Like Posts/Comments:** Show appreciation for content
- ✅ **Categories:** Training Tips, Gear Reviews, Race Reports, General Discussion

### Challenges (Monthly Achievements)
- ✅ **View Challenges:** Click "Achievements" → "Challenges" tab
- ✅ **Join Challenge:** Click "Join Challenge" on any active challenge
- ✅ **Track Progress:** See your progress toward monthly distance/elevation goals
- ✅ **Leaderboards:** View challenge leaderboards showing top performers
- ✅ **Earn Badges:** Complete challenges to earn achievement badges

### Route Leaderboards
- ✅ **View Leaderboard:** Click any route → scroll to "Route Leaderboard"
- ✅ **See Rankings:** All runners who completed the route, ranked by fastest time
- ✅ **Compare Times:** See your personal best vs others

### Gear Tracking
- ✅ **Add Shoes:** Dashboard → "Gear" → "Add Shoe"
- ✅ **Track Mileage:** Automatically updates when logging runs
- ✅ **Retire Shoes:** Mark shoes as retired when worn out

---

## Testing Recommendations

### Basic Flow (15 minutes)
1. Register account
2. Create a route (click on map to draw)
3. Log a run using that route
4. Upload a photo with the run
5. Browse other routes
6. View achievements

### Social Flow (10 minutes)
1. Find another user (search "Teffy" or "Estefania")
2. Send follow request
3. View their runs in your feed
4. Like and comment on a run
5. Check notifications (bell icon)

### Training Flow (10 minutes)
1. Complete your runner profile (Dashboard → "Runner Profile")
2. Browse training plans
3. View a plan's weekly schedule
4. Assign a plan to yourself
5. View "My Active Plan"
6. Mark a workout as complete

### Community Flow (10 minutes)
1. Browse forum posts (click "Forum")
2. Read and like existing posts
3. Create your own forum post
4. Browse events (click "Events")
5. Join an upcoming event
6. View route leaderboards (click any route → scroll down)

---

## Technical Details

### Technology Stack
- **Backend:** Laravel 12 (PHP)
- **Frontend:** React 18 + TypeScript
- **Framework:** Inertia.js (SPA experience)
- **Styling:** Tailwind CSS
- **Database:** MySQL
- **Maps:** Google Maps API
- **Hosting:** Laravel Forge (DigitalOcean)

### Key Features Implemented
- Role-based access control (Runner, Trainer, Admin)
- Real-time notifications
- Interactive map-based route creation
- Photo uploads with storage
- Social networking (follow, like, comment)
- Achievement system
- Training plan management
- Safety alert system
- Event management
- Gear/shoe tracking
- Direct messaging
- Forum system

### Security Features
- CSRF protection
- Password hashing (bcrypt)
- Authentication middleware
- Role-based authorization
- Input validation
- XSS prevention
- File upload validation

---

## Known Limitations

1. **Email Verification:** Email verification is configured but requires SMTP setup for production use.

2. **Mobile App:** This is a web application only (no native mobile apps).

---

## Support

If you encounter any issues during testing:
- Check the browser console for errors (F12)
- Try refreshing the page
- Contact me: michael.long@runconnect.com

---

## Project Documentation

Additional documentation available in the repository:
- `FINAL_PROJECT_REPORT.md` - Comprehensive project report
- `SECURITY_AUDIT.md` - Security analysis (OWASP Top 10)
- `README.md` - Technical setup and installation guide

---

**Thank you for reviewing my capstone project!**

I've put significant effort into making this a production-ready application that demonstrates real-world development skills. I hope you enjoy exploring the features as much as I enjoyed building them.

— Michael Long
