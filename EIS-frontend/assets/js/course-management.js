const apiBaseUrl = 'https://localhost:7173';

document.addEventListener('DOMContentLoaded', function () {
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

            addCourseForm.reset();
            $('#addCourseModal').modal('hide');

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
        createPaginationControls(allCourses);
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
    setupSearchFunctionality(allCourses);
}

// Pagination Controls
function createPaginationControls(courses) {
    const paginationControls = document.getElementById('paginationControls');
    if (!paginationControls) return;

    paginationControls.innerHTML = ''; // Clear existing controls

    const totalPages = Math.ceil(courses.length / pageSize);

    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.className = 'btn btn-outline-primary btn-lg';
        pageButton.innerText = i;
        pageButton.style.marginRight = '5px';
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

    $('#editCourseModal').modal('show');
}

async function updateCourse(originalCode, courseData) {
    try {
        const submitButton = document.querySelector('#editCourseForm button[type="submit"]');
        submitButton.disabled = true;
        submitButton.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Updating...';

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
        const submitButton = document.querySelector('#editCourseForm button[type="submit"]');
        submitButton.disabled = false;
        submitButton.textContent = 'Update Course';
    }
}

async function handleDeleteCourse(courseCode) {
    if (confirm('Are you sure you want to delete this course?')) {
        try {
            if (!courseCode) {
                throw new Error('Course code is undefined');
            }

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

            await loadCourses();
            alert('Course deleted successfully');
        } catch (error) {
            console.error('Error deleting course:', error);
            alert(`Failed to delete course: ${error.message}`);
        }
    }
}

function setupSearchFunctionality(courses) {
    const searchInput = document.getElementById('courseSearchInput');
    if (!searchInput) return;

    searchInput.addEventListener('keyup', e => {
        const searchTerm = e.target.value.toLowerCase();
        filterCourses(courses, searchTerm);

        currentPage = 1;
        updateActiveButton();
    });
}

function filterCourses(courses, searchTerm) {
    const filteredCourses = courses.filter(course =>
        course.code.toLowerCase().includes(searchTerm) ||
        course.name.toLowerCase().includes(searchTerm)
    );

    const coursesTableBody = document.getElementById('coursesTableBody');
    if (!coursesTableBody) return;

    coursesTableBody.innerHTML = '';

    if (filteredCourses.length === 0) {
        coursesTableBody.innerHTML = '<tr><td colspan="3" class="text-center">No matching courses found</td></tr>';
        return;
    }

    // Slice the filtered courses by the current page and page size
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    const paginatedCourses = filteredCourses.slice(start, end);

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

    createPaginationControls(filteredCourses);
}