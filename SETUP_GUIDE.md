# 🚀 SGPA System - Setup Guide with Persistent Storage

## ✅ What's New - Permanent Data Storage!

Your SGPA system now stores data in **actual JSON files** that persist permanently on your computer!

### **Data Storage Location:**
```
c:/Users/DELL/OneDrive/Desktop/Java Project/data/
├── users.json      (All registered users)
├── subjects.json   (All subjects by user)
└── marks.json      (All marks by user)
```

---

## 📋 Prerequisites

### **1. Install Node.js**

**Check if Node.js is installed:**
```powershell
node --version
```

**If not installed:**
1. Go to: https://nodejs.org/
2. Download the **LTS version** (recommended)
3. Run the installer
4. Restart your computer

---

## 🎯 Quick Start (3 Steps)

### **Step 1: Install Dependencies**

Open PowerShell in the project folder and run:
```powershell
npm install
```

This installs:
- `express` - Web server
- `cors` - Cross-origin support

### **Step 2: Start the Server**

**Option A: Double-click**
```
Double-click: start-server.bat
```

**Option B: Command line**
```powershell
node server.js
```

You should see:
```
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║     SGPA Prediction System - Server Running               ║
║                                                            ║
║     Server URL: http://localhost:3000                      ║
║     Data stored in: [path]/data                            ║
║                                                            ║
║     Open your browser and go to:                          ║
║     http://localhost:3000/index.html                       ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
```

### **Step 3: Open the Application**

Open your browser and go to:
```
http://localhost:3000/index.html
```

---

## ✅ How It Works

### **Before (localStorage - NOT persistent):**
- Data stored in browser memory
- Lost when browser cache cleared
- Lost when using different browser
- ❌ NOT permanent

### **After (JSON files - PERMANENT):**
- Data stored in actual files on disk
- ✅ Survives browser refresh
- ✅ Survives browser restart
- ✅ Survives computer restart
- ✅ Can be backed up
- ✅ Can be transferred

---

## 📁 Data Files Explained

### **1. users.json**
Stores all registered users:
```json
[
  {
    "usn": "1MS21CS001",
    "password": "student123",
    "name": "John Doe",
    "academicYear": "2024-25",
    "semester": "3",
    "role": "student",
    "registeredAt": "2026-01-18T06:23:30.123Z"
  }
]
```

### **2. subjects.json**
Stores subjects for each user:
```json
{
  "1MS21CS001": [
    {
      "name": "Data Structures",
      "code": "CS301",
      "type": "theory",
      "credits": 4
    }
  ]
}
```

### **3. marks.json**
Stores marks for each user:
```json
{
  "1MS21CS001": {
    "0": {
      "internal1": 35,
      "internal2": 38,
      "internal3": 40,
      "assignments": 23,
      "see": 85
    }
  }
}
```

---

## 🧪 Testing Persistence

### **Test 1: Browser Refresh**
1. Register and login
2. Add a subject
3. **Refresh the page (F5)**
4. Login again
5. ✅ Subject should still be there!

### **Test 2: Browser Restart**
1. Add subjects and marks
2. **Close the browser completely**
3. Reopen browser
4. Go to `http://localhost:3000/index.html`
5. Login
6. ✅ All data should be there!

### **Test 3: Computer Restart**
1. Add all your data
2. **Restart your computer**
3. Start server: `start-server.bat`
4. Open browser: `http://localhost:3000/index.html`
5. Login
6. ✅ All data preserved!

---

## 🔧 Troubleshooting

### **Problem: "Could not connect to server"**

**Solution:**
1. Make sure server is running
2. Check console for errors
3. Verify URL is `http://localhost:3000/index.html`

### **Problem: "npm: command not found"**

**Solution:**
1. Install Node.js from https://nodejs.org/
2. Restart computer
3. Try again

### **Problem: "Port 3000 already in use"**

