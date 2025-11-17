const startButton = document.getElementById("startButton");
const scoreDisplay = document.getElementById("score");
const timeDisplay = document.getElementById("time");
const holes = document.querySelectorAll(".hole");

const bompSound = document.getElementById("bomp-sound");
const endSound = document.getElementById("end-sound");
const highSound = document.getElementById("high-sound");
const exSound = document.getElementById("explosion");
const jeSound = document.getElementById("jethalal");
const tuSound = document.getElementById("tulu");
const loSound = document.getElementById("lost");
const goSound = document.getElementById("go");


let score = 0;
let time = 30;
let isPlaying = false;
let countdown;

// The face image filenames
const faces = ["p1.png", "p2.png", "p3.png"];
const badFace = "p4.png";

function randomTime(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Show one face or badface at a time in a random hole
function displayImage() {
    // Hide all images and remove class from all holes
    holes.forEach(hole => {
        const imgs = hole.querySelectorAll("img");
        imgs.forEach(img => {
            img.style.display = "none";          // Hide all images
            img.classList.remove("clicked");     // Remove effects
        });
        hole.classList.remove("active");
        hole.classList.remove("bad-active");
    });

    // Pick random hole
    const randomHole = holes[Math.floor(Math.random() * holes.length)];
    // Pick random image (3 faces or badface)
    let showBad = Math.random() < 0.25; // 25% chance badface
    let imgToShow;
    if (showBad) {
        imgToShow = randomHole.querySelector('.badface');
        randomHole.classList.add("bad-active");
    } else {
        const goodImages = randomHole.querySelectorAll('.face');
        const pick = Math.floor(Math.random() * goodImages.length);
        imgToShow = goodImages[pick];
        randomHole.classList.add("active");
    }

    // Important: Show the selected image
    if (imgToShow) imgToShow.style.display = "block";

    // Hide image after timeout, repeat if playing
    const displayDuration = randomTime(500, 1500);
    setTimeout(() => {
        if (imgToShow) imgToShow.style.display = "none";
        randomHole.classList.remove("active");
        randomHole.classList.remove("bad-active");
        if (isPlaying) displayImage();
    }, displayDuration);
}


function startGame() {
    score = 0;
    time = 60;
    isPlaying = true;
    startButton.disabled = true;
    startButton.textContent = "Playing...";
    scoreDisplay.textContent = `Score: ${score}`;
    timeDisplay.textContent = `${time}`;

    countdown = setInterval(() => {
        time--;
        timeDisplay.textContent = ` ${time}`;
        if (time === 0) {
            clearInterval(countdown);
            isPlaying = false;
            startButton.disabled = false;
            startButton.textContent = "Start Game";
            document.getElementById("timer").textContent = getMessage();
            
        }
    }, 1000);

    displayImage();
}

startButton.addEventListener("click", startGame);

// Face/Badface click handler
holes.forEach(hole => {
    hole.addEventListener("click", () => {
        let img;
        if (hole.classList.contains("active")) {
            img = hole.querySelector('img');
            if (!img || !faces.includes(img.getAttribute("src"))) return;
            score++;
            scoreDisplay.textContent = `Score: ${score}`;
            bompSound.currentTime = 0;
            bompSound.play();
            img.classList.add("clicked");
            setTimeout(() => {
                img.classList.remove("clicked");
            }, 300);
            img.style.display = "none";
            hole.classList.remove("active");
        }
        if (hole.classList.contains("bad-active")) {
            img = hole.querySelector('img[src="' + badFace + '"]');
            if (!img) return;
            score--;
            exSound.currentTime = 0;
            exSound.play();
            scoreDisplay.textContent = `Score: ${score}`;
            
            // (Optional: Add a different sound for penalty)
            img.classList.add("clicked");
            setTimeout(() => {
                img.classList.remove("clicked");
            }, 300);
            img.style.display = "none";
            hole.classList.remove("bad-active");
        }
    });
});

function getMessage() {
    if (score === 0) {

        tuSound.play();
        return "You didn't score any points! Try again!";
    }
    else if (score < 10) {
        loSound.play();
        return "Not bad, but you can do better!";
    }
    else if (score < 20) {
        goSound.play();
        return "Great job! You're getting the hang of Faceboom!";
    }
    else {
        jeSound.play();
        return "Amazing! You're a Faceboom master!";
    }
        
}

