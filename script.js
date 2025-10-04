// Phone Chatbot Functionality
const phoneChatMessages = document.getElementById('phoneChatMessages');
const phoneInput = document.getElementById('phoneInput');
const phoneSendBtn = document.getElementById('phoneSendBtn');
const quickReplies = document.querySelectorAll('.quick-reply');

// Predefined responses
const botResponses = {
    'fever': 'I understand you have a fever. 🌡️ Here are some recommendations:\n\n1. Rest and stay hydrated\n2. Monitor your temperature\n3. If fever persists >3 days, consult a doctor\n\nShall I check for disease outbreaks in your area?',
    'बुखार': 'मुझे समझ आ गया कि आपको बुखार है। 🌡️ यहाँ कुछ सुझाव हैं:\n\n1. आराम करें और पानी पिएं\n2. अपना तापमान जांचें\n3. यदि बुखार 3 दिन से अधिक रहे, तो डॉक्टर से मिलें',
    'vaccination': '💉 Vaccination Information:\n\n• COVID-19 booster doses available\n• Annual flu shots recommended\n• HPV vaccines for teens\n\nWould you like to book an appointment?',
    'health tips': '💪 Daily Health Tips:\n\n• Drink 8 glasses of water\n• 30 min exercise daily\n• 7-8 hours sleep\n• Balanced diet with fruits & veggies\n\nStay healthy! 🌟',
    'default': 'Thank you for your message! 😊 I\'m here to help with:\n\n• Health information\n• Symptom checking\n• Vaccination schedules\n• Medical advice\n\nWhat would you like to know?'
};

function addMessage(text, isUser = false) {
    const messageWrapper = document.createElement('div');
    messageWrapper.className = `message-wrapper ${isUser ? 'user-wrapper' : 'bot-wrapper'}`;
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `message-phone ${isUser ? 'user-message' : 'bot-message'}`;
    
    const p = document.createElement('p');
    p.textContent = text;
    p.style.whiteSpace = 'pre-line';
    
    messageDiv.appendChild(p);
    messageWrapper.appendChild(messageDiv);
    
    // Remove quick replies if they exist
    const existingQuickReplies = phoneChatMessages.querySelector('.quick-replies');
    if (existingQuickReplies) {
        existingQuickReplies.remove();
    }
    
    phoneChatMessages.appendChild(messageWrapper);
    phoneChatMessages.scrollTop = phoneChatMessages.scrollHeight;
}

function getBotResponse(userMessage) {
    const message = userMessage.toLowerCase();
    
    if (message.includes('fever') || message.includes('बुखार')) {
        return botResponses['fever'];
    } else if (message.includes('vaccin')) {
        return botResponses['vaccination'];
    } else if (message.includes('health') || message.includes('tips')) {
        return botResponses['health tips'];
    } else {
        return botResponses['default'];
    }
}

function sendPhoneMessage() {
    const message = phoneInput.value.trim();
    if (message) {
        // Add user message
        addMessage(message, true);
        phoneInput.value = '';
        
        // Show typing indicator
        setTimeout(() => {
            const response = getBotResponse(message);
            addMessage(response, false);
        }, 1000);
    }
}

if (phoneSendBtn) {
    phoneSendBtn.addEventListener('click', sendPhoneMessage);
}

if (phoneInput) {
    phoneInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendPhoneMessage();
        }
    });
}

// Quick reply buttons
quickReplies.forEach(button => {
    button.addEventListener('click', () => {
        const message = button.getAttribute('data-message');
        phoneInput.value = message;
        sendPhoneMessage();
    });
});

// Mobile Menu Toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');
    });
}

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            // Close mobile menu if open
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                hamburger.classList.remove('active');
            }
        }
    });
});

// Navbar Scroll Effect
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
    }
    
    lastScroll = currentScroll;
});

// Intersection Observer for Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all cards and sections
document.querySelectorAll('.feature-card, .problem-card, .innovation-card, .timeline-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.6s ease';
    observer.observe(el);
});

// Chat Demo Simulation
const chatMessages = document.querySelector('.chat-messages');
const chatInput = document.querySelector('.chat-input input');
const chatButton = document.querySelector('.chat-input button');

if (chatButton) {
    chatButton.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
}

function sendMessage() {
    const message = chatInput.value.trim();
    if (message) {
        // Add user message
        const userMsg = document.createElement('div');
        userMsg.className = 'message user';
        userMsg.innerHTML = `<p>${message}</p>`;
        chatMessages.appendChild(userMsg);
        
        // Clear input
        chatInput.value = '';
        
        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        // Simulate bot response
        setTimeout(() => {
            const botMsg = document.createElement('div');
            botMsg.className = 'message bot';
            botMsg.innerHTML = `<p>Thank you for your message! Swasthya Sakhi is analyzing your query...</p>`;
            chatMessages.appendChild(botMsg);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }, 1000);
    }
}

// Stats Counter Animation
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target + '%';
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start) + '%';
        }
    }, 16);
}

// Animate stats when in view
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumber = entry.target;
            const targetValue = parseInt(statNumber.textContent);
            if (!statNumber.classList.contains('animated')) {
                animateCounter(statNumber, targetValue);
                statNumber.classList.add('animated');
            }
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-number').forEach(stat => {
    statsObserver.observe(stat);
});

// Parallax Effect for Hero
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroLeft = document.querySelector('.hero-left');
    const heroRight = document.querySelector('.hero-right');
    
    if (heroLeft && scrolled < window.innerHeight) {
        heroLeft.style.transform = `translateY(${scrolled * 0.3}px)`;
        heroLeft.style.opacity = 1 - (scrolled / 800);
    }
    
    if (heroRight && scrolled < window.innerHeight) {
        heroRight.style.transform = `translateY(${scrolled * 0.2}px)`;
        heroRight.style.opacity = 1 - (scrolled / 900);
    }
});

// Add active state to navigation based on scroll position
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });

    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href') === `#${current}`) {
            item.classList.add('active');
        }
    });
});

console.log('🏥 Swasthya Sakhi - AI Powered Health Assistant Loaded Successfully!');
console.log('🚀 Built for Smart India Hackathon 2025 by Team UNBOUND');
