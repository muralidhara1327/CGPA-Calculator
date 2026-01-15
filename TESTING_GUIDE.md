# 🧪 Testing Guide - SGPA System v2.0

## Quick Test Scenarios

### ✅ Test 1: Registration Flow

**Objective:** Verify users must register before login

**Steps:**
1. Open `index.html` in browser
2. You should see **Login Form** by default
3. Click **"Register here"** link at bottom
4. Registration form should appear

**Register a Student:**
- USN: `1MS21CS001`
- Name: `John Doe`
- Academic Year: `2024-25`
- Semester: `3`
- Role: **Student**
- Password: `student123`
- Confirm Password: `student123`
- Click **"Register Account"**

**Expected Result:**
- ✅ Green success message: "Registration successful! Please login."
- ✅ Form switches back to login
- ✅ Data saved in browser localStorage

**Register a Faculty:**
- Click "Register here" again
- USN: `FAC001`
- Name: `Dr. Jane Smith`
- Academic Year: `2024-25`
- Semester: `3`
- Role: **Faculty**
- Password: `faculty123`
- Confirm Password: `faculty123`
- Click **"Register Account"**

**Expected Result:**
- ✅ Success message shown
- ✅ Can now login as faculty

---

### ✅ Test 2: Login with Credentials

**Objective:** Verify JSON-based authentication works

**Test Invalid Login:**
1. USN: `WRONG123`
2. Password: `wrongpass`
3. Click "Login to Dashboard"

**Expected Result:**
- ❌ Red error message: "Invalid USN or password!"

**Test Valid Student Login:**
1. USN: `1MS21CS001`
2. Password: `student123`
3. Click "Login to Dashboard"

**Expected Result:**
- ✅ Dashboard opens
- ✅ Shows "John Doe" in top right
- ✅ Shows "Student" role
- ✅ All 5 menu items visible (Overview, Subjects, Marks Entry, SGPA Calculator, Prediction)

---

### ✅ Test 3: Subject Management (Student)

**Objective:** Verify subjects are saved and displayed correctly

**While logged in as student:**

**Add Theory Subject:**
1. Click **"Subjects"** in sidebar
2. Click **"Add Subject"** button
3. Fill form:
   - Subject Name: `Data Structures`
   - Subject Code: `CS301`
   - Subject Type: **Theory (Non-Lab)** ← Important!
   - Credits: `4`
4. Click **"Add Subject"**

**Expected Result:**
- ✅ Modal closes
- ✅ Subject appears immediately in list
- ✅ Badge shows **"Theory"** (not "Lab")
- ✅ Shows "Code: CS301"
- ✅ Shows "4 Credits"

**Add Lab Subject:**
1. Click **"Add Subject"** again
2. Fill form:
   - Subject Name: `DBMS Lab`
   - Subject Code: `CS302L`
   - Subject Type: **Lab** ← Important!
   - Credits: `2`
3. Click **"Add Subject"**

**Expected Result:**
- ✅ Subject appears immediately
- ✅ Badge shows **"Lab"** (not "Theory")
- ✅ Both subjects visible in list

**Verify Persistence:**
1. Click **"Logout"**
2. Login again with same credentials
3. Click **"Subjects"**

**Expected Result:**
- ✅ Both subjects still there
- ✅ Types are correct (Theory and Lab)

---

### ✅ Test 4: Subject Type in Marks Entry

**Objective:** Verify correct CIE components based on subject type

**While logged in as student:**

1. Click **"Marks Entry"** in sidebar
2. Find **Data Structures** (Theory subject)

**Expected Result for Theory Subject:**
- ✅ Shows: Internal 1, 2, 3 (40 each)
- ✅ Shows: Assignments (25)
- ✅ Shows: SEE (100)
- ❌ Does NOT show: Lab Practical, Lab Record

3. Find **DBMS Lab** (Lab subject)

**Expected Result for Lab Subject:**
- ✅ Shows: Internal 1, 2, 3 (40 each)
- ✅ Shows: Lab Practical (50)
- ✅ Shows: Lab Record (10)
- ✅ Shows: Assignments (15) ← Note: 15 not 25
- ✅ Shows: SEE (100)

**This confirms subject types are working correctly!**

---

### ✅ Test 5: Faculty Dashboard

**Objective:** Verify faculty sees different dashboard than students

**Logout and Login as Faculty:**
1. Click **"Logout"**
2. USN: `FAC001`
3. Password: `faculty123`
4. Click **"Login to Dashboard"**

**Expected Result - Different Dashboard:**
- ✅ Shows "Dr. Jane Smith" in top right
- ✅ Shows "Faculty" role
- ✅ Dashboard shows **"Faculty Dashboard"** title
- ✅ Shows system statistics:
  - Total Students: 1
  - Total Faculty: 1
  - Total Users: 2
  - My Subjects: 0

**Expected Result - Different Sidebar:**
- ✅ Overview (visible)
- ✅ Subjects (visible)
- ❌ Marks Entry (HIDDEN)
- ✅ SGPA Calculator (visible)
- ❌ Prediction (HIDDEN)

**Expected Result - Student List:**
- ✅ Shows table with registered students
- ✅ Shows: John Doe, 1MS21CS001, 2024-25, 3rd, Registration date

**Expected Result - Quick Actions:**
- ✅ Manage Subjects
- ✅ View SGPA
- ✅ Download Data
- ✅ View Students

**This confirms faculty dashboard is completely different!**

---

### ✅ Test 6: User-Specific Data

**Objective:** Verify each user has separate data

