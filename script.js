// Navegación móvil
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link, .nav-cta');

// Toggle del menú móvil
navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
    
    // Actualizar aria-expanded
    const isExpanded = navMenu.classList.contains('active');
    navToggle.setAttribute('aria-expanded', isExpanded);
});

// Cerrar menú al hacer clic en un enlace
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
    });
});

// Cerrar menú al hacer clic fuera
document.addEventListener('click', (e) => {
    if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
    }
});

// Navbar scroll effect
const navbar = document.getElementById('navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});

// Smooth scroll para navegación
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            const offsetTop = target.offsetTop - 70; // Ajuste por altura del navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Animación de entrada para elementos
const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -80px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
        }
    });
}, observerOptions);

// Observar elementos para animación
document.querySelectorAll('.service-card, .project-card, .skill-category, .stat-card, .timeline-item, .testimonial-card').forEach(el => {
    el.classList.add('scroll-reveal');
    observer.observe(el);
});

// Animación de contador para estadísticas
const animateCounter = (element) => {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;

    const updateCounter = () => {
        current += increment;
        if (current < target) {
            element.textContent = Math.floor(current) + '+';
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target + '+';
        }
    };

    updateCounter();
};

// Observer para estadísticas
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumber = entry.target.querySelector('.stat-number');
            if (statNumber && !statNumber.classList.contains('animated')) {
                statNumber.classList.add('animated');
                animateCounter(statNumber);
            }
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

// Observar tarjetas de estadísticas
document.querySelectorAll('.stat-card').forEach(card => {
    statsObserver.observe(card);
});

// Animación de entrada escalonada para skill items
const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const items = entry.target.querySelectorAll('.skill-item');
            items.forEach((item, index) => {
                setTimeout(() => {
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(20px)';
                    item.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                    
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                    }, 50);
                }, index * 80);
            });
            skillObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.3 });

document.querySelectorAll('.skill-category').forEach(category => {
    skillObserver.observe(category);
});

// Manejo del formulario de contacto
const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Obtener valores del formulario
    const nombre = document.getElementById('nombre').value;
    const email = document.getElementById('email').value;
    const mensaje = document.getElementById('mensaje').value;
    
    // Validación básica
    if (!nombre || !email || !mensaje) {
        alert('Por favor, completa todos los campos.');
        return;
    }
    
    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Por favor, ingresa un correo electrónico válido.');
        return;
    }
    
    // Crear el enlace mailto
    const subject = encodeURIComponent(`Contacto desde el portafolio - ${nombre}`);
    const body = encodeURIComponent(
        `Nombre: ${nombre}\nCorreo: ${email}\n\nMensaje:\n${mensaje}`
    );
    
    // Abrir cliente de correo
    window.location.href = `mailto:tu-correo@ejemplo.com?subject=${subject}&body=${body}`;
    
    // Opcional: Limpiar formulario
    contactForm.reset();
    
    // Mostrar mensaje de confirmación
    alert('¡Gracias por tu mensaje! Se abrirá tu cliente de correo.');
});

// Prevenir envío del formulario con Enter en inputs
document.querySelectorAll('.form-input').forEach(input => {
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
        }
    });
});

// Mejorar accesibilidad del teclado
document.addEventListener('keydown', (e) => {
    // Cerrar menú móvil con Escape
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.focus();
    }
});

// Detectar si el usuario prefiere movimiento reducido
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (prefersReducedMotion) {
    // Deshabilitar animaciones si el usuario lo prefiere
    document.documentElement.style.setProperty('--transition-base', 'none');
}
