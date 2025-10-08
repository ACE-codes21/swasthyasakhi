// ==========================================
// REBUILT SCROLL STACK SYSTEM - PROFESSIONAL & RELIABLE
// ==========================================

function initScrollStack() {
    const stackCards = document.querySelectorAll('.stack-card');
    
    if (stackCards.length === 0) {
        setTimeout(initScrollStack, 500);
        return;
    }

    console.log(`✅ Scroll Stack initialized with ${stackCards.length} cards`);

    const STICKY_TOP = 140; // Must match CSS top value
    const ACTIVATION_OFFSET = 150; // How far below sticky point to activate
    let lastActiveIndex = -1;
    let debugCount = 0;
    
    function updateCards() {
        let activeIndex = -1;
        let closestCard = -1;
        let closestDistance = Infinity;
        
        // Debug every 60 frames (about once per second at 60fps)
        const shouldDebug = debugCount % 60 === 0;
        if (shouldDebug) console.log('📊 === Scroll Stack Debug ===');
        
        // First pass - find which card should be active
        stackCards.forEach((card, index) => {
            const rect = card.getBoundingClientRect();
            const cardTop = rect.top;
            const distanceFromSticky = Math.abs(cardTop - STICKY_TOP);
            
            if (shouldDebug) {
                console.log(`Card ${index + 1}: top=${Math.round(cardTop)}px, distance=${Math.round(distanceFromSticky)}px`);
            }
            
            // Find the card closest to the sticky point
            if (distanceFromSticky < closestDistance && cardTop <= STICKY_TOP + ACTIVATION_OFFSET) {
                closestDistance = distanceFromSticky;
                closestCard = index;
            }
            
            // Card is active when it's at or near the sticky point
            // Special handling for last card (card 6) - more generous activation
            const isLastCard = index === stackCards.length - 1;
            const activationRange = isLastCard ? STICKY_TOP + ACTIVATION_OFFSET + 100 : STICKY_TOP + ACTIVATION_OFFSET;
            
            if (cardTop <= activationRange && cardTop >= STICKY_TOP - 50) {
                activeIndex = index;
            }
        });
        
        // If no card is in the exact zone, use the closest one
        if (activeIndex === -1 && closestCard !== -1) {
            activeIndex = closestCard;
        }
        
        if (shouldDebug && activeIndex !== -1) {
            console.log(`✅ Active: Card ${activeIndex + 1}, Closest: Card ${closestCard + 1}`);
        }
        
        // Log when active card changes
        if (activeIndex !== lastActiveIndex && activeIndex !== -1) {
            console.log(`🎯 Card ${activeIndex + 1} activated`);
            lastActiveIndex = activeIndex;
        }
        
        // Second pass - apply states based on active card
        stackCards.forEach((card, index) => {
            // Clear all states
            card.classList.remove('active', 'stacked', 'upcoming');
            
            if (index === activeIndex) {
                // This is the active card
                card.classList.add('active');
            } else if (index < activeIndex) {
                // Cards that already passed (above active)
                card.classList.add('stacked');
            } else {
                // Cards coming up (below active)
                card.classList.add('upcoming');
            }
        });
        
        debugCount++;
    }

    // Throttled scroll with requestAnimationFrame
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                updateCards();
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });

    // Handle window resize
    window.addEventListener('resize', () => {
        requestAnimationFrame(updateCards);
    }, { passive: true });

    // Initial call
    requestAnimationFrame(updateCards);
    setTimeout(updateCards, 100);
    setTimeout(updateCards, 300);
    setTimeout(updateCards, 600);
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initScrollStack);
} else {
    initScrollStack();
}

window.addEventListener('load', () => {
    setTimeout(initScrollStack, 200);
    setTimeout(() => {
        const cards = document.querySelectorAll('.stack-card');
        if (cards.length > 0) {
            console.log('🔄 Force refresh after load');
            initScrollStack();
        }
    }, 500);
});

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

// Innovation cards mouse tracking effect
const innovationCards = document.querySelectorAll('.innovation-card');

innovationCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        
        card.style.setProperty('--mouse-x', `${x}%`);
        card.style.setProperty('--mouse-y', `${y}%`);
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.setProperty('--mouse-x', '50%');
        card.style.setProperty('--mouse-y', '50%');
    });
});

// Scroll animations - Intersection Observer for fade-in effects
const fadeObserverOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, fadeObserverOptions);

// Observe all animated elements
document.querySelectorAll('.problem-card, .solution-highlights li, .timeline-item, .cta-content').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(40px)';
    el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    fadeObserver.observe(el);
});

