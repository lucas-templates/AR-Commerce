// AR Commerce - WebAR Functionality

// Initialize AR when page loads
document.addEventListener('DOMContentLoaded', function() {
    initializeAR();
    setupEventListeners();
    animateOnScroll();
});

// Event Listeners
function setupEventListeners() {
    const startARBtn = document.getElementById('startARBtn');
    const closeARBtn = document.getElementById('closeARBtn');
    const arViewer = document.getElementById('arViewer');
    const arButtons = document.querySelectorAll('.btn-ar-small');
    
    if (startARBtn) {
        startARBtn.addEventListener('click', startARExperience);
    }
    
    if (closeARBtn) {
        closeARBtn.addEventListener('click', closeARExperience);
    }
    
    // Product AR buttons
    arButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            startARExperience();
        });
    });
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// AR Initialization
let arStream = null;
let arCanvas = null;
let arContext = null;
let animationFrame = null;

function initializeAR() {
    arCanvas = document.getElementById('arCanvas');
    if (arCanvas) {
        arContext = arCanvas.getContext('2d');
    }
}

// Start AR Experience
async function startARExperience() {
    const arViewer = document.getElementById('arViewer');
    const arVideo = document.getElementById('arVideo');
    
    try {
        // Request camera access
        const stream = await navigator.mediaDevices.getUserMedia({
            video: {
                facingMode: 'environment', // Use back camera if available
                width: { ideal: 1280 },
                height: { ideal: 720 }
            }
        });
        
        arStream = stream;
        
        if (arVideo) {
            arVideo.srcObject = stream;
            arVideo.style.display = 'block';
            
            arVideo.onloadedmetadata = () => {
                if (arCanvas && arContext) {
                    arCanvas.width = arVideo.videoWidth;
                    arCanvas.height = arVideo.videoHeight;
                }
                startARAnimation();
            };
        }
        
        if (arViewer) {
            arViewer.classList.add('active');
            // Scroll to AR viewer
            arViewer.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        
        // Hide product card in hero
        const productCard = document.getElementById('productCard');
        if (productCard) {
            productCard.style.opacity = '0';
        }
        
    } catch (error) {
        console.error('Error accessing camera:', error);
        alert('Unable to access camera. Please ensure you have granted camera permissions and are using a device with a camera.');
    }
}

// AR Animation Loop
function startARAnimation() {
    const arVideo = document.getElementById('arVideo');
    const arCanvas = document.getElementById('arCanvas');
    const arContext = arCanvas.getContext('2d');
    
    function draw() {
        if (arVideo && arVideo.readyState === arVideo.HAVE_ENOUGH_DATA) {
            // Draw video frame to canvas
            arContext.drawImage(arVideo, 0, 0, arCanvas.width, arCanvas.height);
            
            // Add AR overlay effects
            drawAROverlay(arContext, arCanvas);
        }
        
        animationFrame = requestAnimationFrame(draw);
    }
    
    draw();
}

// Draw AR Overlay (simulated AR effects)
function drawAROverlay(ctx, canvas) {
    const time = Date.now() * 0.001;
    
    // Draw grid overlay
    ctx.strokeStyle = 'rgba(0, 245, 255, 0.3)';
    ctx.lineWidth = 1;
    
    const gridSize = 50;
    for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
    }
    
    for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }
    
    // Draw center target
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 30 + Math.sin(time * 2) * 10;
    
    ctx.strokeStyle = 'rgba(0, 245, 255, 0.8)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.stroke();
    
    // Draw corner markers (simulating AR tracking)
    const cornerSize = 20;
    ctx.strokeStyle = 'rgba(255, 107, 107, 0.8)';
    ctx.lineWidth = 3;
    
    // Top-left corner
    drawCornerMarker(ctx, cornerSize, cornerSize, cornerSize);
    // Top-right corner
    drawCornerMarker(ctx, canvas.width - cornerSize, cornerSize, cornerSize);
    // Bottom-left corner
    drawCornerMarker(ctx, cornerSize, canvas.height - cornerSize, cornerSize);
    // Bottom-right corner
    drawCornerMarker(ctx, canvas.width - cornerSize, canvas.height - cornerSize, cornerSize);
    
    // Draw floating product preview (simulated)
    const productX = centerX;
    const productY = centerY - 100;
    const productSize = 80;
    
    ctx.fillStyle = 'rgba(0, 245, 255, 0.2)';
    ctx.fillRect(productX - productSize/2, productY - productSize/2, productSize, productSize);
    
    ctx.strokeStyle = 'rgba(0, 245, 255, 0.8)';
    ctx.lineWidth = 2;
    ctx.strokeRect(productX - productSize/2, productY - productSize/2, productSize, productSize);
    
    // Add glow effect
    ctx.shadowBlur = 20;
    ctx.shadowColor = 'rgba(0, 245, 255, 0.8)';
    ctx.strokeRect(productX - productSize/2, productY - productSize/2, productSize, productSize);
    ctx.shadowBlur = 0;
}

// Draw corner marker
function drawCornerMarker(ctx, x, y, size) {
    ctx.beginPath();
    // Top-left corner
    if (x < ctx.canvas.width / 2 && y < ctx.canvas.height / 2) {
        ctx.moveTo(x, y + size);
        ctx.lineTo(x, y);
        ctx.lineTo(x + size, y);
    }
    // Top-right corner
    else if (x > ctx.canvas.width / 2 && y < ctx.canvas.height / 2) {
        ctx.moveTo(x - size, y);
        ctx.lineTo(x, y);
        ctx.lineTo(x, y + size);
    }
    // Bottom-left corner
    else if (x < ctx.canvas.width / 2 && y > ctx.canvas.height / 2) {
        ctx.moveTo(x, y - size);
        ctx.lineTo(x, y);
        ctx.lineTo(x + size, y);
    }
    // Bottom-right corner
    else {
        ctx.moveTo(x - size, y);
        ctx.lineTo(x, y);
        ctx.lineTo(x, y - size);
    }
    ctx.stroke();
}

// Close AR Experience
function closeARExperience() {
    const arViewer = document.getElementById('arViewer');
    const arVideo = document.getElementById('arVideo');
    
    // Stop camera stream
    if (arStream) {
        arStream.getTracks().forEach(track => track.stop());
        arStream = null;
    }
    
    // Stop animation
    if (animationFrame) {
        cancelAnimationFrame(animationFrame);
        animationFrame = null;
    }
    
    // Clear canvas
    if (arCanvas && arContext) {
        arContext.clearRect(0, 0, arCanvas.width, arCanvas.height);
    }
    
    // Hide AR viewer
    if (arViewer) {
        arViewer.classList.remove('active');
    }
    
    if (arVideo) {
        arVideo.srcObject = null;
        arVideo.style.display = 'none';
    }
    
    // Show product card again
    const productCard = document.getElementById('productCard');
    if (productCard) {
        productCard.style.opacity = '1';
    }
}

// Animate elements on scroll
function animateOnScroll() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe product items and step cards
    document.querySelectorAll('.product-item, .step-card').forEach(el => {
        observer.observe(el);
    });
}

// Add parallax effect to hero
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    const particles = document.querySelector('.hero-particles');
    
    if (hero && scrolled < hero.offsetHeight) {
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
        if (particles) {
            particles.style.transform = `translateY(${scrolled * 0.3}px)`;
        }
    }
});

// Add interactive hover effects to product items
document.querySelectorAll('.product-item').forEach(item => {
    item.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    item.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

