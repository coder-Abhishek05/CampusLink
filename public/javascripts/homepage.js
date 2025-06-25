document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;

    if (name && email && message) {
        alert(`Thank you, ${name}, for reaching out! We will get back to you soon.`);
        // Here, you would typically send this data to your backend using AJAX or fetch.
    } else {
        alert('Please fill in all fields.');
    }
});

const hero = document.getElementById('hero');
const images = [
    '/images/homepage_img/iiit1.jpeg', // First image
    '/images/homepage_img/iiit2.jpeg', // Second image
    '/images/homepage_img/iiit3.jpeg'  // Third image
];
let currentImageIndex = 0;


    // Function to change background image automatically every 2 seconds
    setInterval(() => {
        currentImageIndex = (currentImageIndex + 1) % images.length; // Loop through images
        hero.style.setProperty('--background-image', `url(${images[currentImageIndex]})`);
    }, 3000); // Change every 2000 milliseconds (2 seconds)

// Get the modal
var modal = document.getElementById("loginModal");

// Get the button that opens the modal
var btn = document.getElementById("loginbutton");

var joinBtn = document.getElementById("joinButton");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// Get all student cards
var studentCards = document.querySelectorAll(".card");

// When the user clicks the button, open the modal 
btn.onclick = function() {
    modal.style.display = "flex";
}

// When the user clicks any student card, open the modal
studentCards.forEach(function(card) {
    card.onclick = function() {
        modal.style.display = "flex";

    }
});

function requireLogin() {
    alert('Please login first to access this feature.');
    window.location.href = '/login';  // Redirect to login page
}

joinBtn.onclick = function() {
    modal.style.display = "flex";

}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}
