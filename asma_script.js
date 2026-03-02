// Define the correct username and password
const validUsername = 'test';
const validPassword = 'test';

// Function to check login credentials
function checkLogin() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (username === validUsername && password === validPassword) {
        // Hide login form and show content
        document.getElementById('login').style.display = 'none';
        document.querySelector('.container').style.display = 'block';
    } else {
        alert('Invalid username or password');
    }
}

// Add event listener to the login button
document.getElementById('loginButton').addEventListener('click', checkLogin);


// Function to create a mermaid icon and animate it like confetti
function createMermaidIcon() {
    const mermaid = document.createElement('div');
    mermaid.innerHTML = '🧜‍♀️';  // Mermaid emoji as confetti
    mermaid.style.position = 'fixed';
    mermaid.style.left = `${Math.random() * 100}vw`; // Random horizontal position
    mermaid.style.top = `0`;  // Start from the top
    mermaid.style.fontSize = '2rem';
    mermaid.style.zIndex = 9999;
    document.body.appendChild(mermaid);

    // Animate the mermaid falling
    const fallAnimation = mermaid.animate(
        [
            { transform: `translateY(0)` },
            { transform: `translateY(${window.innerHeight}px)` }
        ],
        {
            duration: 3000 + Math.random() * 2000,  // Random fall duration
            easing: 'ease-in',
            iterations: 1
        }
    );

    // Remove the mermaid after animation ends
    fallAnimation.onfinish = () => {
        mermaid.remove();
    };
}

// Function to trigger confetti
function triggerConfetti() {
    for (let i = 0; i < 30; i++) {  // Adjust the number of mermaids here
        createMermaidIcon();
    }
}
