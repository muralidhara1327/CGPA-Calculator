# Student SGPA and Internal Performance Prediction System

A modern, responsive web application for calculating semester SGPA and predicting required performance to achieve target grades.

## Features

### 🔐 Authentication & User Management
- Role-based login (Student/Faculty)
- USN, name, academic year, and semester tracking
- Persistent session management

### 📚 Subject Management
- Add/delete subjects dynamically
- Support for Lab and Theory (Non-Lab) subjects
- Credit assignment per subject
- Subject code and name tracking

### 📊 Internal Assessment Evaluation
**Non-Lab Subjects (50 CIE Marks):**
- Best 2 of 3 internals (40 marks each) → scaled to 25 marks
- Assignments → 25 marks
- Total CIE = 50 marks

**Lab Subjects (50 CIE Marks):**
- Best 2 of 3 internals → scaled to 15 marks
- Lab Practical (50 marks) → scaled to 10 marks
- Lab Record → 10 marks
- Assignments → 15 marks
- Total CIE = 50 marks

### 📝 Semester End Examination (SEE)
- SEE conducted for 100 marks
- Automatically scaled to 50 marks
- Final Total = CIE (50) + SEE (50) = 100 marks

### 🎓 SGPA Calculation
- Automatic grade assignment based on marks
- Grade point calculation
- SGPA formula: Σ(Credit × Grade Point) / Σ(Credits)
- Subject-wise performance breakdown

### 🎯 Performance Prediction
- Set target SGPA
- Calculate required marks for each subject
- Get personalized recommendations
- Deficit analysis for each subject

## Grading System

| Grade | Marks Range | Grade Points |
|-------|-------------|--------------|
| O     | 90-100      | 10           |
| A+    | 80-89       | 9            |
| A     | 70-79       | 8            |
| B+    | 60-69       | 7            |
| B     | 55-59       | 6            |
| C     | 50-54       | 5            |
| P     | 40-49       | 4            |
| F     | 0-39        | 0            |

## Tech Stack

- **Frontend:** HTML5, CSS3, JavaScript (ES6+)
- **Styling:** Custom CSS with modern design patterns
- **Storage:** LocalStorage (JSON-based)
- **Fonts:** Inter, Outfit (Google Fonts)

## Installation & Usage

1. **Clone or download** this repository
2. **Open** `index.html` in a modern web browser
3. **Login** with your details:
   - Enter USN, name, academic year, semester
   - Select role (Student/Faculty)
4. **Add subjects** from the Subjects page
5. **Enter marks** for each assessment component
6. **Calculate SGPA** to view your performance
7. **Use Prediction** to set targets and get recommendations

## File Structure

```
Java Project/
├── index.html          # Main application file
├── styles/
│   └── main.css       # Premium styling
├── js/
│   └── app.js         # Application logic
└── README.md          # Documentation
```

## Data Storage

All data is stored locally in your browser using LocalStorage:
- `sgpa_user` - User information
- `sgpa_subjects` - Subject list
- `sgpa_marks` - Marks data

**Note:** Clearing browser data will reset the application.

## Browser Compatibility

- Chrome/Edge (recommended)
- Firefox
- Safari
- Opera

## Features Highlights

✅ **Responsive Design** - Works on desktop, tablet, and mobile  
✅ **Dark Theme** - Modern glassmorphism UI  
✅ **Real-time Calculations** - Instant SGPA updates  
✅ **No Backend Required** - Fully client-side  
✅ **Offline Capable** - Works without internet  
✅ **Data Persistence** - Automatic save functionality  

## Usage Tips

1. **For Students:**
   - Add all your semester subjects first
   - Enter marks as you receive them
   - Use prediction to plan your study strategy
   - Track your SGPA throughout the semester

2. **For Faculty:**
   - Manage subject structures
   - Enter student marks
   - View performance analytics

## Future Enhancements

- Multi-semester tracking
- CGPA calculation
- Export reports (PDF)
- Data import/export
- Performance charts
- Comparison with class average

## License

This project is open-source and available for educational purposes.

## Support

For issues or questions, please refer to the documentation or contact your institution's IT support.

---

**Developed with ❤️ for academic excellence**
