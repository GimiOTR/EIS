const apiBaseUrl = 'https://localhost:7173';

// Initial Setup
document.addEventListener('DOMContentLoaded', () => {
    setupAddProgramForm();
    if (document.getElementById('programsTableBody')) {
        loadPrograms();
    }
});

// Setup the Add Program Form
function setupAddProgramForm() {
    const form = document.getElementById('addProgramForm');
    if (form) {
        form.addEventListener('submit', async (event) => {
            event.preventDefault();
            const programData = {
                code: document.getElementById('programCode').value,
                name: document.getElementById('programName').value,
                level: document.getElementById('programLevel').value,
            };
            await createProgram(programData);
            form.reset();
            await loadPrograms();
        });
    }
}

// Create a new Program
async function createProgram(programData) {
    try {
        const response = await fetch(`${apiBaseUrl}/api/programs`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(programData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(Object.values(errorData.errors).flat().join('\n'));
        }

        alert('Program created successfully');
    } catch (error) {
        console.error('Error creating program:', error);
        alert('Error creating program: ' + error.message);
    }
}

// Load all Programs
async function loadPrograms() {
    try {
        const response = await fetch(`${apiBaseUrl}/api/programs`);
        if (!response.ok) {
            throw new Error('Failed to fetch programs');
        }
        const programs = await response.json();
        updateProgramsTable(programs);
    } catch (error) {
        console.error('Error loading programs:', error);
        alert('Error loading programs: ' + error.message);
    }
}

// Update the Programs Table
function updateProgramsTable(programs) {
    const tableBody = document.getElementById('programsTableBody');
    tableBody.innerHTML = '';

    programs.forEach(program => {
        const row = createProgramRow(program);
        tableBody.appendChild(row);
    });
}

// Create a table row for a Program
function createProgramRow(program) {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${program.code}</td>
        <td>${program.name}</td>
        <td>${program.level}</td>
        <td>
            <button class="btn btn-info btn-sm manage-courses" data-code="${program.code}" data-level="${program.level}">
                Manage Courses
            </button>
        </td>        
        <td>
            <button class="btn btn-warning btn-sm edit-program" data-code="${program.code}" data-level="${program.level}">
                Edit
            </button>
            <button class="btn btn-danger btn-sm delete-program" data-code="${program.code}" data-level="${program.level}">
                Delete
            </button>
        </td>
    `;
    attachProgramRowEventListeners(row, program);
    return row;
}

// Attach event listeners to Program row buttons
function attachProgramRowEventListeners(row, program) {
    row.querySelector('.manage-courses').addEventListener('click', () => handleManageCourses(program));
    row.querySelector('.edit-program').addEventListener('click', () => handleEditProgram(program));
    row.querySelector('.delete-program').addEventListener('click', () => handleDeleteProgram(program.code, program.level));
}

async function handleManageCourses(program) {
    const modalHtml = createManageCoursesModal(program);
    showModal(modalHtml, 'manageCoursesModal');
    await loadProgramCourses(program);
    await loadAvailableCourses(program);
    setupCourseManagementHandlers(program);
}

function createManageCoursesModal(program) {
    return `
        <div class="modal fade" id="manageCoursesModal" tabindex="-1" role="dialog">
            <div class="modal-dialog modal-xl" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Manage Courses - ${program.code} (${program.level})</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span>&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="row">
                            <!-- Program Courses Section -->
                            <div class="col-md-8">
                                <h6>Program Courses</h6>
                                <div id="programCoursesList" style="max-height: 70vh; overflow-y: auto;"></div>
                            </div>
                            <!-- Available Courses Section -->
                            <div class="col-md-4">
                                <h6>Available Courses</h6>
                                <div class="mb-3">
                                    <input type="text" 
                                        class="form-control" 
                                        id="courseSearchInput" 
                                        placeholder="Search courses...">
                                </div>
                                <div id="availableCoursesList" style="height: 360px; overflow-y: auto;">
                                    <table class="table table-hover">
                                        <thead style="position: sticky; top: 0; background-color: white; z-index: 1;">
                                            <tr>
                                                <th>Code</th>
                                                <th>Name</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody id="availableCoursesBody"></tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Edit Form Section (Initially Hidden) -->
                        <div id="editFormSection" class="mt-3" style="display: none;">
                            <hr>
                            <h6 id="editFormHeader">Edit Course Details</h6>
                            <form id="editProgramCourse">
                                <div class="row">
                                    <div class="col-md-3">
                                        <div class="form-group">
                                            <label>ECTS</label>
                                            <input type="number" class="form-control" id="editCourseEcts" 
                                                required min="1" max="30">
                                        </div>
                                    </div>
                                    <div class="col-md-3">
                                        <div class="form-group">
                                            <label>Credits</label>
                                            <input type="number" class="form-control" id="editCourseCredits" 
                                                required min="1" max="30">
                                        </div>
                                    </div>
                                    <div class="col-md-3">
                                        <div class="form-group">
                                            <label>Semester</label>
                                            <select class="form-control" id="editCourseSemester" required>
                                                ${[1,2,3,4,5,6].map(num => 
                                                    `<option value="${num}">${num}</option>`
                                                ).join('')}
                                            </select>
                                        </div>
                                    </div>
                                    <div class="col-md-3">
                                        <div class="form-group">
                                            <label>Type</label>
                                            <select class="form-control" id="editCourseType" required>
                                                <option value="Compulsory">Compulsory</option>
                                                <option value="Elective">Elective</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col">
                                        <button type="submit" class="btn btn-primary">Update Course</button>
                                        <button type="button" class="btn btn-danger" onclick="hideEditForm()">Cancel</button>
                                    </div>
                                </div>
                                <input type="hidden" id="editCourseCode">
                            </form>
                        </div>

                        <!-- Add Course Form Section (Initially Hidden) -->
                        <div id="addFormSection" class="mt-3" style="display: none;">
                            <hr>
                            <h6 id="addFormHeader">Add Course to Program</h6>
                            <form id="addCourseToProgram">
                                <div class="row">
                                    <div class="col-md-3">
                                        <div class="form-group">
                                            <label>ECTS</label>
                                            <input type="number" class="form-control" id="courseEcts" 
                                                required min="1" max="30">
                                        </div>
                                    </div>
                                    <div class="col-md-3">
                                        <div class="form-group">
                                            <label>Credits</label>
                                            <input type="number" class="form-control" id="courseCredits" 
                                                required min="1" max="30">
                                        </div>
                                    </div>
                                    <div class="col-md-3">
                                        <div class="form-group">
                                            <label>Semester</label>
                                            <select class="form-control" id="courseSemester" required>
                                                ${[1,2,3,4,5,6].map(num => 
                                                    `<option value="${num}">${num}</option>`
                                                ).join('')}
                                            </select>
                                        </div>
                                    </div>
                                    <div class="col-md-3">
                                        <div class="form-group">
                                            <label>Type</label>
                                            <select class="form-control" id="courseType" required>
                                                <option value="Compulsory">Compulsory</option>
                                                <option value="Elective">Elective</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col">
                                        <button type="submit" class="btn btn-primary">Add to Program</button>
                                        <button type="button" class="btn btn-danger" onclick="hideAddForm()">Cancel</button>
                                    </div>
                                </div>
                                <input type="hidden" id="addCourseCode">
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

async function loadProgramCourses(program) {
    try {
        const response = await fetch(`${apiBaseUrl}/api/course-programs/${program.code}/${program.level}/assigned`);
        if (!response.ok) throw new Error('Failed to fetch program courses');
        const courses = await response.json();
        displayProgramCourses(courses);
    } catch (error) {
        console.error('Error loading program courses:', error);
        alert('Error loading program courses: ' + error.message);
    }
}

function displayProgramCourses(courses) {
    const container = document.getElementById('programCoursesList');
    container.innerHTML = `
        <table class="table table-hover">
            <thead>
                <tr>
                    <th>Code</th>
                    <th>Name</th>
                    <th>ECTS</th>
                    <th>Credits</th>
                    <th>Semester</th>
                    <th>Type</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${courses.map(course => `
                    <tr>
                        <td>${course.courseCode}</td>
                        <td>${course.courseName}</td>
                        <td>${course.ects}</td>
                        <td>${course.credits}</td>
                        <td>${course.semester}</td>
                        <td>${course.type}</td>
                        <td>
                            <button class="btn btn-warning btn-sm edit-program-course me-2" 
                                style="width: 75px;"
                                data-course-code="${course.courseCode}"
                                data-course-name="${course.courseName}"
                                data-ects="${course.ects}"
                                data-credits="${course.credits}"
                                data-semester="${course.semester}"
                                data-type="${course.type}">
                                Edit
                            </button>
                            <button class="btn btn-danger btn-sm remove-program-course" 
                                style="width: 75px;"
                                data-course-code="${course.courseCode}">
                                Remove
                            </button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

async function loadAvailableCourses(program) {
    try {
        const response = await fetch(`${apiBaseUrl}/api/course-programs/${program.code}/${program.level}/unassigned`);
        if (!response.ok) throw new Error('Failed to fetch available courses');
        const courses = await response.json();
        
        window.availableCourses = courses;
        
        displayAvailableCourses(courses);
        setupSearchFunctionality(courses);
    } catch (error) {
        console.error('Error loading available courses:', error);
        alert('Error loading available courses: ' + error.message);
    }
}

// Handle Editing a Program
async function handleEditProgram(program) {
    const modalHtml = createEditProgramModal(program);
    showModal(modalHtml, 'editProgramModal');
    setupEditProgramForm(program);
}

// Create the Edit Program Modal HTML
function createEditProgramModal(program) {
    return `
        <div class="modal fade" id="editProgramModal" tabindex="-1" role="dialog">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Edit Program</h5>
                        <button type="button" class="close" data-dismiss="modal">
                            <span>&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <form id="editProgramForm">
                            <div class="form-group">
                                <label for="editProgramCode">Program Code</label>
                                <input type="text" class="form-control" id="editProgramCode" value="${program.code}" required>
                            </div>
                            <div class="form-group">
                                <label for="editProgramName">Program Name</label>
                                <input type="text" class="form-control" id="editProgramName" value="${program.name}" required>
                            </div>
                            <div class="form-group">
                                <label for="editProgramLevel">Program Level</label>
                                <select class="form-control" id="editProgramLevel" required>
                                    <option value="BA" ${program.level === 'BA' ? 'selected' : ''}>BA</option>
                                    <option value="	MSc" ${program.level === '	MSc' ? 'selected' : ''}>MSc</option>
                                    <option value="PhD" ${program.level === 'PhD' ? 'selected' : ''}>PhD</option>
                                </select>
                            </div>
                            <button type="submit" class="btn btn-primary">Update Program</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Setup the Edit Program Form
function setupEditProgramForm(program) {
    const form = document.getElementById('editProgramForm');
    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const updatedProgram = {
            code: document.getElementById('editProgramCode').value,
            name: document.getElementById('editProgramName').value,
            level: document.getElementById('editProgramLevel').value,
        };
        await updateProgram(program, updatedProgram);
        $('#editProgramModal').modal('hide');
        await loadPrograms();
    });
}

// Update a Program
async function updateProgram(originalProgram, updatedProgram) {
    const submitButton = document.querySelector('#editProgramForm button[type="submit"]');
    try {
        // Show loading state
        submitButton.disabled = true;
        submitButton.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Updating...';

        // Validate input
        if (!updatedProgram.code.trim() || !updatedProgram.name.trim() || !updatedProgram.level) {
            throw new Error('Program code, name, and level are required');
        }

        const response = await fetch(
            `${apiBaseUrl}/api/programs/${encodeURIComponent(originalProgram.code)}/${encodeURIComponent(originalProgram.level)}`,
            {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...updatedProgram,
                    code: updatedProgram.code.trim(),
                    name: updatedProgram.name.trim()
                })
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(Object.values(errorData.errors).flat().join('\n'));
        }

        alert('Program updated successfully');
    } catch (error) {
        console.error('Error updating program:', error);
        alert('Error updating program: ' + error.message);
    } finally {
        // Reset loading state
        submitButton.disabled = false;
        submitButton.textContent = 'Update Program';
    }
}

// Handle Deleting a Program
async function handleDeleteProgram(programCode, programLevel) {
    if (!confirm('Are you sure you want to delete this program?')) return;

    try {
        const response = await fetch(
            `${apiBaseUrl}/api/programs/${encodeURIComponent(programCode)}/${encodeURIComponent(programLevel)}`,
            { method: 'DELETE' }
        );

        if (!response.ok) {
            const errorData = await response.text();
            throw new Error(errorData || 'Failed to delete program');
        }

        alert('Program deleted successfully');
        await loadPrograms();
    } catch (error) {
        console.error('Error deleting program:', error);
        alert('Error deleting program: ' + error.message);
    }
}

// Show a Bootstrap Modal
function showModal(modalHtml, modalId) {
    const existingModal = document.getElementById(modalId);
    if (existingModal) {
        existingModal.remove();
    }
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    $(`#${modalId}`).modal('show');
}

function displayAvailableCourses(courses) {
    const container = document.getElementById('availableCoursesBody');
    container.innerHTML = courses.map(course => `
        <tr>
            <td>${course.code}</td>
            <td>${course.name}</td>
            <td>
                <button class="btn btn-success btn-sm add-to-program" 
                    data-course-code="${course.code}"
                    data-course-name="${course.name}">
                    +
                </button>
            </td>
        </tr>
    `).join('');
}

// Setup Course Management Handlers
function setupCourseManagementHandlers(program) {
    // Clone the form to remove existing event listeners
    const editForm = document.getElementById('editProgramCourse');
    const newEditForm = editForm.cloneNode(true);
    editForm.parentNode.replaceChild(newEditForm, editForm);

    const addForm = document.getElementById('addCourseToProgram');
    const newAddForm = addForm.cloneNode(true);
    addForm.parentNode.replaceChild(newAddForm, addForm);

    // Edit Course Handler
    document.querySelectorAll('.edit-program-course').forEach(button => {
        button.addEventListener('click', () => {
            const courseData = button.dataset;
            showEditForm(courseData);
        });
    });

    // Remove Course Handler
    document.querySelectorAll('.remove-program-course').forEach(button => {
        button.addEventListener('click', () => {
            const courseCode = button.dataset.courseCode;
            removeCourseFromProgram(program, courseCode);
        });
    });

    // Add Course Handler
    document.querySelectorAll('.add-to-program').forEach(button => {
        button.addEventListener('click', () => {
            showAddForm(
                button.dataset.courseCode,
                button.dataset.courseName
            );
        });
    });

    // Edit Form Submit Handler
    newEditForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        
        const courseDetails = {
            ects: parseInt(document.getElementById('editCourseEcts').value),
            credits: parseInt(document.getElementById('editCourseCredits').value),
            semester: parseInt(document.getElementById('editCourseSemester').value),
            type: document.getElementById('editCourseType').value
        };
        const courseCode = document.getElementById('editCourseCode').value;

        await updateProgramCourse(program, courseCode, courseDetails);
        hideEditForm();
    });

    // Add Form Submit Handler
    newAddForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        
        const courseDetails = {
            ects: parseInt(document.getElementById('courseEcts').value),
            credits: parseInt(document.getElementById('courseCredits').value),
            semester: parseInt(document.getElementById('courseSemester').value),
            type: document.getElementById('courseType').value
        };
        const courseCode = document.getElementById('addCourseCode').value;

        await addCourseToProgram(program, courseCode, courseDetails);
        hideAddForm();
    });
}

