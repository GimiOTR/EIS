// Constants
const API_BASE_URL = 'https://localhost:7173';

// Load academic years on page load
document.addEventListener('DOMContentLoaded', loadAcademicYears);

// Create toast container when page loads
document.addEventListener('DOMContentLoaded', () => {
  const toastContainer = document.createElement('div');
  toastContainer.id = 'toast-container';
  document.body.appendChild(toastContainer);
});

async function loadAcademicYears() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/years`);
        const academicYears = await response.json();
        updateAcademicYearList(academicYears);
    } catch (error) {
        console.error('Error loading academic years:', error);
        showAlert('Failed to load academic years');
    }
}

function updateAcademicYearList(academicYears) {
    const list = document.getElementById('academic-year-list');
    list.innerHTML = '';
    
    // Sort academic years by startYear in descending order
    const sortedYears = [...academicYears].sort((a, b) => b.startYear - a.startYear);
    const currentYear = sortedYears[0]; 
    
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
        `;
        list.appendChild(li);
        
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

document.getElementById('start-academic-year-btn').addEventListener('click', async () => {
    try {
        // Assuming you have an API endpoint to add a new academic year
        const response = await fetch(`${API_BASE_URL}/api/years`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
        });

        const responseData = await response.json();

        if (!response.ok || responseData.result !== 'false') {
            throw new Error(responseData.message);
        }

        alert('New academic year started successfully');
        return responseData;
    } catch (error) {
        console.error('Error starting new academic year:', error);
        alert(error.message || 'Failed to start new academic year. Please try again.');
    }
});


// Helper function to get the current year
async function getCurrentYear() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/years`);
        if (!response.ok) throw new Error('Failed to fetch academic years');
        
        const academicYears = await response.json();
        const sortedYears = [...academicYears].sort((a, b) => b.startYear - a.startYear);
        return sortedYears[0]; // Return the latest year
    } catch (error) {
        console.error('Error fetching current year:', error);
        return null;
    }
}

async function toggleSemester(startYear, semester, finalized) {
    try {
        const getResponse = await fetch(`${API_BASE_URL}/api/years/${startYear}`);
        if (!getResponse.ok) throw new Error('Failed to get academic year details');
        
        const currentYear = await getResponse.json();
        
        const updateData = {
            fallSemesterFinalized: semester === 'fall' ? finalized : currentYear.fallSemesterFinalized,
            springSemesterFinalized: semester === 'spring' ? finalized : currentYear.springSemesterFinalized
        };

        const response = await fetch(`${API_BASE_URL}/api/years/${startYear}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updateData)
        });

        const responseData = await response.json();

        if (!response.ok || responseData.result == false) {
            throw new Error(responseData.message);
        }
        
        await loadAcademicYears();
        
        const semesterDisplay = semester.charAt(0).toUpperCase() + semester.slice(1);
        const statusDisplay = finalized ? 'finalized' : 'opened';
        showAlert(`${semesterDisplay} semester successfully ${statusDisplay}`);
    } catch (error) {
        console.error('Error updating semester status:', error);
        showAlert(`Error: ${error.message}`);
    }
}


function showAlert(message, type = 'info') {
  const container = document.getElementById('toast-container');
  const alertDiv = document.createElement('div');
  
  alertDiv.className = `alert-toast ${type}`;
  alertDiv.innerHTML = `
    <div class="alert-content">
      <i class="fas ${getAlertIcon(type)}"></i>
      <span>${message}</span>
    </div>
    <button class="close-btn" onclick="removeToast(this.parentElement)">×</button>
  `;
  
  container.appendChild(alertDiv);
  repositionToasts();
  
  setTimeout(() => removeToast(alertDiv), 5000);
}

function removeToast(toast) {
  toast.classList.add('fade-out');
  setTimeout(() => {
    toast.remove();
    repositionToasts();
  }, 300);
}

function repositionToasts() {
  const toasts = document.querySelectorAll('.alert-toast');
  let offset = 20;
  
  toasts.forEach(toast => {
    toast.style.top = offset + 'px';
    offset += toast.offsetHeight + 10;
  });
}

function getAlertIcon(type) {
  switch(type) {
    case 'success': return 'fa-check-circle';
    case 'error': return 'fa-exclamation-circle'; 
    case 'warning': return 'fa-exclamation-triangle';
    default: return 'fa-info-circle';
  }
}