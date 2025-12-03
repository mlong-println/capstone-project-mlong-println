# RunConnect - Comprehensive Testing Checklist

**Project:** RunConnect - Running Route & Training Platform  
**Testing Date:** December 2024  
**Tester:** Michael Long  
**Purpose:** Full application testing before production deployment

---

## Testing Legend
- [ ] Not Tested
- [✓] Passed
- [✗] Failed (Bug #)
- [~] Partial/Needs Review

---

## 1. Authentication & Authorization

### 1.1 User Registration
- [ ] Register with valid email and password
- [ ] Register with invalid email format
- [ ] Register with password < 8 characters
- [ ] Register with existing email (duplicate check)
- [ ] Email validation link sent
- [ ] Email verification works
- [ ] Redirect to dashboard after registration
- [ ] User role defaults to 'runner'

### 1.2 User Login
- [ ] Login with valid credentials
- [ ] Login with invalid email
- [ ] Login with invalid password
- [ ] Login with unverified email
- [ ] "Remember me" functionality
- [ ] Redirect to intended page after login
- [ ] Session persistence

### 1.3 Password Reset
- [ ] Request password reset with valid email
- [ ] Request password reset with invalid email
- [ ] Reset link sent to email
- [ ] Reset link works and loads form
- [ ] Reset password with valid new password
- [ ] Reset password with mismatched confirmation
- [ ] Expired reset link handling
- [ ] Already used reset link handling

### 1.4 Logout
- [ ] Logout successfully
- [ ] Session cleared after logout
- [ ] Redirect to home page
- [ ] Cannot access protected pages after logout

### 1.5 Role-Based Access Control
- [ ] Runner can access runner dashboard
- [ ] Runner cannot access admin dashboard
- [ ] Admin (Michael) can access admin dashboard
- [ ] Admin can access all runner features
- [ ] Unauthorized access redirects properly
- [ ] Role displayed correctly in navbar

---

## 2. Route Management

### 2.1 View Routes (Index)
- [✓] All routes displayed in grid/list
- [✓] Route cards show: name, distance, difficulty, rating
- [✓] Creator name displayed
- [✓] Difficulty badges color-coded correctly
- [✓] Search/filter functionality works
- [✓] Pagination works (if applicable)
- [✓] Empty state displays when no routes
- [✓] Click route card navigates to detail page

### 2.2 View Single Route (Show)
- [✓] Route details displayed correctly
- [✓] Map renders with route path
- [✓] Route coordinates display on map
- [✓] Distance shown accurately
- [✓] Difficulty level displayed
- [✓] Creator information shown
- [✓] Creation date displayed
- [✓] Ratings and reviews section visible
- [✓] Average rating calculated correctly
- [✓] Edit button visible for creator/admin only
- [✓] Delete button visible for creator/admin only

### 2.3 Create Route
- [✓] Create route form loads
- [✓] Map displays for waypoint placement
- [✓] Click to add waypoints
- [✓] Waypoints appear as markers
- [✓] Road snapping works (Google Maps API)
- [✓] Route line follows pedestrian paths
- [✓] Route line follows park trails accurately
- [✓] Toggle road snapping on/off works
- [✓] "Undo Last" button removes last waypoint (Bug #11 - fixed)
- [✓] "Clear Route" button removes all waypoints (Bug #11 - fixed)
- [✓] Distance calculated automatically
- [✓] Elevation profile displays (if available)
- [✓] Form fields: name, description, difficulty
- [✓] Name required validation
- [✓] Description optional
- [✓] Difficulty dropdown works
- [✓] Coordinates saved correctly
- [✓] Submit creates route successfully
- [✓] Redirect to route detail after creation
- [✓] Success message displayed
- [✓] Long routes (35km+) snap correctly (Bug #10 - fixed waypoint segmentation)

### 2.4 Edit Route
- [✓] Edit form loads with existing data
- [✓] Map displays existing route
- [✓] Existing waypoints editable
- [✓] Can add new waypoints
- [✓] Can remove waypoints
- [✓] Road snapping works on edit
- [✓] Distance updates on waypoint changes
- [✓] Form pre-filled with route data
- [✓] Update saves changes correctly
- [✓] Redirect to route detail after update
- [✓] Success message displayed
- [✓] Only creator/admin can edit
- [✓] Unauthorized users redirected

### 2.5 Delete Route
- [✓] Delete button visible for creator/admin
- [✓] Confirmation prompt before delete
- [✓] Route deleted from database
- [✓] Associated ratings deleted (cascade)
- [✓] Redirect to routes index after delete
- [✓] Success message displayed
- [✓] Unauthorized users cannot delete

### 2.6 Rate & Review Routes
- [✓] Star rating component displays
- [✓] Can select 1-5 stars
- [✓] Comment field available
- [✓] Submit rating saves to database
- [✓] Average rating updates
- [✓] Rating count updates
- [✓] User's rating displayed if exists
- [✓] Can update existing rating
- [✓] Cannot rate own route
- [✓] Must be authenticated to rate

---

## 3. Training Plans

### 3.1 View Training Plans (Index - Admin)
- [✓] All plans displayed (Bug #12 - fixed /trainer/ to /admin/ URLs)
- [✓] Plan cards show: name, duration, distance type, experience level
- [✓] Creator name displayed
- [✓] Active/total assignments count displayed
- [✓] Grouped by distance type
- [✓] Empty state when no plans
- [✓] Click plan navigates to detail

### 3.2 View Single Plan (Show - Admin)
- [✓] Plan details displayed (Bug #13 - fixed URL routing)
- [✓] Duration and experience level shown
- [✓] Distance type displayed
- [✓] Description rendered
- [✓] Prerequisites and goals visible
- [✓] Weekly schedule expandable by week (Bug #13 - added full breakdown)
- [✓] Workouts listed by day for each week
- [✓] Runner assignments section shows all assigned runners (Bug #13 - added progress tracking)
- [✓] Progress bars with completion percentage
- [✓] Status badges (Active/Paused/Completed)
- [✓] Current week and start date displayed
- [✓] Clickable runner names to view profiles

### 3.3 Create Training Plan (Admin)
- [✓] Create form loads (Bug #14 - added create functionality)
- [✓] Name field required
- [✓] Description field required (Bug #15 - added to fillable)
- [✓] Duration input works (1-52 weeks)
- [✓] Distance type dropdown works
- [✓] Experience level dropdown works
- [✓] Peak mileage optional field
- [✓] Prerequisites optional field
- [✓] Goals optional field
- [✓] Weekly schedule builder works
- [✓] Can switch between weeks
- [✓] Can add workouts to each week
- [✓] Workout fields: day, workout description
- [✓] Can remove workouts
- [✓] Submit creates plan successfully
- [✓] Redirect to plan detail after creation
- [✓] Weekly structure saves correctly

### 3.4 Edit Training Plan
- [ ] Edit form loads with data
- [ ] All fields pre-filled
- [ ] Weekly schedule editable
- [ ] Can add/remove workouts
- [ ] Update saves changes
- [ ] Only creator/admin can edit
- [ ] Redirect after update
- [ ] Success message displayed

### 3.5 Delete Training Plan
- [ ] Delete button visible for creator/admin
- [ ] Confirmation prompt
- [ ] Plan deleted from database
- [ ] Enrollments handled properly
- [ ] Redirect after delete
- [ ] Success message displayed

### 3.6 Enroll in Plan
- [ ] Enroll button works
- [ ] Enrollment saved to database
- [ ] Progress tracking initialized
- [ ] Redirect to plan detail
- [ ] Success message displayed
- [ ] Cannot enroll twice in same plan
- [ ] Must be authenticated to enroll

### 3.7 Track Progress
- [ ] Progress page loads for enrolled plan
- [ ] Current week highlighted
- [ ] Workouts listed by week
- [ ] Can mark workouts complete
- [ ] Completion status persists
- [ ] Progress percentage calculated
- [ ] Completion date recorded
- [ ] Can add notes to workouts
- [ ] Can log actual distance/time

### 3.8 Unenroll from Plan
- [ ] Unenroll button available
- [ ] Confirmation prompt
- [ ] Enrollment removed
- [ ] Progress data handled
- [ ] Redirect after unenroll
- [ ] Success message displayed

---

## 4. Activity Tracking (Runs)

### 4.1 Log a New Run
- [✓] Log run form loads
- [✓] Route selection dropdown works
- [✓] Shoe selection dropdown works (optional)
- [✓] Start time field works
- [✓] Time input (hours, minutes, seconds) works
- [✓] Notes field works (optional, max 250 chars)
- [✓] Photo upload works (optional)
- [✓] Public/private toggle works
- [✓] Pace calculated automatically
- [✓] Submit creates run successfully (Bug #16 - fixed CSRF token)
- [✓] Redirect to run history after creation
- [✓] Success message displayed

### 4.2 View Run History (Index)
- [✓] All user's runs displayed in table
- [✓] Shows: date, route name, distance, time, pace, difficulty
- [✓] Sorted by date (newest first)
- [✓] Empty state when no runs
- [✓] "View" action navigates to detail
- [✓] "Log New Run" button visible

### 4.3 View Single Run (Show)
- [✓] Run details displayed
- [✓] Date, distance, duration, pace shown
- [✓] Route name linked to route detail
- [✓] Notes displayed
- [✓] Photo displayed full-size (if uploaded)
- [✓] Map with route displayed
- [✓] Elevation gain shown (if available)
- [✓] Edit button for owner (Bug #17 - added)
- [✓] Delete button for owner
- [✓] Timeline shows start/end times
- [✓] Stats displayed in colored cards

### 4.4 Edit Run
- [✓] Edit form loads with existing data
- [✓] Route displayed (read-only)
- [✓] Shoe selection editable (Bug #18 - added)
- [✓] Time editable (hours, minutes, seconds) (Bug #18 - added)
- [✓] Notes editable
- [✓] Photo upload/replace works
- [✓] Public/private toggle works
- [✓] Current photo displayed
- [✓] Update saves changes (Bug #19 - fixed type casting)
- [✓] Redirect to run detail after update
- [✓] Success message displayed

### 4.5 Delete Run
- [✓] Delete button visible for owner
- [✓] Confirmation prompt before delete
- [✓] Run deleted from database
- [✓] Photo deleted if exists
- [✓] Redirect to run history
- [✓] Success message displayed

### 4.3 Log New Run
- [ ] Log run form loads
- [ ] Date picker works (defaults to today)
- [ ] Distance field (required, numeric)
- [ ] Duration field (required, time format)
- [ ] Route dropdown (optional, lists user's routes)
- [ ] Notes field (optional, textarea)
- [ ] Photo upload field (5MB max, JPG/PNG/GIF)
- [ ] Visibility toggle (default: public)
- [ ] File size validation
- [ ] File type validation
- [ ] Submit creates run successfully
- [ ] Photo uploaded to storage
- [ ] Redirect after creation
- [ ] Success message displayed

### 4.4 Edit Run
- [ ] Edit form loads with data
- [ ] All fields pre-filled
- [ ] Current photo displayed
- [ ] Can replace photo
- [ ] Can change visibility
- [ ] Update saves changes
- [ ] Only owner can edit
- [ ] Redirect after update
- [ ] Success message displayed

### 4.5 Delete Run
- [ ] Delete button visible for owner
- [ ] Confirmation prompt
- [ ] Run deleted from database
- [ ] Photo deleted from storage
- [ ] Redirect after delete
- [ ] Success message displayed

### 4.6 Run Statistics
- [ ] Total distance calculated
- [ ] Total runs counted
- [ ] Average pace calculated
- [ ] Weekly/monthly stats displayed
- [ ] Stats update after logging run
- [ ] Charts/graphs render correctly

---

## 5. Social Features

### 5.1 User Profiles
- [ ] Profile page loads
- [ ] User info displayed: name, email, bio
- [ ] Avatar/photo displayed
- [ ] Stats summary shown
- [ ] Recent activities listed
- [ ] Public routes listed
- [ ] Follow/Unfollow button works
- [ ] Follower count accurate
- [ ] Following count accurate
- [ ] Edit profile button for owner
- [ ] Cannot edit other users' profiles

### 5.2 Edit Profile
- [ ] Edit form loads with data
- [ ] Name field editable
- [ ] Email field editable
- [ ] Bio field editable
- [ ] Avatar upload works
- [ ] Update saves changes
- [ ] Redirect after update
- [ ] Success message displayed

### 5.3 Follow/Unfollow Users
- [ ] Follow button works
- [ ] Unfollow button works
- [ ] Follower count updates
- [ ] Following count updates
- [ ] Cannot follow self
- [ ] Must be authenticated

### 5.4 Activity Feed
- [ ] Feed displays followed users' activities
- [ ] Activities sorted by date (newest first)
- [ ] Shows: user name, activity type, details
- [ ] Photos displayed in feed
- [ ] Can click to view full activity
- [ ] Can like activities
- [ ] Can comment on activities
- [ ] Empty state when no activities
- [ ] Pagination works

### 5.5 Notifications
- [ ] Notification bell icon in navbar
- [ ] Unread count badge displays
- [ ] Dropdown shows recent notifications
- [ ] Notification types: new follower, comment, like, plan enrollment
- [ ] Click notification marks as read
- [ ] Click notification navigates to relevant page
- [ ] "Mark all as read" works
- [ ] Notifications persist across sessions

---

## 6. Safety Alerts

### 6.1 View Safety Alerts (Index)
- [ ] All active alerts displayed
- [ ] Sorted by severity (critical first)
- [ ] Alert cards show: type, severity, location, date
- [ ] Severity badges color-coded
- [ ] Alert type icons displayed
- [ ] Reporter name shown
- [ ] Empty state when no alerts
- [ ] Click alert navigates to detail

### 6.2 View Single Alert (Show)
- [ ] Alert details displayed
- [ ] Type and severity shown
- [ ] Location and coordinates displayed
- [ ] Description rendered
- [ ] Photos/videos displayed
- [ ] Reporter information shown
- [ ] Creation date displayed
- [ ] Expiration date shown (if set)
- [ ] Status badge (active/inactive)
- [ ] Edit button for creator/admin
- [ ] Delete button for creator/admin
- [ ] Mark inactive button for creator/admin

### 6.3 Create Safety Alert
- [ ] Create form loads
- [ ] Alert type dropdown works
- [ ] Severity selector works
- [ ] Location field required
- [ ] Coordinates optional
- [ ] Description required
- [ ] Expiration date optional (date picker)
- [ ] Photo/video upload (10MB max each)
- [ ] Multiple file uploads work
- [ ] File size validation
- [ ] File type validation
- [ ] Submit creates alert successfully
- [ ] Media uploaded to storage
- [ ] Redirect after creation
- [ ] Success message displayed

### 6.4 Update Alert Status
- [ ] Mark inactive button works
- [ ] Status updated in database
- [ ] Badge updates to "Inactive"
- [ ] Alert still visible but marked
- [ ] Only creator/admin can update

### 6.5 Delete Safety Alert
- [ ] Delete button visible for creator/admin
- [ ] Confirmation prompt
- [ ] Alert deleted from database
- [ ] Media deleted from storage
- [ ] Redirect after delete
- [ ] Success message displayed

---

## 7. Admin Features

### 7.1 Admin Dashboard
- [ ] Dashboard loads for admin user
- [ ] Stats summary displayed
- [ ] Total users count
- [ ] Total routes count
- [ ] Total plans count
- [ ] Total runs count
- [ ] Recent activity feed
- [ ] Quick links to admin sections

### 7.2 Admin Navbar Dropdowns
- [ ] Athletes dropdown displays
- [ ] Routes dropdown displays
- [ ] Social dropdown displays
- [ ] Admin dropdown displays
- [ ] All links functional
- [ ] Dropdowns close on outside click
- [ ] Dropdowns close on link click

### 7.3 User Management
- [ ] View all users list
- [ ] User info displayed
- [ ] Can view user profiles
- [ ] Can delete users (with confirmation)
- [ ] Can change user roles
- [ ] Search/filter users works
- [ ] Pagination works

### 7.4 Route Management (Admin)
- [ ] View all routes (including private)
- [ ] Can edit any route
- [ ] Can delete any route
- [ ] Route approval workflow (if implemented)

### 7.5 Notifications (Admin)
- [ ] Notified when user completes admin-created route
- [ ] Notified when user enrolls in admin-created plan
- [ ] Notification preferences work

---

## 8. UI/UX & Responsiveness

### 8.1 Navigation
- [ ] Navbar displays correctly
- [ ] Logo/brand name visible
- [ ] Navigation links work
- [ ] Dropdown menus work
- [ ] Active page highlighted
- [ ] Mobile menu toggle works
- [ ] User menu dropdown works
- [ ] Logout link works

### 8.2 Responsive Design
- [ ] Desktop view (1920x1080)
- [ ] Laptop view (1366x768)
- [ ] Tablet view (768x1024)
- [ ] Mobile view (375x667)
- [ ] All elements visible and accessible
- [ ] No horizontal scrolling
- [ ] Touch targets adequate size
- [ ] Forms usable on mobile

### 8.3 Theme & Styling
- [ ] Consistent color scheme
- [ ] Readable fonts and sizes
- [ ] Proper contrast ratios
- [ ] Buttons styled consistently
- [ ] Forms styled consistently
- [ ] Cards/containers styled consistently
- [ ] Icons display correctly
- [ ] Loading states visible

### 8.4 Accessibility
- [ ] Keyboard navigation works
- [ ] Focus indicators visible
- [ ] Alt text on images
- [ ] Form labels associated
- [ ] Error messages clear
- [ ] ARIA labels where needed
- [ ] Color not sole indicator

---

## 9. Performance & Loading

### 9.1 Page Load Times
- [ ] Home page loads < 3 seconds
- [ ] Dashboard loads < 3 seconds
- [ ] Routes index loads < 3 seconds
- [ ] Map rendering < 2 seconds
- [ ] Image loading optimized
- [ ] No blocking resources

### 9.2 API Response Times
- [ ] Route snapping < 2 seconds
- [ ] Form submissions < 1 second
- [ ] Search/filter < 1 second
- [ ] Data fetching < 1 second

### 9.3 Loading States
- [ ] Spinners/loaders display during operations
- [ ] Skeleton screens for content loading
- [ ] Disabled buttons during submission
- [ ] Loading text/indicators clear

---

## 10. Error Handling

### 10.1 Form Validation
- [ ] Required fields validated
- [ ] Email format validated
- [ ] Numeric fields validated
- [ ] File size validated
- [ ] File type validated
- [ ] Error messages clear and helpful
- [ ] Errors display near relevant fields
- [ ] Form retains data on error

### 10.2 Network Errors
- [ ] API timeout handled gracefully
- [ ] 404 errors handled
- [ ] 500 errors handled
- [ ] Connection lost handled
- [ ] Retry mechanisms work
- [ ] Error messages user-friendly

### 10.3 Edge Cases
- [ ] Empty states handled
- [ ] No data scenarios
- [ ] Deleted resource access
- [ ] Expired sessions handled
- [ ] Concurrent edits handled
- [ ] Invalid URLs handled

---

## 11. Data Integrity

### 11.1 Database Operations
- [ ] Create operations save correctly
- [ ] Update operations modify correctly
- [ ] Delete operations remove correctly
- [ ] Cascade deletes work properly
- [ ] Foreign key constraints enforced
- [ ] Unique constraints enforced

### 11.2 Data Validation
- [ ] Server-side validation works
- [ ] Client-side validation works
- [ ] SQL injection prevented
- [ ] XSS attacks prevented
- [ ] CSRF protection enabled
- [ ] Input sanitization works

### 11.3 File Uploads
- [ ] Files saved to correct directory
- [ ] File names sanitized
- [ ] File permissions correct
- [ ] Old files deleted on update
- [ ] Storage limits enforced
- [ ] Malicious files rejected

---

## 12. Security

### 12.1 Authentication Security
- [ ] Passwords hashed (bcrypt)
- [ ] Session tokens secure
- [ ] Remember me tokens secure
- [ ] Password reset tokens expire
- [ ] Brute force protection
- [ ] Account lockout after failed attempts

### 12.2 Authorization Security
- [ ] Route protection works
- [ ] Middleware enforces roles
- [ ] Direct URL access blocked
- [ ] API endpoints protected
- [ ] Resource ownership verified

### 12.3 Data Security
- [ ] HTTPS enforced (production)
- [ ] Sensitive data encrypted
- [ ] SQL injection prevented
- [ ] XSS prevented
- [ ] CSRF tokens validated
- [ ] File upload security

---

## 13. Browser Compatibility

- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

---

## 14. Integration Testing

### 14.1 Complete User Flows
- [ ] New user registration → verify email → login → create route → log run
- [ ] Login → browse routes → rate route → enroll in plan → track progress
- [ ] Create route → edit route → delete route
- [ ] Follow user → view feed → like activity → comment
- [ ] Create safety alert → view alert → mark inactive
- [ ] Admin: view users → manage routes → view notifications

### 14.2 Google Maps API
- [ ] API key configured correctly
- [ ] Route snapping works consistently
- [ ] Walking mode returns pedestrian paths
- [ ] Park trails included in routes
- [ ] API quota not exceeded
- [ ] Fallback to straight lines if API fails

---

## 15. Production Readiness

### 15.1 Environment Configuration
- [ ] .env file configured for production
- [ ] APP_ENV=production
- [ ] APP_DEBUG=false
- [ ] Database credentials correct
- [ ] Google Maps API key set
- [ ] Mail configuration correct
- [ ] Storage paths correct

### 15.2 Deployment Checklist
- [ ] Database migrated
- [ ] Storage linked
- [ ] Permissions set correctly
- [ ] Caching configured
- [ ] Queue workers running (if needed)
- [ ] Cron jobs configured (if needed)
- [ ] SSL certificate installed
- [ ] Domain configured
- [ ] Backups configured

### 15.3 Post-Deployment Smoke Tests
- [ ] Home page loads
- [ ] Login works
- [ ] Registration works
- [ ] Create route works
- [ ] Log run works
- [ ] All major features functional
- [ ] No console errors
- [ ] No server errors

---

## Bug Tracking

### Critical Bugs (Must Fix Before Launch)
| # | Description | Page/Feature | Steps to Reproduce | Status |
|---|-------------|--------------|-------------------|--------|
|   |             |              |                   |        |

### High Priority Bugs
| # | Description | Page/Feature | Steps to Reproduce | Status |
|---|-------------|--------------|-------------------|--------|
|   |             |              |                   |        |

### Medium Priority Bugs
| # | Description | Page/Feature | Steps to Reproduce | Status |
|---|-------------|--------------|-------------------|--------|
|   |             |              |                   |        |

### Low Priority Bugs (Post-Launch)
| # | Description | Page/Feature | Steps to Reproduce | Status |
|---|-------------|--------------|-------------------|--------|
|   |             |              |                   |        |

---

## Testing Notes

### Testing Environment
- **OS:** Windows
- **Browser:** 
- **Screen Resolution:** 
- **Database:** MySQL
- **Server:** Laravel Development Server

### Test Data
- **Admin User:** michael@example.com
- **Test Runner 1:** 
- **Test Runner 2:** 
- **Test Routes:** 
- **Test Plans:** 

### Known Limitations
- 

### Future Enhancements (Post-Launch)
- 

---

## Sign-Off

**Tester:** ___________________________  
**Date:** ___________________________  
**Status:** [ ] Ready for Deployment  [ ] Needs Work  
**Notes:** 

---

**End of Testing Checklist**