function showAddForm(courseCode, courseName) {
    const addForm = document.getElementById('addFormSection');
    addForm.style.display = 'block';
    document.getElementById('addCourseCode').value = courseCode;
    
    // Update the form header to include course details
    document.getElementById('addFormHeader').innerHTML = 
        `Add Course to Program - ${courseCode} ${courseName}`;
    
    addForm.scrollIntoView({ behavior: 'smooth' });
}

function hideAddForm() {
    document.getElementById('addFormSection').style.display = 'none';
}

async function addCourseToProgram(program, courseCode, courseDetails) {
    try {
        const response = await fetch(`${apiBaseUrl}/api/course-programs`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                programCode: program.code,
                programLevel: program.level,
                courseCode: courseCode,
                ects: courseDetails.ects,
                credits: courseDetails.credits,
                semester: courseDetails.semester,
                type: courseDetails.type
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(Object.values(errorData.errors).flat().join('\n'));
        }

        alert('Course added to program successfully');
        await loadProgramCourses(program);
        await loadAvailableCourses(program);
        setupCourseManagementHandlers(program);
    } catch (error) {
        console.error('Error adding course to program:', error);
        alert('Error adding course: ' + error.message);
    }
}

async function updateProgramCourse(program, courseCode, courseDetails) {
    try {
        const response = await fetch(`${apiBaseUrl}/api/course-programs`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                programCode: program.code,
                programLevel: program.level,
                courseCode: courseCode,
                ects: courseDetails.ects,
                credits: courseDetails.credits,
                semester: courseDetails.semester,
                type: courseDetails.type
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(Object.values(errorData.errors).flat().join('\n'));
        }

        alert('Course updated successfully');
        await loadProgramCourses(program);
    } catch (error) {
        console.error('Error updating course:', error);
        alert('Error updating course: ' + error.message);
    }
}

