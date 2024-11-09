const apiBaseUrl = 'https://localhost:7173';

// Initial Setup
document.addEventListener('DOMContentLoaded', function () {
    setupAddProgramForm();
    if (document.getElementById('programsTableBody')) {
        loadPrograms();
    }
});

function setupAddProgramForm() {
    const addProgramForm = document.getElementById('addProgramForm');
    if (!addProgramForm) return;

    addProgramForm.addEventListener('submit', async function (event) {
        event.preventDefault();
        const programData = {
            code: document.getElementById('programCode').value,
            name: document.getElementById('programName').value,
            level: document.getElementById('programLevel').value
        };
        await createProgram(programData);
        $('#addProgramModal').modal('hide');
        await loadPrograms();
    });
}

// Program CRUD Operations
async function createProgram(programData) {
    const submitButton = document.querySelector('#addProgramForm button[type="submit"]');
    try {
        // Show loading state
        submitButton.disabled = true;
        submitButton.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Creating...';

        // Validate input
        if (!programData.code?.trim() || !programData.name?.trim() || !programData.level) {
            throw new Error('Program code, name, and level are required');
        }

        const response = await fetch(`${apiBaseUrl}/api/programs`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                ...programData,
                code: programData.code.trim(),
                name: programData.name.trim()
            })
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(Object.values(errorData.errors).flat().join('\n'));
        }

        const result = await response.json();
        alert('Program created successfully');
        return result;
    } catch (error) {
        console.error('Error creating program:', error);
        alert('Error creating program: ' + error.message);
        throw error;
    } finally {
        // Reset loading state
        submitButton.disabled = false;
        submitButton.textContent = 'Create Program';
    }
}

async function loadPrograms() {
    const tableBody = document.getElementById('programsTableBody');
    if (!tableBody) return;

    try {
        // Show loading state
        tableBody.innerHTML = '<tr><td colspan="5" class="text-center"><span class="spinner-border"></span> Loading programs...</td></tr>';

        const response = await fetch(`${apiBaseUrl}/api/programs`);
        if (!response.ok) {
            throw new Error('Failed to fetch programs');
        }

        const programs = await response.json();
        
        if (programs.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="5" class="text-center">No programs found</td></tr>';
            return;
        }

        updateProgramsTable(programs);
    } catch (error) {
        console.error('Error loading programs:', error);
        tableBody.innerHTML = '<tr><td colspan="5" class="text-center text-danger">Error loading programs</td></tr>';
    }
}

function updateProgramsTable(programs) {
    const programsTableBody = document.getElementById('programsTableBody');
    if (!programsTableBody) return;

    programsTableBody.innerHTML = '';
    programs.forEach(program => {
        const row = createProgramRow(program);
        programsTableBody.appendChild(row);
    });
}

