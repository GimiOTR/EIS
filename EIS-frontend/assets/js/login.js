document.getElementById("loginForm").addEventListener("submit", async (event) => {
  event.preventDefault(); // Prevent form from submitting traditionally

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  // Use a more secure method for authentication if possible
  const credentials = btoa(`${username}:${password}`);
  try {
      const response = await fetch("https://localhost:7173/swagger/login", {
          method: "POST",
          headers: {
              "Authorization": `Basic ${credentials}`,
              "Content-Type": "application/json"
          },
          body: JSON.stringify({ username, password }) // Ensure credentials are not in the URL
      });
    
      if (response.ok) {
          // Redirect to the homepage upon successful login
          window.location.href = "/homepage";
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