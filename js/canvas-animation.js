console.log('Canvas animation script loaded');

// Canvas Animation for Floating Circles
class FloatingCircles {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.circles = [];
        this.resize();
        
        this.init();
        this.animate();

        window.addEventListener('resize', () => this.resize());
    }
    
    resize() {
        this.canvas.width = this.canvas.offsetWidth;
        this.canvas.height = this.canvas.offsetHeight;
        this.createCircles();
    }
    
    createCircles() {
        this.circles = [];
        const circleCount = Math.min(20, Math.floor(this.canvas.width / 80));
        
        for (let i = 0; i < circleCount; i++) {
            this.circles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                radius: Math.random() * 15 + 5,
                speed: Math.random() * 2 + 1,
                opacity: Math.random() * 0.4 + 0.2,
                color: this.getRandomColor(),
                sway: Math.random() * 0.02 
            });
        }
    }
    
    getRandomColor() {
        const colors = [
            'rgba(255, 255, 255, 0.4)',
            'rgba(255, 255, 255, 0.3)',
            'rgba(200, 220, 255, 0.4)',
            'rgba(255, 240, 240, 0.4)'
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
    drawCircle(circle) {
        this.ctx.beginPath();
        this.ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
        
        const gradient = this.ctx.createRadialGradient(
            circle.x, circle.y, 0,
            circle.x, circle.y, circle.radius
        );
        gradient.addColorStop(0, circle.color.replace('0.4', '0.6'));
        gradient.addColorStop(1, circle.color.replace('0.4', '0.1'));
        
        this.ctx.fillStyle = gradient;
        this.ctx.fill();
        
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        this.ctx.lineWidth = 0.5;
        this.ctx.stroke();
    }
    
    updateCircle(circle) {
        circle.y += circle.speed;
        
        circle.x += Math.sin(circle.y * circle.sway) * 0.8;

        if (circle.y - circle.radius > this.canvas.height) {
            circle.y = -circle.radius * 2;
            circle.x = Math.random() * this.canvas.width;
            circle.radius = Math.random() * 15 + 5;
            circle.speed = Math.random() * 2 + 1;
        }
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.circles.forEach(circle => {
            this.updateCircle(circle);
            this.drawCircle(circle);
        });
        
        requestAnimationFrame(() => this.animate());
    }
    
    init() {
        this.createCircles();
        console.log('Floating circles animation started with', this.circles.length, 'circles');
    }
}

document.addEventListener('DOMContentLoaded', function() {
    new FloatingCircles('floatingCircles');
});

class EnergyBurst {
    constructor(buttonId) {
        this.button = document.getElementById(buttonId);
        if (!this.button) return;
        
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.isAnimating = false;
        
        this.setupCanvas();
        this.bindEvents();
    }
    
    setupCanvas() {
        this.canvas.style.position = 'absolute';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.borderRadius = '50px'; 
        this.canvas.style.zIndex = '10';
        
        this.button.style.position = 'relative';
        this.button.appendChild(this.canvas);
        
        this.resize();
    }
    
    resize() {
        const rect = this.button.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
    }
    
    bindEvents() {
         this.button.addEventListener('click', (e) => {
    
        });
        
        window.addEventListener('resize', () => this.resize());
    }

    triggerBurst() {
        this.createBurst();
    }
    
    createBurst(e) {
        const rect = this.button.getBoundingClientRect();
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        for (let i = 0; i < 12; i++) {
            const angle = (i / 12) * Math.PI * 2;
            const speed = Math.random() * 3 + 2;
            
            this.particles.push({
                x: centerX,
                y: centerY,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                life: 1.0,
                maxLife: 1.0,
                size: Math.random() * 6 + 4,
                type: Math.random() > 0.5 ? 'signal' : 'energy', 
                color: this.getParticleColor()
            });
        }
        
        if (!this.isAnimating) {
            this.isAnimating = true;
            this.animate();
        }
    }
    
    getParticleColor() {
        const colors = [
            'rgba(255, 0, 0, 0.8)',     
            'rgba(0, 85, 165, 0.8)',    
            'rgba(0, 194, 255, 0.8)',    
            'rgba(255, 255, 255, 0.9)'   
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
    drawParticle(particle) {
        this.ctx.save();
        
        if (particle.type === 'signal') {
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size * particle.life, 0, Math.PI * 2);
            this.ctx.strokeStyle = particle.color.replace('0.8', '0.4');
            this.ctx.lineWidth = 2;
            this.ctx.stroke();
            
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size * 0.5, 0, Math.PI * 2);
            this.ctx.fillStyle = particle.color;
            this.ctx.fill();
        } else {
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            
            const gradient = this.ctx.createRadialGradient(
                particle.x, particle.y, 0,
                particle.x, particle.y, particle.size
            );
            gradient.addColorStop(0, particle.color.replace('0.8', '1.0'));
            gradient.addColorStop(1, particle.color.replace('0.8', '0.2'));
            
            this.ctx.fillStyle = gradient;
            this.ctx.fill();
        }
        
        this.ctx.restore();
    }
    
    updateParticle(particle) {
        particle.x += particle.vx;
        particle.y += particle.vy;

        particle.life -= 0.02;

        particle.vy += 0.1;

        particle.vx *= 0.98;
        particle.vy *= 0.98;
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            this.updateParticle(particle);
            this.drawParticle(particle);
           
            if (particle.life <= 0) {
                this.particles.splice(i, 1);
            }
        }
        
        if (this.particles.length > 0) {
            requestAnimationFrame(() => this.animate());
        } else {
            this.isAnimating = false;
        }
    }
}

document.addEventListener('DOMContentLoaded', function() {
    new EnergyBurst('connectButton'); 
});

document.getElementById('connectButton').addEventListener('click', function(e) {
    e.preventDefault();
    
    this.dispatchEvent(new Event('click'));
    
    setTimeout(() => {
        document.getElementById('forms').scrollIntoView({ 
            behavior: 'smooth' 
        });
    }, 500); 
});

function initScrollToForms() {
    const connectButton = document.getElementById('connectButton');
    const formsSection = document.getElementById('forms');
    
    if (connectButton && formsSection) {
        connectButton.addEventListener('click', function(e) {
            setTimeout(() => {
                formsSection.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
            }, 400);
        });
    }
}

document.addEventListener('DOMContentLoaded', function() {
    new FloatingCircles('floatingCircles');
    new EnergyBurst('connectButton');
    initScrollToForms(); 
});