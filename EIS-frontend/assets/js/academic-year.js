// Constants
const API_BASE_URL = 'https://localhost:7173';

// Load academic years on page load
document.addEventListener('DOMContentLoaded', loadAcademicYears);

async function loadAcademicYears() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/years`);
        const academicYears = await response.json();
        updateAcademicYearList(academicYears);
    } catch (error) {
        console.error('Error loading academic years:', error);
        alert('Failed to load academic years');
    }
}

function updateAcademicYearList(academicYears) {
    const list = document.getElementById('academic-year-list');
    list.innerHTML = '';
    
    // Sort academic years by startYear in descending order
    const sortedYears = [...academicYears].sort((a, b) => b.startYear - a.startYear);
    const currentYear = sortedYears[0]; // Latest year is the current year
    
    sortedYears.forEach(year => {
        const yearDisplay = `${year.startYear}-${year.endYear}`;
        const li = document.createElement('li');
        const isCurrentYear = year.startYear === currentYear.startYear;
        
        li.className = `list-group-item d-flex justify-content-between align-items-center ${isCurrentYear ? 'current-year' : ''}`;
        li.innerHTML = `
            <div class="d-flex align-items-center">
                <span class="mr-4">
                    ${yearDisplay}
                    ${isCurrentYear ? '<span class="badge badge-primary ml-2">Current Year</span>' : ''}
                </span>
                <div class="btn-group ml-3" role="group">
                    <button class="btn btn-sm ${year.fallSemesterFinalized ? 'btn-success' : 'btn-outline-success'}"
                            onclick="toggleSemester(${year.startYear}, 'fall', ${!year.fallSemesterFinalized})">
                        Fall Semester ${year.fallSemesterFinalized ? '(Finalized)' : '(Open)'}
                    </button>
                    <button class="btn btn-sm ${year.springSemesterFinalized ? 'btn-success' : 'btn-outline-success'}"
                            onclick="toggleSemester(${year.startYear}, 'spring', ${!year.springSemesterFinalized})">
                        Spring Semester ${year.springSemesterFinalized ? '(Finalized)' : '(Open)'}
                    </button>
                </div>
            </div>
            <button class="btn btn-primary btn-sm" onclick="handleEdit(${year.startYear}, ${year.endYear})">Edit</button>
        `;
        list.appendChild(li);
        
        // If this is the current year, also update the current year display at the top
        if (isCurrentYear) {
            updateCurrentYearDisplay(year);
        }
    });
}

function updateCurrentYearDisplay(currentYear) {
    const currentYearDisplay = document.getElementById('current-year-display');
    if (currentYearDisplay) {
        currentYearDisplay.innerHTML = `
            <div class="card-body">
                <h5 class="card-title mb-0">
                    <i class="fas fa-calendar-alt"></i> 
                    Current Academic Year: ${currentYear.startYear}-${currentYear.endYear}
                </h5>
                <div class="mt-3">
                    <span class="mr-3">
                        Fall Semester: 
                        <span class="badge ${currentYear.fallSemesterFinalized ? 'badge-success' : 'badge-warning'}">
                            ${currentYear.fallSemesterFinalized ? 'Finalized' : 'Open'}
                        </span>
                    </span>
                    <span>
                        Spring Semester: 
                        <span class="badge ${currentYear.springSemesterFinalized ? 'badge-success' : 'badge-warning'}">
                            ${currentYear.springSemesterFinalized ? 'Finalized' : 'Open'}
                        </span>
                    </span>
                </div>
            </div>
        `;
    }
}

// Form submission handler
document.getElementById('add-academic-year-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const yearInput = document.getElementById('academic-year');
    const yearValue = yearInput.value.trim();
    
    // Validate input format (e.g., "2024-2025")
    const yearParts = yearValue.split('-');
    if (yearParts.length !== 2) {
        alert('Please enter the academic year in format: YYYY-YYYY');
        return;
    }

    const startYear = parseInt(yearParts[0]);
    const endYear = parseInt(yearParts[1]);

    // Basic validation
    if (isNaN(startYear) || isNaN(endYear) || endYear !== startYear + 1) {
        alert('Invalid academic year format. End year should be start year + 1');
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/api/years`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                startYear: startYear,
                endYear: endYear
            })
        });
        
        if (!response.ok) throw new Error('Failed to add academic year');
        
        yearInput.value = '';
        await loadAcademicYears();
        alert('Academic year added successfully');
    } catch (error) {
        console.error('Error adding academic year:', error);
        alert('Failed to add academic year');
    }
});

async function handleEdit(currentStartYear, currentEndYear) {
    // First, get the current academic year details
    try {
        const getResponse = await fetch(`${API_BASE_URL}/api/years/${currentStartYear}`);
        if (!getResponse.ok) throw new Error('Failed to get academic year details');
        
        const currentYear = await getResponse.json();
        
        // Prompt for new values
        const newYearInput = prompt('Enter new academic year (YYYY-YYYY):', `${currentYear.startYear}-${currentYear.endYear}`);
        if (!newYearInput) return;

        const yearParts = newYearInput.split('-');
        if (yearParts.length !== 2) {
            alert('Please enter the academic year in format: YYYY-YYYY');
            return;
        }

        const startYear = parseInt(yearParts[0]);
        const endYear = parseInt(yearParts[1]);

        // Basic validation
        if (isNaN(startYear) || isNaN(endYear) || endYear !== startYear + 1) {
            alert('Invalid academic year format. End year should be start year + 1');
            return;
        }

        // Send PUT request
        const putResponse = await fetch(`${API_BASE_URL}/api/years/${currentStartYear}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                fallSemesterFinalized: currentYear.fallSemesterFinalized,
                springSemesterFinalized: currentYear.springSemesterFinalized
            })
        });
        
        if (!putResponse.ok) throw new Error('Failed to update academic year');
        
        await loadAcademicYears();
        alert('Academic year updated successfully');
    } catch (error) {
        console.error('Error updating academic year:', error);
        alert('Failed to update academic year');
    }
}

async function toggleSemester(startYear, semester, finalized) {
    try {
        // First get current year data
        const getResponse = await fetch(`${API_BASE_URL}/api/years/${startYear}`);
        if (!getResponse.ok) throw new Error('Failed to get academic year details');
        
        const currentYear = await getResponse.json();
        
        // Prepare update data
        const updateData = {
            fallSemesterFinalized: semester === 'fall' ? finalized : currentYear.fallSemesterFinalized,
            springSemesterFinalized: semester === 'spring' ? finalized : currentYear.springSemesterFinalized
        };

        // Send PUT request
        const response = await fetch(`${API_BASE_URL}/api/years/${startYear}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updateData)
        });

        if (!response.ok) {
            throw new Error(`Failed to update ${semester} semester status`);
        }

        // Refresh the list
        await loadAcademicYears();
        
        // Show success message
        const semesterDisplay = semester.charAt(0).toUpperCase() + semester.slice(1);
        const statusDisplay = finalized ? 'finalized' : 'opened';
        alert(`${semesterDisplay} semester successfully ${statusDisplay}`);
    } catch (error) {
        console.error('Error updating semester status:', error);
        alert(`Failed to update semester status: ${error.message}`);
    }
}
