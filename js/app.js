// SGPA Prediction System - Main Application
class SGPASystem {
    constructor() {
        this.currentUser = null;
        this.subjects = [];
        this.marks = {};
        this.users = [];
        this.gradingRules = this.initGradingRules();
        this.init();
    }

    init() {
        this.loadData();
        this.attachEventListeners();
    }

    initGradingRules() {
        return {
            'O': { min: 90, max: 100, points: 10 },
            'A+': { min: 80, max: 89, points: 9 },
            'A': { min: 70, max: 79, points: 8 },
            'B+': { min: 60, max: 69, points: 7 },
            'B': { min: 55, max: 59, points: 6 },
            'C': { min: 50, max: 54, points: 5 },
            'P': { min: 40, max: 49, points: 4 },
            'F': { min: 0, max: 39, points: 0 }
        };
    }

    loadData() {
        const userData = localStorage.getItem('sgpa_user');
        const usersData = localStorage.getItem('sgpa_users');
        const subjectsData = localStorage.getItem('sgpa_subjects');
        const marksData = localStorage.getItem('sgpa_marks');

        if (userData) this.currentUser = JSON.parse(userData);
        if (usersData) this.users = JSON.parse(usersData);
        if (subjectsData) this.subjects = JSON.parse(subjectsData);
        if (marksData) this.marks = JSON.parse(marksData);
    }

    saveData() {
        localStorage.setItem('sgpa_user', JSON.stringify(this.currentUser));
        localStorage.setItem('sgpa_users', JSON.stringify(this.users));
        localStorage.setItem('sgpa_subjects', JSON.stringify(this.subjects));
        localStorage.setItem('sgpa_marks', JSON.stringify(this.marks));

        // Also save to downloadable JSON file
        this.saveToJSONFile();
    }

    saveToJSONFile() {
        const data = {
            users: this.users,
            currentUser: this.currentUser,
            subjects: this.subjects,
            marks: this.marks,
            lastUpdated: new Date().toISOString()
        };

        // Store in localStorage as backup
        localStorage.setItem('sgpa_data_backup', JSON.stringify(data));
    }