// Add parallax effect to hero background
const heroParallaxHandler = () => {
    const scrolled = window.pageYOffset;
    const heroBackground = document.querySelector('.hero-background');
    if (heroBackground && scrolled < window.innerHeight) {
        heroBackground.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
};

window.addEventListener('scroll', heroParallaxHandler, { passive: true });

// Smooth scroll for navigation links
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

// Add cursor glow effect
const cursor = document.createElement('div');
cursor.className = 'cursor-glow';
cursor.style.cssText = `
    position: fixed;
    width: 300px;
    height: 300px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(239, 68, 68, 0.15) 0%, transparent 70%);
    pointer-events: none;
    transform: translate(-50%, -50%);
    z-index: 9999;
    mix-blend-mode: screen;
    transition: opacity 0.3s ease;
`;
document.body.appendChild(cursor);

document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
});

// ==========================================
// ENHANCED AUTO-PLAYING CHAT DEMO
// ==========================================

function initChatDemo() {
    const chatContainer = document.getElementById('solutionChatMessages');
    if (!chatContainer) return;

    const conversation = [
        {
            type: 'bot',
            text: 'Hello! I\'m Swasthya Sakhi 👋',
            delay: 500
        },
        {
            type: 'bot',
            text: 'I can help you in 12+ languages. How are you feeling today?',
            delay: 1200
        },
        {
            type: 'user',
            text: 'मुझे बुखार है (I have fever)',
            delay: 2000
        },
        {
            type: 'bot',
            typing: true,
            delay: 2500
        },
        {
            type: 'bot',
            html: `
                <p>I understand you have a fever 🌡️</p>
                <div class="info-card">
                    <div class="info-icon">📊</div>
                    <div class="info-text">
                        <strong>Area Status:</strong> No active outbreaks in your region
                    </div>
                </div>
                <p><strong>💊 Recommendations:</strong></p>
                <ul class="bot-list">
                    <li>Rest and stay hydrated</li>
                    <li>Monitor temperature every 4 hours</li>
                    <li>Take paracetamol if needed</li>
                </ul>
            `,
            delay: 3500
        },
        {
            type: 'user',
            text: 'Should I get tested?',
            delay: 5500
        },
        {
            type: 'bot',
            html: `
                <p>Based on your symptoms, testing is recommended if:</p>
                <ul class="bot-list">
                    <li>✅ Fever >101°F for 3+ days</li>
                    <li>✅ Recent travel history</li>
                    <li>✅ Contact with infected persons</li>
                </ul>
                <div class="action-buttons">
                    <button class="chat-quick-btn">📍 Find Nearby Clinics</button>
                    <button class="chat-quick-btn">📅 Book Appointment</button>
                </div>
            `,
            delay: 6500
        }
    ];

    let currentIndex = 0;
    let messageElements = [];

    function addChatMessage(msg) {
        const messageDiv = document.createElement('div');
        
        if (msg.type === 'bot') {
            messageDiv.className = 'message bot';
            messageDiv.innerHTML = `
                <div class="message-avatar">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    </svg>
                </div>
                <div class="message-content">
                    ${msg.typing ? '<div class="typing-indicator"><span></span><span></span><span></span></div>' : 
                    (msg.html || `<p>${msg.text}</p>`)}
                </div>
            `;
        } else {
            messageDiv.className = 'message user';
            messageDiv.innerHTML = `
                <div class="message-content">
                    <p>${msg.text}</p>
                </div>
            `;
        }

        chatContainer.appendChild(messageDiv);
        messageElements.push(messageDiv);
        
        // Smooth scroll to bottom
        setTimeout(() => {
            chatContainer.scrollTop = chatContainer.scrollHeight;
        }, 100);

        return messageDiv;
    }

    function playConversation() {
        if (currentIndex >= conversation.length) {
            // Restart after a pause
            setTimeout(() => {
                // Clear all messages
                messageElements.forEach(el => el.remove());
                messageElements = [];
                currentIndex = 0;
                playConversation();
            }, 5000);
            return;
        }

        const msg = conversation[currentIndex];
        
        setTimeout(() => {
            const messageEl = addChatMessage(msg);
            
            // Remove typing indicator and show actual message
            if (msg.typing && currentIndex + 1 < conversation.length) {
                setTimeout(() => {
                    messageEl.remove();
                    messageElements.pop();
                }, 1000);
            }
            
            currentIndex++;
            playConversation();
        }, msg.delay);
    }

    // Start the conversation
    playConversation();

    // Add hover effect to pause
    let isPaused = false;
    chatContainer.addEventListener('mouseenter', () => {
        isPaused = true;
    });
    chatContainer.addEventListener('mouseleave', () => {
        isPaused = false;
    });
}

// Initialize chat demo when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initChatDemo);
} else {
    initChatDemo();
}

console.log('🏥 Swasthya Sakhi - AI Powered Health Assistant Loaded Successfully!');
console.log('🚀 Built for Smart India Hackathon 2025 by Team UNBOUND');
