# Quick Start Guide - SGPA Prediction System

## 🚀 Getting Started (3 Easy Steps)

### Step 1: Launch the Application
**Option A:** Double-click `launch.bat`  
**Option B:** Open `index.html` in your web browser

### Step 2: Login
Fill in the login form:
- **USN:** Your university seat number (e.g., 1MS21CS001)
- **Student Name:** Your full name
- **Academic Year:** Select from dropdown (e.g., 2024-25)
- **Semester:** Choose 1st through 8th
- **Role:** Select Student or Faculty

Click **"Login to Dashboard"**

### Step 3: Start Using the System

## 📋 Complete Workflow

### 1️⃣ Add Subjects
1. Click **"Subjects"** in the sidebar
2. Click **"Add Subject"** button
3. Fill in:
   - Subject Name (e.g., Data Structures)
   - Subject Code (e.g., CS301)
   - Subject Type (Theory or Lab)
   - Credits (1-6)
4. Click **"Add Subject"**
5. Repeat for all subjects

### 2️⃣ Enter Marks
1. Click **"Marks Entry"** in the sidebar
2. For each subject, enter:
   
   **Internal Assessments:**
   - Internal 1 (out of 40)
   - Internal 2 (out of 40)
   - Internal 3 (out of 40)
   - *System automatically picks best 2*
   
   **For Lab Subjects:**
   - Lab Practical (out of 50)
   - Lab Record (out of 10)
   - Assignments (out of 15)
   
   **For Theory Subjects:**
   - Assignments (out of 25)
   
   **Semester End Exam:**
   - SEE Marks (out of 100)

3. Marks are auto-saved as you type

### 3️⃣ Calculate SGPA
1. Click **"SGPA Calculator"** in the sidebar
2. Click **"Calculate SGPA"** button
3. View your:
   - Overall SGPA
   - Grade
   - Subject-wise breakdown
   - CIE and SEE marks

### 4️⃣ Predict Performance
1. Click **"Prediction"** in the sidebar
2. Enter your **Target SGPA** (e.g., 8.5)
3. Click **"Generate Prediction"**
4. View:
   - Required marks per subject
   - Current vs Required comparison
   - Personalized recommendations

## 💡 Pro Tips

### For Best Results:
✅ Add all subjects at the beginning of the semester  
✅ Update marks immediately after each assessment  
✅ Use prediction feature to plan your study strategy  
✅ Check SGPA regularly to track progress  

### Understanding CIE Calculation:

**Theory Subjects:**
```
Best 2 Internals (80 marks) → Scaled to 25 marks
Assignments (25 marks) → Direct
Total CIE = 50 marks
```

**Lab Subjects:**
```
Best 2 Internals (80 marks) → Scaled to 15 marks
Lab Practical (50 marks) → Scaled to 10 marks
Lab Record → 10 marks (direct)
Assignments → 15 marks (direct)
Total CIE = 50 marks
```

**Final Marks:**
```
Total = CIE (50) + SEE (50) = 100 marks
```

## 🎯 Example Usage

### Scenario: Calculate SGPA for 3 subjects

**Subject 1: Data Structures (Theory, 4 credits)**
- Internal 1: 35/40
- Internal 2: 38/40 ✓
- Internal 3: 40/40 ✓
- Assignments: 23/25
- SEE: 85/100
- **CIE:** (78/80 × 25) + 23 = 47.38
- **SEE:** 85/100 × 50 = 42.5
- **Total:** 89.88 → **Grade: A+ (9 points)**

**Subject 2: DBMS Lab (Lab, 2 credits)**
- Internal 1: 30/40
- Internal 2: 35/40 ✓
- Internal 3: 38/40 ✓
- Lab Practical: 45/50
- Lab Record: 9/10
- Assignments: 14/15
- SEE: 90/100
- **CIE:** (73/80 × 15) + (45/50 × 10) + 9 + 14 = 45.69
- **SEE:** 90/100 × 50 = 45
- **Total:** 90.69 → **Grade: O (10 points)**

**Subject 3: Computer Networks (Theory, 3 credits)**
- Internal 1: 32/40 ✓
- Internal 2: 28/40
- Internal 3: 36/40 ✓
- Assignments: 22/25
- SEE: 75/100
- **CIE:** (68/80 × 25) + 22 = 43.25
- **SEE:** 75/100 × 50 = 37.5
- **Total:** 80.75 → **Grade: A+ (9 points)**

**SGPA Calculation:**
```
Total Credits = 4 + 2 + 3 = 9
Total Points = (9×4) + (10×2) + (9×3) = 36 + 20 + 27 = 83
SGPA = 83 / 9 = 9.22
```

## 🔧 Troubleshooting

**Q: My data disappeared!**  
A: Data is stored in browser localStorage. Don't clear browser data. Use the same browser each time.

**Q: SGPA not calculating?**  
A: Ensure you've entered marks for all components of each subject.

**Q: Can I edit subjects after adding?**  
A: Currently, you can delete and re-add subjects. Marks will be preserved by index.

**Q: How accurate is the prediction?**  
A: Predictions are based on mathematical calculations. Actual results depend on your performance.

## 📱 Mobile Usage

The application is fully responsive! Access it on:
- 📱 Smartphones
- 📱 Tablets  
- 💻 Laptops
- 🖥️ Desktops

## 🎓 Academic Tips

1. **Aim for consistency** - Maintain steady performance across all subjects
2. **Focus on high-credit subjects** - They impact SGPA more
3. **Don't ignore internals** - They contribute 50% to final marks
4. **Use predictions wisely** - Plan early, don't wait for last minute
5. **Track progress** - Regular monitoring helps identify weak areas

## 📊 Dashboard Overview

**Stats Cards:**
- Total Subjects
- Total Credits
- Current SGPA
- Performance Grade

**Student Information:**
- USN, Name, Year, Semester

**Quick Actions:**
- Add Subject
- Enter Marks
- Calculate SGPA
- Predict Performance

---

**Need Help?** Refer to README.md for detailed documentation.

**Enjoy tracking your academic success! 🎓✨**
