document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('fireworksCanvas');
    const ctx = canvas.getContext('2d');
    const audio = document.getElementById('background-music');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });

    const playAudio = () => {
        audio.play().then(() => {
            document.removeEventListener('click', playAudio);
        }).catch(error => {
            console.log('Audio playback failed:', error);
        });
    };

    document.addEventListener('click', playAudio);

    class Firework {
        constructor(x, y, targetX, targetY) {
            this.x = x;
            this.y = y;
            this.targetX = targetX;
            this.targetY = targetY;
            this.distanceToTarget = Math.sqrt((targetX - x) ** 2 + (targetY - y) ** 2);
            this.distanceTraveled = 0;
            this.coordinates = [];
            this.coordinateCount = 3;
            while (this.coordinateCount--) {
                this.coordinates.push([this.x, this.y]);
            }
            this.angle = Math.atan2(targetY - y, targetX - x);
            this.speed = 2;
            this.acceleration = 1.05;
            this.brightness = Math.random() * 50 + 50;
            this.targetRadius = 1;
        }

        update(index) {
            this.coordinates.pop();
            this.coordinates.unshift([this.x, this.y]);

            if (this.targetRadius < 8) {
                this.targetRadius += 0.3;
            } else {
                this.targetRadius = 1;
            }

            this.speed *= this.acceleration;

            const vx = Math.cos(this.angle) * this.speed;
            const vy = Math.sin(this.angle) * this.speed;
            this.distanceTraveled = Math.sqrt((this.x + vx - this.x) ** 2 + (this.y + vy - this.y) ** 2);

            if (this.distanceTraveled >= this.distanceToTarget) {
                this.createParticles(this.targetX, this.targetY);
                fireworks.splice(index, 1);
            } else {
                this.x += vx;
                this.y += vy;
            }
        }

        draw() {
            ctx.beginPath();
            ctx.moveTo(this.coordinates[this.coordinates.length - 1][0], this.coordinates[this.coordinates.length - 1][1]);
            ctx.lineTo(this.x, this.y);
            ctx.strokeStyle = `hsl(${Math.random() * 360}, 100%, ${this.brightness}%)`;
            ctx.stroke();

            ctx.beginPath();
            ctx.arc(this.targetX, this.targetY, this.targetRadius, 0, Math.PI * 2);
            ctx.stroke();
        }

        createParticles(x, y) {
            let particleCount = 30;
            while (particleCount--) {
                particles.push(new Particle(x, y));
            }
        }
    }

    class Particle {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.coordinates = [];
            this.coordinateCount = 5;
            while (this.coordinateCount--) {
                this.coordinates.push([this.x, this.y]);
            }
            this.angle = Math.random() * Math.PI * 2;
            this.speed = Math.random() * 10 + 1;
            this.friction = 0.95;
            this.gravity = 1;
            this.hue = Math.random() * 360;
            this.brightness = Math.random() * 50 + 50;
            this.alpha = 1;
            this.decay = Math.random() * 0.03 + 0.01;
        }

        update(index) {
            this.coordinates.pop();
            this.coordinates.unshift([this.x, this.y]);

            this.speed *= this.friction;
            this.x += Math.cos(this.angle) * this.speed;
            this.y += Math.sin(this.angle) * this.speed + this.gravity;
            this.alpha -= this.decay;

            if (this.alpha <= this.decay) {
                particles.splice(index, 1);
            }
        }

        draw() {
            ctx.beginPath();
            ctx.moveTo(this.coordinates[this.coordinates.length - 1][0], this.coordinates[this.coordinates.length - 1][1]);
            ctx.lineTo(this.x, this.y);
            ctx.strokeStyle = `hsla(${this.hue}, 100%, ${this.brightness}%, ${this.alpha})`;
            ctx.stroke();
        }
    }

    const fireworks = [];
    const particles = [];

    function loop() {
        requestAnimationFrame(loop);
        ctx.globalCompositeOperation = 'destination-out';
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.globalCompositeOperation = 'lighter';

        let i = fireworks.length;
        while (i--) {
            fireworks[i].draw();
            fireworks[i].update(i);
        }

        let j = particles.length;
        while (j--) {
            particles[j].draw();
            particles[j].update(j);
        }

        // Increase the frequency of fireworks by increasing the probability
        if (Math.random() < 0.2) { // Tăng xác suất từ 0.05 lên 0.2
            fireworks.push(new Firework(canvas.width / 2, canvas.height, Math.random() * canvas.width, Math.random() * canvas.height / 2));
        }
    }

    loop();
});