    attachEventListeners() {
        // Registration
        document.getElementById('register-form')?.addEventListener('submit', (e) => this.handleRegister(e));
        document.getElementById('show-login-link')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.showLoginForm();
        });

        // Login
        document.getElementById('login-form')?.addEventListener('submit', (e) => this.handleLogin(e));
        document.getElementById('show-register-link')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.showRegisterForm();
        });

        // Logout
        document.getElementById('logout-btn')?.addEventListener('click', () => this.handleLogout());

        // Navigation
        document.querySelectorAll('.sidebar-item').forEach(item => {
            item.addEventListener('click', (e) => this.handleNavigation(e));
        });

        document.querySelectorAll('.action-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = e.currentTarget.dataset.action;
                this.navigateToView(action);
            });
        });

        // Subject Management
        document.getElementById('add-subject-btn')?.addEventListener('click', () => this.showAddSubjectModal());
        document.getElementById('close-subject-modal')?.addEventListener('click', () => this.closeAddSubjectModal());
        document.getElementById('cancel-subject-btn')?.addEventListener('click', () => this.closeAddSubjectModal());
        document.getElementById('subject-form')?.addEventListener('submit', (e) => this.handleAddSubject(e));

        // SGPA Calculation
        document.getElementById('calculate-sgpa-btn')?.addEventListener('click', () => this.calculateSGPA());

        // Prediction
        document.getElementById('prediction-form')?.addEventListener('submit', (e) => this.handlePrediction(e));

        // Download data
        document.getElementById('download-data-btn')?.addEventListener('click', () => this.downloadData());
    }

    showRegisterForm() {
        document.getElementById('login-form-container').style.display = 'none';
        document.getElementById('register-form-container').style.display = 'block';
    }

    showLoginForm() {
        document.getElementById('register-form-container').style.display = 'none';
        document.getElementById('login-form-container').style.display = 'block';
    }

    handleRegister(e) {
        e.preventDefault();
        const formData = new FormData(e.target);

        const usn = formData.get('usn');
        const password = formData.get('password');
        const confirmPassword = formData.get('confirm-password');

        // Validation
        if (password !== confirmPassword) {
            this.showAlert('error', 'Passwords do not match!');
            return;
        }

        // Check if user already exists
        if (this.users.find(u => u.usn === usn)) {
            this.showAlert('error', 'USN already registered! Please login.');
            return;
        }

        // Create new user
        const newUser = {
            usn: usn,
            password: password,
            name: formData.get('studentName'),
            academicYear: formData.get('academicYear'),
            semester: formData.get('semester'),
            role: formData.get('role'),
            registeredAt: new Date().toISOString()
        };

        this.users.push(newUser);
        localStorage.setItem('sgpa_users', JSON.stringify(this.users));

        this.showAlert('success', 'Registration successful! Please login.');
        e.target.reset();
        this.showLoginForm();
    }

    handleLogin(e) {
        e.preventDefault();
        const formData = new FormData(e.target);

        const usn = formData.get('usn');
        const password = formData.get('password');

        // Find user
        const user = this.users.find(u => u.usn === usn && u.password === password);

        if (!user) {
            this.showAlert('error', 'Invalid USN or password!');
            return;
        }

        this.currentUser = user;
        this.loadUserData(usn);
        this.saveData();
        this.showDashboard();
    }

    loadUserData(usn) {
        // Load user-specific subjects and marks
        const userSubjects = localStorage.getItem(`sgpa_subjects_${usn}`);
        const userMarks = localStorage.getItem(`sgpa_marks_${usn}`);

        if (userSubjects) this.subjects = JSON.parse(userSubjects);
        else this.subjects = [];

        if (userMarks) this.marks = JSON.parse(userMarks);
        else this.marks = {};
    }

    saveUserData() {
        if (this.currentUser) {
            localStorage.setItem(`sgpa_subjects_${this.currentUser.usn}`, JSON.stringify(this.subjects));
            localStorage.setItem(`sgpa_marks_${this.currentUser.usn}`, JSON.stringify(this.marks));
        }
    }

    handleLogout() {
        this.saveUserData();
        this.currentUser = null;
        this.subjects = [];
        this.marks = {};
        localStorage.removeItem('sgpa_user');
        this.showLogin();
    }

    showLogin() {
        document.getElementById('login-page').classList.add('active');
        document.getElementById('dashboard-page').classList.remove('active');
        this.showLoginForm();
    }

    showDashboard() {
        document.getElementById('login-page').classList.remove('active');
        document.getElementById('dashboard-page').classList.add('active');
        this.updateDashboard();

        // Show appropriate dashboard based on role
        if (this.currentUser.role === 'faculty') {
            this.showFacultyDashboard();
        } else {
            this.showStudentDashboard();
        }
    }

    showStudentDashboard() {
        // Show all menu items for students
        document.querySelectorAll('.sidebar-item').forEach(item => {
            item.style.display = 'flex';
        });
        this.renderOverview();
    }

    showFacultyDashboard() {
        // Hide student-specific views for faculty
        document.querySelectorAll('.sidebar-item').forEach(item => {
            const view = item.dataset.view;
            if (view === 'marks' || view === 'prediction') {
                item.style.display = 'none';
            }
        });
        this.renderFacultyOverview();
    }

    updateDashboard() {
        document.getElementById('nav-user-name').textContent = this.currentUser.name;
        document.getElementById('nav-user-role').textContent = this.currentUser.role.charAt(0).toUpperCase() + this.currentUser.role.slice(1);
    }

    handleNavigation(e) {
        const viewName = e.currentTarget.dataset.view;
        this.navigateToView(viewName);
    }

    navigateToView(viewName) {
        // Update sidebar
        document.querySelectorAll('.sidebar-item').forEach(item => {
            item.classList.remove('active');
            if (item.dataset.view === viewName) {
                item.classList.add('active');
            }
        });

        // Update views
        document.querySelectorAll('.view').forEach(view => {
            view.classList.remove('active');
        });
        document.getElementById(`${viewName}-view`)?.classList.add('active');

        // Render content
        switch (viewName) {
            case 'overview':
                if (this.currentUser.role === 'faculty') {
                    this.renderFacultyOverview();
                } else {
                    this.renderOverview();
                }
                break;
            case 'subjects': this.renderSubjects(); break;
            case 'marks': this.renderMarksEntry(); break;
            case 'sgpa': this.renderSGPAView(); break;
            case 'prediction': this.renderPredictionView(); break;
        }
    }

    renderFacultyOverview() {
        const container = document.getElementById('overview-view');

        // Get all registered students
        const students = this.users.filter(u => u.role === 'student');

        // Calculate statistics
        const totalStudents = students.length;
        const totalFaculty = this.users.filter(u => u.role === 'faculty').length;

        container.innerHTML = `
            <div class="view-header">
                <h2>Faculty Dashboard</h2>
                <p>System Overview and Statistics</p>
            </div>

            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-icon" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </div>
                    <div class="stat-content">
                        <div class="stat-label">Total Students</div>
                        <div class="stat-value">${totalStudents}</div>
                    </div>
                </div>

                <div class="stat-card">
                    <div class="stat-icon" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </div>
                    <div class="stat-content">
                        <div class="stat-label">Total Faculty</div>
                        <div class="stat-value">${totalFaculty}</div>
                    </div>
                </div>

                <div class="stat-card">
                    <div class="stat-icon" style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </div>
                    <div class="stat-content">
                        <div class="stat-label">Total Users</div>
                        <div class="stat-value">${this.users.length}</div>
                    </div>
                </div>

                <div class="stat-card">
                    <div class="stat-icon" style="background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4 19.5C4 18.837 4.26339 18.2011 4.73223 17.7322C5.20107 17.2634 5.83696 17 6.5 17H20" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M6.5 2H20V22H6.5C5.83696 22 5.20107 21.7366 4.73223 21.2678C4.26339 20.7989 4 20.163 4 19.5V4.5C4 3.83696 4.26339 3.20107 4.73223 2.73223C5.20107 2.26339 5.83696 2 6.5 2V2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </div>
                    <div class="stat-content">
                        <div class="stat-label">My Subjects</div>
                        <div class="stat-value">${this.subjects.length}</div>
                    </div>
                </div>
            </div>

            <div class="content-grid">
                <div class="card">
                    <div class="card-header">
                        <h3>Faculty Information</h3>
                    </div>
                    <div class="card-body">
                        <div class="info-grid">
                            <div class="info-item">
                                <span class="info-label">Faculty ID</span>
                                <span class="info-value">${this.currentUser.usn}</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">Name</span>
                                <span class="info-value">${this.currentUser.name}</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">Academic Year</span>
                                <span class="info-value">${this.currentUser.academicYear}</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">Semester</span>
                                <span class="info-value">${this.currentUser.semester}${this.getOrdinalSuffix(this.currentUser.semester)} Semester</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="card">
                    <div class="card-header">
                        <h3>Quick Actions</h3>
                    </div>
                    <div class="card-body">
                        <div class="quick-actions">
                            <button class="action-btn" data-action="subjects">
                                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                                <span>Manage Subjects</span>
                            </button>
                            <button class="action-btn" data-action="sgpa">
                                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M9 11L12 14L22 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                    <path d="M21 12V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                                <span>View SGPA</span>
                            </button>
                            <button class="action-btn" onclick="sgpaSystem.downloadData()">
                                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                    <path d="M7 10L12 15L17 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                    <path d="M12 15V3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                                <span>Download Data</span>
                            </button>
                            <button class="action-btn" onclick="alert('Student list feature coming soon!')">
                                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                    <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                                <span>View Students</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div class="card" style="margin-top: 1.5rem;">
                <div class="card-header">
                    <h3>Registered Students</h3>
                </div>
                <div class="card-body">
                    ${students.length === 0 ? `
                        <div class="alert alert-warning">
                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:20px;height:20px;">
                                <path d="M12 9V13M12 17H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                            </svg>
                            No students registered yet.
                        </div>
                    ` : `
                        <div class="table-container">
                            <table>
                                <thead>
                                    <tr>
                                        <th>USN</th>
                                        <th>Name</th>
                                        <th>Academic Year</th>
                                        <th>Semester</th>
                                        <th>Registered On</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${students.map(s => `
                                        <tr>
                                            <td><strong>${s.usn}</strong></td>
                                            <td>${s.name}</td>
                                            <td>${s.academicYear}</td>
                                            <td>${s.semester}${this.getOrdinalSuffix(s.semester)}</td>
                                            <td>${new Date(s.registeredAt).toLocaleDateString()}</td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                    `}
                </div>
            </div>
        `;
    }

    renderOverview() {
        // Update stats
        const totalSubjects = this.subjects.length;
        const totalCredits = this.subjects.reduce((sum, s) => sum + parseInt(s.credits), 0);
        const sgpaData = this.calculateCurrentSGPA();

        document.getElementById('stat-total-subjects').textContent = totalSubjects;
        document.getElementById('stat-total-credits').textContent = totalCredits;
        document.getElementById('stat-current-sgpa').textContent = sgpaData.sgpa || '-';
        document.getElementById('stat-performance').textContent = sgpaData.grade || '-';

        // Update info
        document.getElementById('info-usn').textContent = this.currentUser.usn;
        document.getElementById('info-name').textContent = this.currentUser.name;
        document.getElementById('info-year').textContent = this.currentUser.academicYear;
        document.getElementById('info-semester').textContent = `${this.currentUser.semester}${this.getOrdinalSuffix(this.currentUser.semester)} Semester`;
    }

    getOrdinalSuffix(num) {
        const j = num % 10, k = num % 100;
        if (j == 1 && k != 11) return "st";
        if (j == 2 && k != 12) return "nd";
        if (j == 3 && k != 13) return "rd";
        return "th";
    }

    renderSubjects() {
        const container = document.getElementById('subjects-list');

        if (this.subjects.length === 0) {
            container.innerHTML = `
                <div class="alert alert-warning">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:20px;height:20px;">
                        <path d="M12 9V13M12 17H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                    No subjects added yet. Click "Add Subject" to get started.
                </div>
            `;
            return;
        }

        container.innerHTML = this.subjects.map((subject, index) => `
            <div class="subject-item">
                <div class="subject-info">
                    <h4>${subject.name}</h4>
                    <div class="subject-meta">
                        <span>Code: ${subject.code}</span>
                        <span>•</span>
                        <span class="subject-badge">${subject.type === 'lab' ? 'Lab' : 'Theory'}</span>
                        <span>•</span>
                        <span>${subject.credits} Credits</span>
                    </div>
                </div>
                <div class="subject-actions">
                    <button class="btn-icon" onclick="sgpaSystem.deleteSubject(${index})" title="Delete">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M3 6H5H21M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </button>
                </div>
            </div>
        `).join('');
    }

    showAddSubjectModal() {
        document.getElementById('add-subject-modal').classList.add('active');
    }

    closeAddSubjectModal() {
        document.getElementById('add-subject-modal').classList.remove('active');
        document.getElementById('subject-form').reset();
    }

    handleAddSubject(e) {
        e.preventDefault();
        const formData = new FormData(e.target);

        const subject = {
            name: formData.get('subject-name'),
            code: formData.get('subject-code'),
            type: formData.get('subject-type'),
            credits: parseInt(formData.get('subject-credits'))
        };

        console.log('Adding subject:', subject); // Debug

        this.subjects.push(subject);
        this.saveUserData();
        this.closeAddSubjectModal();
        this.renderSubjects();
        if (this.currentUser.role === 'student') {
            this.renderOverview();
        }
        this.showAlert('success', 'Subject added successfully!');
    }

    deleteSubject(index) {
        if (confirm('Are you sure you want to delete this subject?')) {
            this.subjects.splice(index, 1);
            delete this.marks[index];
            this.saveUserData();
            this.renderSubjects();
            if (this.currentUser.role === 'student') {
                this.renderOverview();
            }
            this.showAlert('success', 'Subject deleted successfully!');
        }
    }

    renderMarksEntry() {
        const container = document.getElementById('marks-content');

        if (this.subjects.length === 0) {
            container.innerHTML = `
                <div class="alert alert-warning">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:20px;height:20px;">
                        <path d="M12 9V13M12 17H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                    Please add subjects first before entering marks.
                </div>
            `;
            return;
        }

        container.innerHTML = this.subjects.map((subject, index) => {
            const marks = this.marks[index] || {};
            return `
                <div class="marks-subject-card">
                    <div class="marks-subject-header">
                        <h3>${subject.name} (${subject.code})</h3>
                        <div class="subject-meta">
                            <span class="subject-badge">${subject.type === 'lab' ? 'Lab' : 'Theory'}</span>
                            <span>${subject.credits} Credits</span>
                        </div>
                    </div>
                    
                    <div class="marks-grid">
                        <div class="marks-section">
                            <h4>Internal Assessments (40 marks each)</h4>
                            <div class="marks-inputs">
                                <div class="form-group">
                                    <label>Internal 1</label>
                                    <input type="number" min="0" max="40" value="${marks.internal1 || ''}" 
                                           onchange="sgpaSystem.updateMarks(${index}, 'internal1', this.value)">
                                </div>
                                <div class="form-group">
                                    <label>Internal 2</label>
                                    <input type="number" min="0" max="40" value="${marks.internal2 || ''}" 
                                           onchange="sgpaSystem.updateMarks(${index}, 'internal2', this.value)">
                                </div>
                                <div class="form-group">
                                    <label>Internal 3</label>
                                    <input type="number" min="0" max="40" value="${marks.internal3 || ''}" 
                                           onchange="sgpaSystem.updateMarks(${index}, 'internal3', this.value)">
                                </div>
                            </div>
                        </div>
                        
                        ${subject.type === 'lab' ? `
                            <div class="marks-section">
                                <h4>Lab Components</h4>
                                <div class="marks-inputs">
                                    <div class="form-group">
                                        <label>Lab Practical (50)</label>
                                        <input type="number" min="0" max="50" value="${marks.labPractical || ''}" 
                                               onchange="sgpaSystem.updateMarks(${index}, 'labPractical', this.value)">
                                    </div>
                                    <div class="form-group">
                                        <label>Lab Record (10)</label>
                                        <input type="number" min="0" max="10" value="${marks.labRecord || ''}" 
                                               onchange="sgpaSystem.updateMarks(${index}, 'labRecord', this.value)">
                                    </div>
                                </div>
                            </div>
                        ` : ''}
                        
                        <div class="marks-section">
                            <h4>Assignments</h4>
                            <div class="marks-inputs">
                                <div class="form-group">
                                    <label>${subject.type === 'lab' ? 'Assignments (15)' : 'Assignments (25)'}</label>
                                    <input type="number" min="0" max="${subject.type === 'lab' ? 15 : 25}" 
                                           value="${marks.assignments || ''}" 
                                           onchange="sgpaSystem.updateMarks(${index}, 'assignments', this.value)">
                                </div>
                            </div>
                        </div>
                        
                        <div class="marks-section">
                            <h4>Semester End Exam (SEE)</h4>
                            <div class="marks-inputs">
                                <div class="form-group">
                                    <label>SEE Marks (100)</label>
                                    <input type="number" min="0" max="100" value="${marks.see || ''}" 
                                           onchange="sgpaSystem.updateMarks(${index}, 'see', this.value)">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    updateMarks(subjectIndex, field, value) {
        if (!this.marks[subjectIndex]) {
            this.marks[subjectIndex] = {};
        }
        this.marks[subjectIndex][field] = parseFloat(value) || 0;
        this.saveUserData();
    }

    calculateCIE(subject, marks) {
        if (!marks) return 0;

        // Get best 2 internals
        const internals = [
            marks.internal1 || 0,
            marks.internal2 || 0,
            marks.internal3 || 0
        ].sort((a, b) => b - a);

        const bestTwoTotal = internals[0] + internals[1];

        if (subject.type === 'lab') {
            // Lab: Internals scaled to 15, Lab Practical to 10, Lab Record 10, Assignments 15
            const internalsCIE = (bestTwoTotal / 80) * 15;
            const labPracticalCIE = ((marks.labPractical || 0) / 50) * 10;
            const labRecordCIE = marks.labRecord || 0;
            const assignmentsCIE = marks.assignments || 0;
            return internalsCIE + labPracticalCIE + labRecordCIE + assignmentsCIE;
        } else {
            // Theory: Internals scaled to 25, Assignments 25
            const internalsCIE = (bestTwoTotal / 80) * 25;
            const assignmentsCIE = marks.assignments || 0;
            return internalsCIE + assignmentsCIE;
        }
    }

    calculateSEE(marks) {
        if (!marks || !marks.see) return 0;
        return (marks.see / 100) * 50;
    }

    getGrade(totalMarks) {
        for (const [grade, range] of Object.entries(this.gradingRules)) {
            if (totalMarks >= range.min && totalMarks <= range.max) {
                return { grade, points: range.points };
            }
        }
        return { grade: 'F', points: 0 };
    }

    calculateCurrentSGPA() {
        if (this.subjects.length === 0) return { sgpa: null, grade: null };

        let totalCredits = 0;
        let totalPoints = 0;

        this.subjects.forEach((subject, index) => {
            const marks = this.marks[index];
            if (!marks) return;

            const cie = this.calculateCIE(subject, marks);
            const see = this.calculateSEE(marks);
            const total = cie + see;

            const gradeInfo = this.getGrade(total);
            totalCredits += subject.credits;
            totalPoints += gradeInfo.points * subject.credits;
        });

        if (totalCredits === 0) return { sgpa: null, grade: null };

        const sgpa = (totalPoints / totalCredits).toFixed(2);
        const overallGrade = this.getGrade(sgpa * 10).grade;

        return { sgpa, grade: overallGrade };
    }

    renderSGPAView() {
        this.calculateSGPA();
    }

    calculateSGPA() {
        const container = document.getElementById('sgpa-results');

        if (this.subjects.length === 0) {
            container.innerHTML = `
                <div class="alert alert-warning">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:20px;height:20px;">
                        <path d="M12 9V13M12 17H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                    Please add subjects and enter marks to calculate SGPA.
                </div>
            `;
            return;
        }

        const results = this.subjects.map((subject, index) => {
            const marks = this.marks[index] || {};
            const cie = this.calculateCIE(subject, marks);
            const see = this.calculateSEE(marks);
            const total = cie + see;
            const gradeInfo = this.getGrade(total);

            return {
                subject,
                cie: cie.toFixed(2),
                see: see.toFixed(2),
                total: total.toFixed(2),
                grade: gradeInfo.grade,
                points: gradeInfo.points,
                credits: subject.credits
            };
        });

        const sgpaData = this.calculateCurrentSGPA();

        container.innerHTML = `
            <div class="sgpa-summary">
                <h3>Your Semester GPA</h3>
                <div class="sgpa-value">${sgpaData.sgpa || '-'}</div>
                <div class="sgpa-grade">Grade: ${sgpaData.grade || '-'}</div>
            </div>
            
            <div class="card">
                <div class="card-header">
                    <h3>Subject-wise Performance</h3>
                </div>
                <div class="card-body">
                    <div class="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Subject</th>
                                    <th>CIE (50)</th>
                                    <th>SEE (50)</th>
                                    <th>Total (100)</th>
                                    <th>Grade</th>
                                    <th>Points</th>
                                    <th>Credits</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${results.map(r => `
                                    <tr>
                                        <td><strong>${r.subject.name}</strong></td>
                                        <td>${r.cie}</td>
                                        <td>${r.see}</td>
                                        <td>${r.total}</td>
                                        <td><span class="subject-badge">${r.grade}</span></td>
                                        <td>${r.points}</td>
                                        <td>${r.credits}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
    }

    renderPredictionView() {
        // View is already rendered in HTML
    }

    handlePrediction(e) {
        e.preventDefault();
        const targetSGPA = parseFloat(document.getElementById('target-sgpa').value);

        if (targetSGPA < 0 || targetSGPA > 10) {
            this.showAlert('error', 'Target SGPA must be between 0 and 10');
            return;
        }

        const predictions = this.calculatePredictions(targetSGPA);
        this.renderPredictions(predictions, targetSGPA);
    }

    calculatePredictions(targetSGPA) {
        const totalCredits = this.subjects.reduce((sum, s) => sum + s.credits, 0);
        const requiredPoints = targetSGPA * totalCredits;

        return this.subjects.map((subject, index) => {
            const marks = this.marks[index] || {};
            const currentCIE = this.calculateCIE(subject, marks);
            const currentSEE = this.calculateSEE(marks);
            const currentTotal = currentCIE + currentSEE;

            // Calculate required grade points for this subject
            const requiredGradePoints = Math.ceil(targetSGPA);
            const requiredMarks = requiredGradePoints * 10;
            const deficit = Math.max(0, requiredMarks - currentTotal);

            return {
                subject: subject.name,
                current: currentTotal.toFixed(2),
                required: requiredMarks,
                deficit: deficit.toFixed(2),
                recommendation: this.getRecommendation(deficit, marks, subject)
            };
        });
    }

    getRecommendation(deficit, marks, subject) {
        if (deficit <= 0) return 'On track! Maintain current performance.';

        const recommendations = [];

        if (!marks.see || marks.see < 100) {
            const seeNeeded = Math.min(100, deficit * 2);
            recommendations.push(`Score at least ${seeNeeded.toFixed(0)}/100 in SEE`);
        }

        if (!marks.assignments || marks.assignments < (subject.type === 'lab' ? 15 : 25)) {
            const maxAssignments = subject.type === 'lab' ? 15 : 25;
            recommendations.push(`Maximize assignment marks (${maxAssignments})`);
        }

        if (recommendations.length === 0) {
            recommendations.push('Focus on upcoming assessments');
        }

        return recommendations.join('; ');
    }

    renderPredictions(predictions, targetSGPA) {
        const container = document.getElementById('prediction-results');

        container.innerHTML = `
            <div class="prediction-card">
                <div class="prediction-header">
                    <h3>Prediction for Target SGPA: ${targetSGPA}</h3>
                </div>
                
                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Subject</th>
                                <th>Current Total</th>
                                <th>Required Total</th>
                                <th>Deficit</th>
                                <th>Recommendation</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${predictions.map(p => `
                                <tr>
                                    <td><strong>${p.subject}</strong></td>
                                    <td>${p.current}</td>
                                    <td>${p.required}</td>
                                    <td><span style="color: ${p.deficit > 0 ? 'var(--error)' : 'var(--success)'}">${p.deficit}</span></td>
                                    <td>${p.recommendation}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }

    downloadData() {
        const data = {
            users: this.users,
            currentUser: this.currentUser,
            subjects: this.subjects,
            marks: this.marks,
            exportedAt: new Date().toISOString()
        };

        const dataStr = JSON.stringify(data, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `sgpa_data_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        this.showAlert('success', 'Data downloaded successfully!');
    }

    showAlert(type, message) {
        const alert = document.createElement('div');
        alert.className = `alert alert-${type}`;
        alert.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:20px;height:20px;">
                <path d="M9 11L12 14L22 4M21 12V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            ${message}
        `;

        document.body.appendChild(alert);
        alert.style.position = 'fixed';
        alert.style.top = '2rem';
        alert.style.right = '2rem';
        alert.style.zIndex = '10000';
        alert.style.minWidth = '300px';

        setTimeout(() => alert.remove(), 3000);
    }
}

// Initialize the system
const sgpaSystem = new SGPASystem();

// Check if user is logged in
if (sgpaSystem.currentUser) {
    sgpaSystem.showDashboard();
} else {
    sgpaSystem.showLogin();
}
