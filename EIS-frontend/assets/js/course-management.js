const apiBaseUrl = 'https://localhost:7173';

document.addEventListener('DOMContentLoaded', function () {
    // Load initial courses
    loadCourses();

    // Add Course Form Handler
    const addCourseForm = document.getElementById('addCourseForm');
    if (addCourseForm) {
        addCourseForm.addEventListener('submit', async function (event) {
            event.preventDefault();

            const courseData = {
                code: document.getElementById('courseCode').value,
                name: document.getElementById('courseName').value
            };

            await createCourse(courseData);

            // Clear form and close modal
            addCourseForm.reset();
            $('#addCourseModal').modal('hide');

            // Reload courses
            await loadCourses();
        });
    }

    // Edit Course Form Handler
    const editCourseForm = document.getElementById('editCourseForm');
    if (editCourseForm) {
        editCourseForm.addEventListener('submit', async function (event) {
            event.preventDefault();

            const originalCode = document.getElementById('editCourseOriginalCode').value;
            const courseData = {
                code: document.getElementById('editCourseCode').value,
                name: document.getElementById('editCourseName').value
            };

            await updateCourse(originalCode, courseData);

            // Close modal and reload courses
            $('#editCourseModal').modal('hide');
            await loadCourses();
        });
    }
});

let allCourses = [];
let currentPage = 1;
const pageSize = 10;

async function loadCourses() {
    try {
        const coursesTableBody = document.getElementById('coursesTableBody');
        if (!coursesTableBody) return;

        // Show loading state
        coursesTableBody.innerHTML = '<tr><td colspan="3" class="text-center"><span class="spinner-border"></span> Loading...</td></tr>';

        const response = await fetch(`${apiBaseUrl}/api/courses`);
        if (!response.ok) {
            throw new Error('Failed to fetch courses');
        }

        allCourses = await response.json();
        renderCourses(currentPage, pageSize);
        createPaginationControls();
    } catch (error) {
        console.error('Error loading courses:', error);
    }
}

function renderCourses(page, size) {
    const coursesTableBody = document.getElementById('coursesTableBody');
    if (!coursesTableBody) return;

    coursesTableBody.innerHTML = ''; // Clear previous content

    const start = (page - 1) * size;
    const end = start + size;
    const paginatedCourses = allCourses.slice(start, end);

    if (paginatedCourses.length === 0) {
        coursesTableBody.innerHTML = '<tr><td colspan="3" class="text-center">No courses found</td></tr>';
        return;
    }

    paginatedCourses.forEach(course => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${course.code}</td>
            <td>${course.name}</td>
            <td>
                <button class="btn btn-warning btn-sm edit-course" 
                    data-code="${course.code}" 
                    data-name="${course.name}">
                    Edit
                </button>
                <button class="btn btn-danger btn-sm delete-course" 
                    data-code="${course.code}">
                    Delete
                </button>
            </td>
        `;

        const deleteBtn = row.querySelector('.delete-course');
        deleteBtn.addEventListener('click', function () {
            const courseCode = this.getAttribute('data-code');
            handleDeleteCourse(courseCode);
        });

        const editBtn = row.querySelector('.edit-course');
        editBtn.addEventListener('click', () => handleEditCourse(course));

        coursesTableBody.appendChild(row);
    });
}

// Pagination Controls
function createPaginationControls() {
    const paginationControls = document.getElementById('paginationControls');
    if (!paginationControls) return;

    paginationControls.innerHTML = ''; // Clear existing controls

    const totalPages = Math.ceil(allCourses.length / pageSize);

    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.className = 'btn btn-secondary btn-sm';
        pageButton.innerText = i;
        pageButton.addEventListener('click', () => {
            currentPage = i;
            renderCourses(currentPage, pageSize);
            updateActiveButton();
        });

        if (i === currentPage) {
            pageButton.classList.add('active');
        }

        paginationControls.appendChild(pageButton);
    }
}

// Style fix for active button
function updateActiveButton() {
    const paginationControls = document.getElementById('paginationControls');
    const buttons = paginationControls.getElementsByTagName('button');

    for (let button of buttons) {
        button.classList.remove('active');
    }

    buttons[currentPage - 1].classList.add('active');
}

async function createCourse(courseData) {
    try {
        // Show loading state
        const submitButton = document.querySelector('#addCourseForm button[type="submit"]');
        submitButton.disabled = true;
        submitButton.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Creating...';

        // Validate input
        if (!courseData.code?.trim() || !courseData.name?.trim()) {
            throw new Error('Course code and name are required');
        }

        const response = await fetch(`${apiBaseUrl}/api/courses`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                code: courseData.code.trim(),
                name: courseData.name.trim()
            })
        });

        if (!response.ok) {
            const errorData = await response.text();
            throw new Error(errorData || 'Failed to create course');
        }

        alert('Course created successfully');
        return await response.json();
    } catch (error) {
        console.error('Error creating course:', error);
        alert(error.message || 'Failed to create course. Please try again.');
        throw error;
    } finally {
        // Reset loading state
        const submitButton = document.querySelector('#addCourseForm button[type="submit"]');
        submitButton.disabled = false;
        submitButton.textContent = 'Create Course';
    }
}

function handleEditCourse(course) {
    // Populate the edit form
    document.getElementById('editCourseOriginalCode').value = course.code; // Store original code for reference
    document.getElementById('editCourseCode').value = course.code;
    document.getElementById('editCourseName').value = course.name;

    // Show the modal
    $('#editCourseModal').modal('show');
}

async function updateCourse(originalCode, courseData) {
    try {
        // Show loading state
        const submitButton = document.querySelector('#editCourseForm button[type="submit"]');
        submitButton.disabled = true;
        submitButton.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Updating...';

        // Validate input
        if (!courseData.code?.trim() || !courseData.name?.trim()) {
            throw new Error('Course code and name are required');
        }

        const response = await fetch(`${apiBaseUrl}/api/courses/${encodeURIComponent(originalCode)}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                code: courseData.code.trim(),
                name: courseData.name.trim()
            })
        });

        if (!response.ok) {
            const errorData = await response.text();
            throw new Error(errorData || 'Failed to update course');
        }

        alert('Course updated successfully');
        return await response.json();
    } catch (error) {
        console.error('Error updating course:', error);
        alert(error.message || 'Failed to update course. Please try again.');
        throw error;
    } finally {
        // Reset loading state
        const submitButton = document.querySelector('#editCourseForm button[type="submit"]');
        submitButton.disabled = false;
        submitButton.textContent = 'Update Course';
    }
}

async function handleDeleteCourse(courseCode) {
    if (confirm('Are you sure you want to delete this course?')) {
        try {
            // First, check if courseCode is defined
            if (!courseCode) {
                throw new Error('Course code is undefined');
            }

            // Log the URL being called (for debugging)
            console.log(`Attempting to delete course: ${courseCode}`);

            const response = await fetch(`${apiBaseUrl}/api/courses/${encodeURIComponent(courseCode)}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const errorData = await response.text();
                console.error('Server response:', errorData);
                throw new Error(`Failed to delete course. Status: ${response.status}`);
            }

            // If successful, reload the courses
            await loadCourses();
            alert('Course deleted successfully');
        } catch (error) {
            console.error('Error deleting course:', error);
            alert(`Failed to delete course: ${error.message}`);
        }
    }
} 