function createProgramRow(program) {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${program.code}</td>
        <td>${program.name}</td>
        <td>${program.level}</td>
        <td>
            <button class="btn btn-info btn-sm manage-courses" 
                data-code="${program.code}" data-level="${program.level}">
                Manage Courses
            </button>
        </td>
        <td>
            <button class="btn btn-warning btn-sm edit-program" 
                data-code="${program.code}" data-level="${program.level}">
                Edit
            </button>
            <button class="btn btn-danger btn-sm delete-program" 
                data-code="${program.code}" data-level="${program.level}">
                Delete
            </button>
        </td>
    `;

    attachProgramRowEventListeners(row, program);
    return row;
}

function attachProgramRowEventListeners(row, program) {
    row.querySelector('.edit-program')
        .addEventListener('click', () => handleEditProgram(program));
    row.querySelector('.delete-program')
        .addEventListener('click', () => handleDeleteProgram(program.code, program.level));
    row.querySelector('.manage-courses')
        .addEventListener('click', () => handleManageCourses(program.code, program.level));
}

async function handleEditProgram(program) {
    const modalHtml = createEditProgramModal(program);
    showModal(modalHtml, 'editProgramModal');
    setupEditProgramForm(program);
}

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
                                <input type="text" class="form-control" id="editProgramCode" 
                                    value="${program.code}" required>
                            </div>
                            <div class="form-group">
                                <label for="editProgramName">Program Name</label>
                                <input type="text" class="form-control" id="editProgramName" 
                                    value="${program.name}" required>
                            </div>
                            <div class="form-group">
                                <label for="editProgramLevel">Level</label>
                                <select class="form-control" id="editProgramLevel" required>
                                    <option value="BA" ${program.level === 'BA' ? 'selected' : ''}>BA</option>
                                    <option value="MSc" ${program.level === 'MSc' ? 'selected' : ''}>MSc</option>
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

function setupEditProgramForm(program) {
    document.getElementById('editProgramForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const updatedProgram = {
            code: document.getElementById('editProgramCode').value,
            name: document.getElementById('editProgramName').value,
            level: document.getElementById('editProgramLevel').value
        };
        await updateProgram(program, updatedProgram);
    });
}

async function updateProgram(originalProgram, updatedProgram) {
    const submitButton = document.querySelector('#editProgramForm button[type="submit"]');
    try {
        // Show loading state
        submitButton.disabled = true;
        submitButton.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Updating...';

        // Validate input
        if (!updatedProgram.code?.trim() || !updatedProgram.name?.trim() || !updatedProgram.level) {
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
        $('#editProgramModal').modal('hide');
        await loadPrograms();
    } catch (error) {
        console.error('Error updating program:', error);
        alert('Error updating program: ' + error.message);
    } finally {
        // Reset loading state
        submitButton.disabled = false;
        submitButton.textContent = 'Update Program';
    }
}

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

// Course Management
async function handleManageCourses(programCode, programLevel) {
    const program = { code: programCode, level: programLevel };
    const modalHtml = createManageCoursesModal(program);
    showModal(modalHtml, 'manageProgramCoursesModal');
    await setupCourseManagement(program);
}

function createManageCoursesModal(program) {
    return `
        <div class="modal fade" id="manageProgramCoursesModal" tabindex="-1" role="dialog">
            <div class="modal-dialog modal-xl" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Manage Courses for ${program.code} - ${program.level}</h5>
                        <button type="button" class="close" data-dismiss="modal">
                            <span>&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        ${createCourseSelectionInterface()}
                        ${createCourseDetailsTable()}
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                        <button type="button" class="btn btn-primary" id="saveProgramCourses">Save Changes</button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function createCourseSelectionInterface() {
    return `
        <div class="row mb-3">
            <div class="col-md-5">
                <h6>Available Courses</h6>
                <div class="input-group mb-2">
                    <input type="text" class="form-control" id="availableCoursesFilter" 
                        placeholder="Filter available courses...">
                    <div class="input-group-append">
                        <button class="btn btn-outline-secondary" type="button" 
                            onclick="clearFilter('availableCoursesFilter')">Clear</button>
                    </div>
                </div>
                <select multiple class="form-control" id="availableCourses" style="height: 300px;"></select>
            </div>
            <div class="col-md-2 text-center my-auto">
                <button class="btn btn-primary mb-2" id="addCourseBtn">&gt;&gt;</button>
                <button class="btn btn-primary" id="removeCourseBtn">&lt;&lt;</button>
            </div>
            <div class="col-md-5">
                <h6>Program Courses</h6>
                <div class="input-group mb-2">
                    <input type="text" class="form-control" id="programCoursesFilter" 
                        placeholder="Filter program courses...">
                    <div class="input-group-append">
                        <button class="btn btn-outline-secondary" type="button" 
                            onclick="clearFilter('programCoursesFilter')">Clear</button>
                    </div>
                </div>
                <select multiple class="form-control" id="programCourses" style="height: 300px;"></select>
            </div>
        </div>
    `;
}

function createCourseDetailsTable() {
    return `
        <div class="row">
            <div class="col-12">
                <h6>Course Details</h6>
                <div class="table-responsive">
                    <table class="table table-bordered table-hover">
                        <thead class="thead-light">
                            <tr>
                                <th>Course Code</th>
                                <th>Course Name</th>
                                <th>Credits</th>
                                <th>ECTS</th>
                                <th>Semester</th>
                                <th>Type</th>
                            </tr>
                        </thead>
                        <tbody id="courseDetailsTableBody"></tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
}

async function setupCourseManagement(program) {
    const modalBody = document.querySelector('#manageProgramCoursesModal .modal-body');
    try {
        // Show loading state
        modalBody.innerHTML = '<div class="text-center"><span class="spinner-border"></span> Loading courses...</div>';
        
        // First restore the modal content
        modalBody.innerHTML = createCourseSelectionInterface() + createCourseDetailsTable();
        
        // Then setup filtering and load data
        setupCourseFiltering();
        await loadCourseSelections(program.code, program.level);
        setupCourseManagementEventListeners(program);
        
    } catch (error) {
        modalBody.innerHTML = '<div class="alert alert-danger">Failed to load courses. Please try again.</div>';
        console.error('Error setting up course management:', error);
    }
}

function setupCourseManagementEventListeners(program) {
    const addBtn = document.getElementById('addCourseBtn');
    const removeBtn = document.getElementById('removeCourseBtn');
    const saveBtn = document.getElementById('saveProgramCourses');

    addBtn.addEventListener('click', () => {
        const availableSelect = document.getElementById('availableCourses');
        if (!availableSelect.selectedOptions.length) {
            alert('Please select courses to add');
            return;
        }
        moveCourses(true);
        updateCourseDetailsTable(program);
    });
    
    removeBtn.addEventListener('click', () => {
        const programSelect = document.getElementById('programCourses');
        if (!programSelect.selectedOptions.length) {
            alert('Please select courses to remove');
            return;
        }
        moveCourses(false);
        updateCourseDetailsTable(program);
    });

    saveBtn.addEventListener('click', async () => {
        const programSelect = document.getElementById('programCourses');
        if (programSelect.options.length === 0) {
            alert('Please add at least one course to the program');
            return;
        }
        await saveProgramCoursesWithDetails(program);
    });

    // Add double-click handlers for quick add/remove
    document.getElementById('availableCourses').addEventListener('dblclick', () => {
        moveCourses(true);
        updateCourseDetailsTable(program);
    });

    document.getElementById('programCourses').addEventListener('dblclick', () => {
        moveCourses(false);
        updateCourseDetailsTable(program);
    });
}

function setupCourseFiltering() {
    const setupFilter = (filterId, selectId) => {
        const filterInput = document.getElementById(filterId);
        const debounceTimeout = 300;
        let timeoutId;

        filterInput.addEventListener('input', (e) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                filterCourseList(selectId, e.target.value);
            }, debounceTimeout);
        });

        // Add clear button functionality
        const clearBtn = filterInput.nextElementSibling.querySelector('button');
        clearBtn.addEventListener('click', () => {
            filterInput.value = '';
            filterCourseList(selectId, '');
            filterInput.focus();
        });
    };

    setupFilter('availableCoursesFilter', 'availableCourses');
    setupFilter('programCoursesFilter', 'programCourses');
}

function filterCourseList(selectId, filterText) {
    const select = document.getElementById(selectId);
    const noResultsMsg = `No ${selectId === 'availableCourses' ? 'available' : 'program'} courses found`;
    let hasVisibleOptions = false;

    Array.from(select.options).forEach(option => {
        const text = option.text.toLowerCase();
        const filter = filterText.toLowerCase();
        const visible = text.includes(filter);
        option.style.display = visible ? '' : 'none';
        if (visible) hasVisibleOptions = true;
    });

    // Show/hide no results message
    let noResultsEl = select.nextElementSibling;
    if (!noResultsEl || !noResultsEl.classList.contains('no-results')) {
        noResultsEl = document.createElement('div');
        noResultsEl.classList.add('no-results', 'text-muted', 'text-center', 'py-2');
        select.parentNode.insertBefore(noResultsEl, select.nextSibling);
    }
    noResultsEl.textContent = hasVisibleOptions ? '' : noResultsMsg;
}

function moveCourses(isAdding) {
    const sourceId = isAdding ? 'availableCourses' : 'programCourses';
    const targetId = isAdding ? 'programCourses' : 'availableCourses';
    moveSelectedOptions(sourceId, targetId);
}

function moveSelectedOptions(sourceId, targetId) {
    const sourceSelect = document.getElementById(sourceId);
    const targetSelect = document.getElementById(targetId);
    
    Array.from(sourceSelect.selectedOptions).forEach(option => {
        targetSelect.add(new Option(option.text, option.value));
        sourceSelect.remove(option.index);
    });
}

function updateCourseDetailsTable(program) {
    const programSelect = document.getElementById('programCourses');
    const tableBody = document.getElementById('courseDetailsTableBody');
    tableBody.innerHTML = '';
    
    if (programSelect.options.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="6" class="text-center text-muted">No courses selected</td></tr>';
        return;
    }

    Array.from(programSelect.options).forEach((option, index) => {
        const [courseCode, ...nameParts] = option.text.split(' - ');
        const courseName = nameParts.join(' - ');
        
        const row = document.createElement('tr');
        row.innerHTML = createCourseDetailRow(option.value, courseCode, courseName, index + 1);
        tableBody.appendChild(row);

        // Add validation listeners to inputs
        const inputs = row.querySelectorAll('input[type="number"]');
        inputs.forEach(input => {
            input.addEventListener('input', validateNumericInput);
        });
    });
}

function validateNumericInput(event) {
    const input = event.target;
    const value = parseInt(input.value);
    const min = parseInt(input.min);
    const max = parseInt(input.max);

    if (isNaN(value) || value < min || value > max) {
        input.classList.add('is-invalid');
        input.title = `Please enter a value between ${min} and ${max}`;
    } else {
        input.classList.remove('is-invalid');
        input.title = '';
    }
}

function createCourseDetailRow(optionValue, courseCode, courseName, rowNumber) {
    return `
        <td class="align-middle">${rowNumber}. ${courseCode}</td>
        <td class="align-middle">${courseName}</td>
        <td>
            <div class="input-group input-group-sm">
                <input type="number" class="form-control" 
                    name="credits_${optionValue}" value="3" min="0" max="15"
                    title="Credits (0-15)" required>
                <div class="invalid-feedback">Invalid credits value</div>
            </div>
        </td>
        <td>
            <div class="input-group input-group-sm">
                <input type="number" class="form-control" 
                    name="ects_${optionValue}" value="6" min="0" max="30"
                    title="ECTS (0-30)" required>
                <div class="invalid-feedback">Invalid ECTS value</div>
            </div>
        </td>
        <td>
            <select class="form-control form-control-sm" name="semester_${optionValue}" required>
                ${Array.from({length: 6}, (_, i) => 
                    `<option value="${i + 1}">${i + 1}</option>`).join('')}
            </select>
        </td>
        <td>
            <select class="form-control form-control-sm" name="type_${optionValue}" required>
                <option value="Compulsory">Compulsory</option>
                <option value="Optional">Optional</option>
            </select>
        </td>
    `;
}

async function saveProgramCoursesWithDetails(program) {
    const saveButton = document.getElementById('saveProgramCourses');
    try {
        // Show loading state
        saveButton.disabled = true;
        saveButton.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Saving...';

        const programSelect = document.getElementById('programCourses');
        if (programSelect.options.length === 0) {
            throw new Error('Please select at least one course');
        }

        const courseDetails = Array.from(programSelect.options).map(option => {
            const courseCode = option.textContent.split(' - ')[0].trim();
            
            return {
                courseCode: String(courseCode),
                programCode: String(program.code),
                programLevel: String(program.level),
                credits: parseInt(document.querySelector(`[name="credits_${option.value}"]`).value),
                ects: parseInt(document.querySelector(`[name="ects_${option.value}"]`).value),
                semester: parseInt(document.querySelector(`[name="semester_${option.value}"]`).value),
                type: document.querySelector(`[name="type_${option.value}"]`).value
            };
        });
        
        const requestBody = courseDetails[0];
        const response = await fetch(`${apiBaseUrl}/api/course-programs`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(handleSaveError(errorData));
        }

        alert('Program courses saved successfully');
        $('#manageProgramCoursesModal').modal('hide');
        await loadPrograms();
    } catch (error) {
        console.error('Error saving program courses:', error);
        alert(error.message);
    } finally {
        // Reset loading state
        saveButton.disabled = false;
        saveButton.textContent = 'Save Changes';
    }
}

function handleSaveError(errorData) {
    console.error('Error details:', errorData);
    let errorMessage = 'Error saving program courses:\n';
    if (errorData.errors) {
        Object.entries(errorData.errors).forEach(([key, value]) => {
            errorMessage += `${key}: ${value.join(', ')}\n`;
        });
    } else {
        errorMessage += errorData.title || 'Unknown error occurred';
    }
    return errorMessage;
}

async function loadCourseSelections(programCode, programLevel) {
    try {
        const allCoursesResponse = await fetch(`${apiBaseUrl}/api/courses`);
        if (!allCoursesResponse.ok) {
            throw new Error('Failed to fetch available courses');
        }
        const allCourses = await allCoursesResponse.json();
        
        const availableSelect = document.getElementById('availableCourses');
        const programSelect = document.getElementById('programCourses');

        availableSelect.innerHTML = '';
        programSelect.innerHTML = '';

        allCourses.forEach(course => {
            const option = document.createElement('option');
            option.value = course.id;
            option.textContent = `${course.code} - ${course.name}`;
            availableSelect.appendChild(option);
        });

        console.log('All courses:', allCourses);
    } catch (error) {
        console.error('Error loading courses:', error);
        alert('Error loading courses: ' + error.message);
    }
}

// Utility Functions
function showModal(modalHtml, modalId) {
    const existingModal = document.getElementById(modalId);
    if (existingModal) {
        existingModal.remove();
    }
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    $(`#${modalId}`).modal('show');
}