async function removeCourseFromProgram(program, courseCode) {
    if (!confirm('Are you sure you want to remove this course from the program?')) return;

    try {
        const response = await fetch(
            `${apiBaseUrl}/api/course-programs/${program.code}/${program.level}/${courseCode}`,
            { method: 'DELETE' }
        );

        if (!response.ok) {
            const errorData = await response.text();
            throw new Error(errorData || 'Failed to remove course');
        }

        alert('Course removed successfully');
        await loadProgramCourses(program);
        await loadAvailableCourses(program);
        setupCourseManagementHandlers(program);
    } catch (error) {
        console.error('Error removing course:', error);
        alert('Error removing course: ' + error.message);
    }
}

function showEditForm(courseData) {
    const editForm = document.getElementById('editFormSection');
    editForm.style.display = 'block';
    
    // Update the form header to include course details
    document.getElementById('editFormHeader').innerHTML = 
        `Edit Course Details - ${courseData.courseCode} ${courseData.courseName}`;
    
    // Populate form fields
    document.getElementById('editCourseEcts').value = courseData.ects;
    document.getElementById('editCourseCredits').value = courseData.credits;
    document.getElementById('editCourseSemester').value = courseData.semester;
    document.getElementById('editCourseType').value = courseData.type;
    document.getElementById('editCourseCode').value = courseData.courseCode;
    
    editForm.scrollIntoView({ behavior: 'smooth' });
}

function hideEditForm() {
    document.getElementById('editFormSection').style.display = 'none';
}

function setupSearchFunctionality(courses) {
    const searchInput = document.getElementById('courseSearchInput');
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        filterCourses(courses, searchTerm);
    });
}

function filterCourses(courses, searchTerm) {
    const filteredCourses = courses.filter(course => 
        course.code.toLowerCase().includes(searchTerm) || 
        course.name.toLowerCase().includes(searchTerm)
    );
    displayAvailableCourses(filteredCourses);
    setupCourseManagementHandlers({ code: '', level: '' });
}