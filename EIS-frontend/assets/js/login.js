const apiBaseUrl = 'https://localhost:7173';

document.getElementById("loginForm").addEventListener("submit", async (event) => {
    event.preventDefault(); // Prevent form from submitting traditionally
  
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
  
    const credentials = btoa(`${email}:${password}`);
    try {
        const response = await fetch(`${apiBaseUrl}/login`, {
            method: "POST",
            headers: {
                "Authorization": `Basic ${credentials}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password }),
        });
      
        if (response.ok) {
            // Redirect to the homepage upon successful login
            window.location.href = "./admin/admin.html";
        } else {
            // Handle error (e.g., show an error message)
            const errorMessage = await response.text();
            alert(`Login failed: ${errorMessage}`);
        }
    } catch (error) {
        console.error("Error during login:", error);
        alert("An error occurred during login. Please try again later.");
    }
});