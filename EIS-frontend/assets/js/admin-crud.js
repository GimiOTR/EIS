const apiBaseUrl = 'https://localhost:7173'; // Replace with your actual API base URL

document.addEventListener('DOMContentLoaded', function () {
    const addCourseForm = document.getElementById('addCourseForm');
    if (addCourseForm) {
        addCourseForm.addEventListener('submit', async function (event) {
            event.preventDefault();
            
            const courseCode = document.getElementById('courseCode').value;
            const courseName = document.getElementById('courseName').value;
            
            const courseData = {
                code: courseCode,
                name: courseName
            };
            
            await createCourse(courseData);
            
            // Optionally, you can add code here to update the UI or close the modal
            $('#addCourseModal').modal('hide');
            // Reload or update the course list
            await loadCourses();
        });
    }

    const addProgramForm = document.getElementById('addProgramForm');
    if (addProgramForm) {
        addProgramForm.addEventListener('submit', async function (event) {
            event.preventDefault();
            
            const programCode = document.getElementById('programCode').value;
            const programName = document.getElementById('programName').value;
            const programLevel = document.getElementById('programLevel').value;
            
            const programData = {
                code: programCode,
                name: programName,
                level: programLevel
            };
            
            await createProgram(programData);
            
            // Optionally, you can add code here to update the UI or close the modal
            $('#addProgramModal').modal('hide');
            // Reload or update the program list
            await loadPrograms();
        });
    }

    // Load courses and programs when the page loads
    if (document.getElementById('coursesTableBody')) {
        loadCourses();
    }
    if (document.getElementById('programsTableBody')) {
        loadPrograms();
    }
});

// Function to create a new course
async function createCourse(courseData) {
    try {
        const response = await fetch(`${apiBaseUrl}/api/courses`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(courseData)
        });
        const result = await response.json();
        if (response.ok) {
            console.log('Course created successfully:', result);
        } else {
            console.error('Error creating course:', result);
        }
    } catch (error) {
        console.error('Error creating course:', error);
    }
}

// Function to create a new program
async function createProgram(programData) {
    try {
        const response = await fetch(`${apiBaseUrl}/api/programs`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(programData)
        });
        const result = await response.json();
        if (response.ok) {
            console.log('Program created successfully:', result);
        } else {
            console.error('Error creating program:', result);
        }
    } catch (error) {
        console.error('Error creating program:', error);
    }
}

// Function to load courses
async function loadCourses() {
    try {
        const response = await fetch(`${apiBaseUrl}/api/courses`);
        const courses = await response.json();
        const coursesTableBody = document.getElementById('coursesTableBody');
        if (coursesTableBody) {
            coursesTableBody.innerHTML = ''; // Clear existing rows
            courses.forEach(course => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${course.code}</td>
                    <td>${course.name}</td>
                    <td>
                        <button class="btn btn-primary btn-sm">Edit</button>
                        <button class="btn btn-danger btn-sm">Delete</button>
                    </td>
                `;
                coursesTableBody.appendChild(row);
            });
        }
    } catch (error) {
        console.error('Error loading courses:', error);
    }
}

// Function to load programs
async function loadPrograms() {
    try {
        const response = await fetch(`${apiBaseUrl}/api/programs`);
        const programs = await response.json();
        const programsTableBody = document.getElementById('programsTableBody');
        if (programsTableBody) {
            programsTableBody.innerHTML = ''; // Clear existing rows
            programs.forEach(program => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${program.code}</td>
                    <td>${program.name}</td>
                    <td>${program.level}</td>
                    <td>
                        <button class="btn btn-primary btn-sm">View Courses</button>
                    </td>
                    <td>
                        <button class="btn btn-primary btn-sm">Edit</button>
                        <button class="btn btn-danger btn-sm">Delete</button>
                    </td>
                `;
                programsTableBody.appendChild(row);
            });
        }
    } catch (error) {
        console.error('Error loading programs:', error);
    }
}