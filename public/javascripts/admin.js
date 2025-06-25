document.getElementById("alertButton").addEventListener("click", function() {
    alert("Hello Admin! Welcome to your dashboard.");
});

// Add this script to the main template (e.g., in home.ejs or layout.ejs)
if (window.history && window.history.pushState) {
  window.history.pushState(null, null, window.location.href);
  window.onpopstate = function() {
    window.history.pushState(null, null, window.location.href);
  };
}

function checkSessionTimeout() {
    const token = document.cookie.split('; ').find(row => row.startsWith('token='));
    if (!token) {
      alert('Session has expired. Please log in again.');
      window.location.href = '/login';
    }
  }
  // Call the function periodically or on page load
  setInterval(checkSessionTimeout, 5000); // Check every 5 seconds
  

