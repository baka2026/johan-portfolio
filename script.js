// Mobile menu toggle
const mobileMenuButton = document.getElementById('mobile-menu-button');
const navLinks = document.querySelector('.nav-links');

mobileMenuButton.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// Smooth scrolling for navigation links
const navLinksAll = document.querySelectorAll('nav a');

navLinksAll.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);

        if (targetSection) {
            window.scrollTo({
                top: targetSection.offsetTop - 80,
                behavior: 'smooth'
            });
        }

        // Close mobile menu if open
        if (navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
        }
    });
});

// Scroll animations
const sections = document.querySelectorAll('section');

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
        }
    });
}, { threshold: 0.1 });

sections.forEach(section => {
    observer.observe(section);
});

// J.A.R.V.I.S. Assistant
const jarvisButton = document.getElementById('jarvis-button');
const jarvisChat = document.getElementById('jarvis-chat');
const closeChat = document.getElementById('close-chat');
const chatMessages = document.getElementById('chat-messages');
const chatInput = document.getElementById('chat-input-field');
const sendButton = document.getElementById('send-button');

// Toggle chat visibility
jarvisButton.addEventListener('click', () => {
    jarvisChat.style.display = jarvisChat.style.display === 'flex' ? 'none' : 'flex';
});

closeChat.addEventListener('click', () => {
    jarvisChat.style.display = 'none';
});

// Sample chat responses
const chatResponses = {
    "who is johan": "Johan Arpin is an independent developer and technology enthusiast based in Auckland, New Zealand.",
    "tell me about his projects": "Johan has worked on various projects including GUI Builder, Browser Automation, Cybersecurity Lab, Web Development, AI & Automation, and Creative Coding.",
    "what technologies does he use": "Johan works with HTML5, CSS3, JavaScript, Python, Linux, Kali Linux, Git, GitHub, Tampermonkey, Three.js, APIs, and more.",
    "what is his interest in cybersecurity": "Johan's interest in cybersecurity includes ethical hacking, defensive security, and understanding vulnerabilities.",
    "what is gui builder": "GUI Builder is a concept for a visual interface builder that allows users to create custom GUI components for browser userscripts.",
    "how can i contact him": "You can contact Johan through his GitHub profile or website."
};

// Handle sending messages
async function sendMessage() {
    const message = chatInput.value.trim();
    if (!message) return;

    // Add user message
    addMessageToChat('user', message);
    chatInput.value = '';

    // Show typing indicator
    addTypingIndicator();

    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message })
        });
        const data = await response.json();
        removeTypingIndicator();
        if (response.ok && data.reply) {
            addMessageToChat('jarvis', data.reply);
        } else {
            // Fallback to static responses if API not configured
            const fallback = getChatResponse(message);
            addMessageToChat('jarvis', fallback);
        }
    } catch (err) {
        removeTypingIndicator();
        const fallback = getChatResponse(message);
        addMessageToChat('jarvis', fallback);
    }
}

// Add typing indicator
function addTypingIndicator() {
    const typingIndicator = document.createElement('div');
    typingIndicator.className = 'typing-indicator';
    typingIndicator.innerHTML = '<span></span><span></span><span></span>';
    chatMessages.appendChild(typingIndicator);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Remove typing indicator
function removeTypingIndicator() {
    const typingIndicator = document.querySelector('.typing-indicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

// Add message to chat
function addMessageToChat(sender, message) {
    const messageElement = document.createElement('div');
    messageElement.className = `message ${sender}`;
    messageElement.textContent = message;
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Get static fallback response
function getChatResponse(message) {
    const lowerMessage = message.toLowerCase();
    for (const key in chatResponses) {
        if (lowerMessage.includes(key)) {
            return chatResponses[key];
        }
    }
    return "I'm sorry, I don't have information about that. You can ask me about Johan's projects, skills, or how to contact him.";
}

// Event listeners for chat
sendButton.addEventListener('click', sendMessage);

chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});
// Load projects from central JSON data file
async function loadProjects() {
    try {
        const response = await fetch('/assets/data/projects.json');
        if (!response.ok) throw new Error('Failed to load projects');
        const projects = await response.json();
        renderProjects(projects);
    } catch (err) {
        console.error('Error loading projects:', err);
    }
}

// Function to render projects
function renderProjects(projects) {
    const projectsContainer = document.getElementById('projects-container');
    projectsContainer.innerHTML = '';

    projects.forEach(project => {
        const projectCard = document.createElement('div');
        projectCard.className = 'project-card';

        projectCard.innerHTML = `
            <img src="${project.image}" alt="${project.title}" class="project-image" loading="lazy">
            <div class="project-info">
                <h3>${project.title}</h3>
                <p>${project.description}</p>
                <div class="project-tags">
                    ${project.tags.map(tag => `<span class="project-tag">${tag}</span>`).join('')}
                </div>
                <a href="${project.link}" class="button secondary">View Project</a>
            </div>
        `;
        projectsContainer.appendChild(projectCard);
    });
}

// Render projects on page load
window.addEventListener('DOMContentLoaded', loadProjects);

// Add suggested questions to chat
function addSuggestedQuestions() {
    const suggestedQuestions = [
        "Who is Johan?",
        "Tell me about his projects",
        "What technologies does he use?",
        "What is his interest in cybersecurity?",
        "What is GUI Builder?",
        "How can I contact him?"
    ];

    const questionsContainer = document.createElement('div');
    questionsContainer.className = 'suggested-questions';

    suggestedQuestions.forEach(question => {
        const questionButton = document.createElement('button');
        questionButton.className = 'suggested-question';
        questionButton.textContent = question;
        questionButton.addEventListener('click', () => {
            chatInput.value = question;
            sendMessage();
        });
        questionsContainer.appendChild(questionButton);
    });

    chatMessages.appendChild(questionsContainer);
}

// Add suggested questions when chat opens
jarvisButton.addEventListener('click', () => {
    if (jarvisChat.style.display === 'flex' && !document.querySelector('.suggested-questions')) {
        addSuggestedQuestions();
    }
});

// Add initial welcome message
function addWelcomeMessage() {
    addMessageToChat('jarvis', "Hello! I'm J.A.R.V.I.S., Johan's AI assistant. How can I help you today?");
}

// Add welcome message when chat opens
jarvisButton.addEventListener('click', () => {
    if (jarvisChat.style.display === 'flex' && !document.querySelector('.welcome-message')) {
        addWelcomeMessage();
        const welcomeMessage = document.querySelector('.message.jarvis');
        if (welcomeMessage) {
            welcomeMessage.classList.add('welcome-message');
        }
    }
});
