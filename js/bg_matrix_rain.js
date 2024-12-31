document.addEventListener('DOMContentLoaded', function() {
    // Initialising the canvas
    var canvas = document.getElementById('myCanvas'),
        ctx = canvas.getContext('2d');

    // Function to resize the canvas to the size of its container
    function resizeCanvas() {
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
    }

    // Initial resize
    resizeCanvas();

    // Resize the canvas whenever the window is resized
    window.addEventListener('resize', resizeCanvas);

    // Setting up the letters
    var letters = 'ABCDEFGHIJKLMNOPQRSTUVXYZABCDEFGHIJKLMNOPQRSTUVXYZABCDEFGHIJKLMNOPQRSTUVXYZABCDEFGHIJKLMNOPQRSTUVXYZABCDEFGHIJKLMNOPQRSTUVXYZABCDEFGHIJKLMNOPQRSTUVXYZ';
    letters = letters.split('');

    // Setting up the columns
    var fontSize = 10;
    var columns = canvas.width / fontSize;

    // Setting up the drops
    var drops = [];
    for (var i = 0; i < columns; i++) {
        drops[i] = 1;
    }

    // Setting up the draw function
    function draw() {
        ctx.fillStyle = 'rgba(0, 0, 0, .1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        for (var i = 0; i < drops.length; i++) {
            var text = letters[Math.floor(Math.random() * letters.length)];
            // 90% chance of blue, 10% chance of white
            var color = Math.random() < 0.94 ? '#0080FF' : '#FFFFFF';
            ctx.fillStyle = color;
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);
            drops[i]++;
            if (drops[i] * fontSize > canvas.height && Math.random() > 0.95) {
                drops[i] = 0;
            }
        }
    }

    // Loop the animation
    setInterval(draw, 33);
});