**Solution:**
1. Close other applications using port 3000
2. Or change port in `server.js`:
   ```javascript
   const PORT = 3001; // Change to different port
   ```

### **Problem: Data not saving**

**Solution:**
1. Check if `data` folder exists
2. Check file permissions
3. Look at server console for errors

---

## 💾 Backup Your Data

### **Manual Backup:**
1. Copy the entire `data` folder
2. Paste it somewhere safe (USB drive, cloud, etc.)

### **Automatic Download:**
1. Login as faculty
2. Click "Download Data"
3. Saves complete backup as JSON file

### **Restore from Backup:**
1. Stop the server
2. Replace `data` folder with backup
3. Start server again

---

## 🌐 Access from Other Devices

### **On Same Network:**

1. Find your computer's IP address:
   ```powershell
   ipconfig
   ```
   Look for "IPv4 Address" (e.g., 192.168.1.100)

2. On other device, open:
   ```
   http://192.168.1.100:3000/index.html
   ```

3. Update `API_URL` in `js/app.js`:
   ```javascript
   const API_URL = 'http://192.168.1.100:3000/api';
   ```

---

## 🔒 Security Notes

### **Current Setup (Development):**
- ⚠️ Passwords stored in plain text
- ⚠️ No encryption
- ⚠️ Only for local use

### **For Production Use:**
- Add password hashing (bcrypt)
- Add HTTPS
- Add authentication tokens
- Add input validation
- Add rate limiting

---

## 📊 API Endpoints

The server provides these endpoints:

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users` | Get all users |
| POST | `/api/register` | Register new user |
| POST | `/api/login` | Login user |
| GET | `/api/subjects/:usn` | Get user subjects |
| POST | `/api/subjects/:usn` | Save user subjects |
| GET | `/api/marks/:usn` | Get user marks |
| POST | `/api/marks/:usn` | Save user marks |
| GET | `/api/download` | Download all data |

---

## 🎓 Usage Workflow

### **First Time:**
1. Start server: `start-server.bat`
2. Open: `http://localhost:3000/index.html`
3. Register your account
4. Login
5. Add subjects
6. Enter marks
7. Calculate SGPA

### **Subsequent Use:**
1. Start server: `start-server.bat`
2. Open: `http://localhost:3000/index.html`
3. Login (your data is still there!)
4. Continue working

---

## 📝 Important Notes

### **Always Keep Server Running:**
- Server must be running to use the app
- Don't close the server window
- If server stops, just restart it

### **Data Location:**
- All data in `data` folder
- Backup this folder regularly
- Don't delete this folder!

### **Multiple Users:**
- Each user has separate data
- Data isolated by USN
- Faculty can see all students

---

## ✅ Verification Checklist

- [ ] Node.js installed
- [ ] Dependencies installed (`npm install`)
- [ ] Server starts without errors
- [ ] Can access `http://localhost:3000/index.html`
- [ ] Can register new user
- [ ] Can login
- [ ] Can add subjects
- [ ] Subjects persist after refresh
- [ ] Can enter marks
- [ ] Marks persist after refresh
- [ ] Data survives browser restart
- [ ] `data` folder contains JSON files

---

## 🎉 Success!

If all checks pass, your SGPA system now has **permanent data storage**!

Your data will:
- ✅ Survive page refresh
- ✅ Survive browser restart
- ✅ Survive computer restart
- ✅ Be backed up in JSON files
- ✅ Be retrievable anytime

---

## 📞 Quick Reference

**Start Server:**
```
Double-click: start-server.bat
```

**Access App:**
```
http://localhost:3000/index.html
```

**Data Location:**
```
data/users.json
data/subjects.json
data/marks.json
```

**Stop Server:**
```
Press Ctrl+C in server window
```

---

**Last Updated:** January 18, 2026  
**Version:** 3.0 (With Persistent Storage)  
**Status:** ✅ Production Ready with JSON File Storage