**As Faculty, Add a Subject:**
1. Click **"Subjects"**
2. Add subject:
   - Name: `Advanced Algorithms`
   - Code: `CS501`
   - Type: `Theory`
   - Credits: `4`

**Expected Result:**
- ✅ Faculty has 1 subject

**Logout and Login as Student:**
1. Logout
2. Login as `1MS21CS001` / `student123`
3. Click **"Subjects"**

**Expected Result:**
- ✅ Student still has 2 subjects (Data Structures, DBMS Lab)
- ❌ Student does NOT see faculty's "Advanced Algorithms"

**This confirms data isolation works!**

---

### ✅ Test 7: Complete SGPA Calculation

**Objective:** Verify CIE calculation differs by subject type

**As Student, Enter Marks:**

**For Data Structures (Theory):**
1. Click **"Marks Entry"**
2. Enter:
   - Internal 1: `35`
   - Internal 2: `38`
   - Internal 3: `40` (best 2: 38+40=78)
   - Assignments: `23`
   - SEE: `85`

**For DBMS Lab (Lab):**
1. Enter:
   - Internal 1: `30`
   - Internal 2: `35`
   - Internal 3: `38` (best 2: 35+38=73)
   - Lab Practical: `45`
   - Lab Record: `9`
   - Assignments: `14`
   - SEE: `90`

**Calculate SGPA:**
1. Click **"SGPA Calculator"**
2. Click **"Calculate SGPA"** button

**Expected Result:**

**Data Structures (Theory):**
- CIE: (78/80 × 25) + 23 = 24.38 + 23 = **47.38**
- SEE: 85/100 × 50 = **42.50**
- Total: **89.88**
- Grade: **A+**
- Points: **9**

**DBMS Lab (Lab):**
- CIE: (73/80 × 15) + (45/50 × 10) + 9 + 14 = 13.69 + 9 + 9 + 14 = **45.69**
- SEE: 90/100 × 50 = **45.00**
- Total: **90.69**
- Grade: **O**
- Points: **10**

**SGPA:**
- Total Credits: 4 + 2 = 6
- Total Points: (9 × 4) + (10 × 2) = 36 + 20 = 56
- SGPA: 56 / 6 = **9.33**

**This confirms CIE calculation is correct for both types!**

---

### ✅ Test 8: Data Download (Faculty)

**Objective:** Verify JSON export works

**As Faculty:**
1. Login as `FAC001` / `faculty123`
2. Click **"Download Data"** in Quick Actions

**Expected Result:**
- ✅ File downloads: `sgpa_data_YYYY-MM-DD.json`
- ✅ File contains:
  - All registered users
  - All subjects
  - All marks
  - Timestamps

**Open the JSON file:**
```json
{
  "users": [
    {
      "usn": "1MS21CS001",
      "password": "student123",
      "name": "John Doe",
      ...
    },
    {
      "usn": "FAC001",
      "password": "faculty123",
      "name": "Dr. Jane Smith",
      ...
    }
  ],
  "subjects": [...],
  "marks": {...},
  "exportedAt": "2026-01-15T..."
}
```

**This confirms JSON storage is working!**

---

## 🎯 Quick Verification Checklist

Use this checklist to verify all fixes:

### Registration & Login
- [ ] Can register new student
- [ ] Can register new faculty
- [ ] Password validation works
- [ ] Can't register duplicate USN
- [ ] Can login with correct credentials
- [ ] Error shown for wrong credentials
- [ ] Can toggle between register/login forms

### Subject Management
- [ ] Can add theory subject
- [ ] Can add lab subject
- [ ] Subjects appear immediately after adding
- [ ] Theory badge shows correctly
- [ ] Lab badge shows correctly
- [ ] Can delete subjects
- [ ] Subjects persist after logout/login

### Marks Entry
- [ ] Theory subjects show correct fields (no lab fields)
- [ ] Lab subjects show all lab fields
- [ ] Assignment marks differ (25 for theory, 15 for lab)
- [ ] Marks auto-save

### SGPA Calculation
- [ ] Theory CIE calculated correctly
- [ ] Lab CIE calculated correctly
- [ ] SEE scaled correctly (100→50)
- [ ] Grades assigned correctly
- [ ] SGPA formula works

### Faculty Dashboard
- [ ] Shows different layout than student
- [ ] Shows system statistics
- [ ] Shows registered students table
- [ ] Hides marks entry from sidebar
- [ ] Hides prediction from sidebar
- [ ] Can download data

### Data Isolation
- [ ] Student data separate from faculty data
- [ ] Each user has own subjects
- [ ] Each user has own marks
- [ ] Logout/login preserves data

---

## 🐛 Known Limitations

1. **Client-Side Only**
   - No server backend
   - Data stored in browser only
   - Clearing browser data deletes everything

2. **Password Security**
   - Passwords stored in plain text in localStorage
   - Not suitable for production without backend

3. **No Password Recovery**
   - If password forgotten, can't recover
   - Would need to clear localStorage and re-register

4. **Single Browser**
   - Data doesn't sync across browsers
   - Must use same browser to access data

---

## ✅ All Tests Passed!

If all the above tests pass, then:

✅ **Registration system** is working  
✅ **JSON-based login** is working  
✅ **Subjects display** is fixed  
✅ **Subject type selection** is fixed  
✅ **Faculty dashboard** is different from student  
✅ **User-specific data** is isolated  
✅ **CIE calculation** is correct for both types  
✅ **Data export** is working  

**The system is fully functional! 🎉**

---

**Testing Date:** January 15, 2026  
**Version:** 2.0  
**Status:** ✅ Ready for Use
