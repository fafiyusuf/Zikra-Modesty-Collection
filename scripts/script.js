         // Constants and Configuration
const ANIMATION_DURATION = 300; // ms
const NOTIFICATION_DURATION = 5000; // ms
const LOADING_DURATION = 2000; // ms for loading screen
const BUSINESS_EMAIL = 'zikrajemal822@gmail.com';
const FORM_TYPES = {
    HALAQA: 'Halaqa Circle',
    EVENT: 'Event Registration',
    CHARITY: 'Charity Support',
    CONTACT: 'Contact Form'
};

// Wait for page load
document.addEventListener('DOMContentLoaded', () => {
    try {
        // Initialize core functionality
        initializeCollections();
        initializeUI();
        initializeButtonHandlers();
        
        // Initialize loading screen
        const loadingScreen = document.querySelector('.loading-screen');
        if (loadingScreen) {
            // Prevent scrolling while loading
            document.body.style.overflow = 'hidden';
            
            // Show loading screen with animation
            setTimeout(() => {
                loadingScreen.style.opacity = '0';
                // Re-enable scrolling
                document.body.style.overflow = '';
                
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                }, ANIMATION_DURATION);
            }, LOADING_DURATION);
        }
    } catch (error) {
        console.error('Error during initialization:', error);
        showNotification('An error occurred while loading the page. Please refresh.', 'error');
    }
});

// Collection Functions
function initializeCollections() {
    const collectionsGrid = document.querySelector('.collections-grid');
    if (!collectionsGrid) {
        console.error('Collections grid not found');
        return;
    }

    const collections = getLocalCollections();
    renderCollections(collections);
}

function getLocalCollections() {
    const localImages = [
        { 
            name: 'Pashmina Dreams',
            images: ['abaya3.jpg', 'abaya4.jpg'],
            description: 'Where comfort meets style. Crafted from the finest pashmina fabric, this collection brings a touch of luxury to your everyday moments.',
            featured: true
        },
        { 
            name: 'Old Money Collection',
            images: ['abaya5.jpg', 'abaya6.jpg'],
            description: 'Timeless elegance meets modern sophistication. Our Old Money Collection embodies grace with its premium fabrics and exquisite detailing.',
            featured: true,
            
        },
        { 
            name: 'Bestie Collection',
            images: ['bestie-abaya1.jpg', 'bestie-abaya2.jpg', 'bestie-abaya3.jpg', 'bestie-abaya4.jpg'],
            description: 'Our signature collection celebrating the beauty of sisterhood. Perfect for those special moments shared with your best friends.',
            featured: true
        }
    ];

    return localImages.map(item => ({
        name: item.name,
        imageUrl: `images/${item.images[0]}`,
        modalImages: item.images.slice(1).map(img => `images/${img}`),
        description: item.description,
        featured: item.featured
    }));
}

function renderCollections(collections) {
    const grid = document.querySelector('.collections-grid');
    if (!grid) return;

    grid.innerHTML = `
        ${collections.map(collection => `
            <div class="collection-card" onclick="showCollectionDetails(${JSON.stringify(collection).replace(/"/g, '&quot;')})">
                <div class="collection-preview">
                    <img src="${collection.imageUrl}" 
                         alt="${collection.name}" 
                         loading="lazy"
                         onerror="this.onerror=null; this.src='images/placeholder.jpg';">
                    <div class="collection-overlay">
                        <h3>${collection.name}</h3>
                        <p class="collection-teaser">${collection.description}</p>
                        <button class="view-details">Explore Collection</button>
                    </div>
                </div>
            </div>
        `).join('')}
    `;

    // Add the "Coming Soon" card
    grid.insertAdjacentHTML('beforeend', `
        <div class="collection-card coming-soon">
            <div class="collection-preview">
                <div class="coming-soon-content">
                    <h3>More Collections Coming Soon</h3>
                    <p>Stay tuned for our upcoming releases</p>
                    <div class="social-preview">
                        <p>Follow us on Instagram for exclusive previews</p>
                        <a href="https://www.instagram.com/zikra_modesty" target="_blank" class="instagram-link">
                            <i class="fab fa-instagram"></i>
                            @zikra_modesty
                        </a>
                    </div>
                </div>
            </div>
        </div>
    `);
}

function showCollectionDetails(collection) {
    showModal({
        title: collection.name,
        content: `
            <div class="collection-info">
                <p class="collection-description">${collection.description}</p>
                <div class="collection-highlights">
                    <ul>
                        <li><i class="fas fa-star"></i> Premium Quality Fabrics</li>
                        <li><i class="fas fa-ruler"></i> Custom Sizing Available</li>
                        <li><i class="fas fa-globe"></i> International Shipping</li>
                        <li><i class="fas fa-gift"></i> Elegant Gift Packaging</li>
                    </ul>
                </div>
            </div>
            <div class="modal-grid">
                <div class="modal-item main-image">
                    <img src="${collection.imageUrl}" 
                         alt="${collection.name}" 
                         loading="lazy"
                         onerror="this.onerror=null; this.src='images/placeholder.jpg';">
                </div>
                ${collection.modalImages?.map(imageUrl => `
                    <div class="modal-item">
                        <img src="${imageUrl}" 
                             alt="${collection.name}" 
                             loading="lazy"
                             onerror="this.onerror=null; this.src='images/placeholder.jpg';">
                    </div>
                `).join('') || ''}
            </div>
            <div class="collection-actions">
                <a href="https://www.instagram.com/zikra_modesty" target="_blank" class="instagram-link">
                    <i class="fab fa-instagram"></i>
                    Follow us on Instagram for pricing and availability
                </a>
                <button class="contact-btn" onclick="scrollToContact('${encodeURIComponent(collection.name)}')">
                    <i class="fas fa-envelope"></i>
                    Contact Us
                </button>
            </div>
        `
    });
}

function scrollToContact(productName) {
    // Close the modal first
    closeModal();
    
    // Decode the product name
    const decodedName = decodeURIComponent(productName);
    
    // Get the contact section and form
    const contactSection = document.getElementById('contact');
    const messageInput = document.querySelector('#contactForm textarea[name="message"]');
    
    // Pre-fill the message with the product name
    if (messageInput) {
        messageInput.value = `Hi, I'm interested in ordering the ${decodedName}. Please provide more information about availability and pricing.`;
    }
    
    // Scroll to contact section
    contactSection.scrollIntoView({ behavior: 'smooth' });
    
    // Focus the name input if it exists
    const nameInput = document.querySelector('#contactForm input[name="name"]');
    if (nameInput) {
        setTimeout(() => {
            nameInput.focus();
        }, 1000); // Wait for scroll to complete
    }
}

// Form Handling
async function handleFormSubmission(event, formType) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    const submitButton = form.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.textContent;

    try {
        submitButton.disabled = true;
        submitButton.textContent = 'Submitting...';

        // Get form data
        const name = formData.get('name')?.trim();
        const email = formData.get('email')?.trim();
        const phone = formData.get('phone')?.trim();
        const message = formData.get('message')?.trim();
        const supportType = formData.get('supportType')?.trim();
        const timestamp = new Date().toISOString();
        const type = formType;

        // Validate required fields
        if (!name || !email || !phone) {
            throw new Error('Please fill in all required fields');
        }

        if (!isValidEmail(email)) {
            throw new Error('Please enter a valid email address');
        }

        if (!isValidPhone(phone)) {
            throw new Error('Please enter a valid phone number');
        }

        // Send notification email
        await sendNotificationEmail({
            type,
            name,
            email,
            phone,
            supportType,
            message
        });

        // Show success message
        showNotification('success', 'Thank you! Your submission has been received.');
        form.reset();

    } catch (error) {
        console.error('Form submission error:', error);
        showNotification('error', error.message || 'An error occurred. Please try again.');
    } finally {
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText;
    }
}

// Send notification email to business
async function sendNotificationEmail(data) {
    const subject = `New ${data.type} Submission from ${data.name}`;
    const body = `
        New ${data.type} Submission

        Name: ${data.name}
        Email: ${data.email}
        Phone: ${data.phone}
        ${data.supportType ? `Support Type: ${data.supportType}` : ''}
        ${data.message ? `Message: ${data.message}` : ''}
        
        Time: ${new Date().toLocaleString()}
    `;

    // Create mailto link with business email
    const mailtoLink = `mailto:${BUSINESS_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    // Open default email client
    window.location.href = mailtoLink;
}

// Show notification message
function showNotification(type, message) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            <p>${message}</p>
        </div>
        <button class="close-notification">×</button>
    `;

    document.body.appendChild(notification);

    // Add slide-in animation
    setTimeout(() => notification.classList.add('show'), 100);

    // Close button handler
    notification.querySelector('.close-notification').onclick = () => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    };

    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (document.body.contains(notification)) {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Validation helpers
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone) {
    // Allow Ethiopian phone numbers (starts with +251 or 0, followed by 9 digits)
    return /^(\+251|0)[0-9]{9}$/.test(phone.replace(/\s+/g, ''));
}

// Initialize all forms and buttons
function initializeCommunitySection() {
    // Halaqa Circle Registration
    document.getElementById('halaqaButton')?.addEventListener('click', () => {
        showModal({
            title: 'Join Our Halaqa Circle',
            content: `
                <form id="halaqaForm" onsubmit="handleFormSubmission(event, 'Halaqa Circle')">
                    <div class="form-group">
                        <input type="text" name="name" placeholder="Full Name" required>
                        <input type="email" name="email" placeholder="Email Address" required>
                        <input type="tel" name="phone" placeholder="Phone Number (e.g., +251912345678)" required>
                        <textarea name="message" placeholder="Any specific topics you'd like to discuss? (Optional)"></textarea>
                    </div>
                    <button type="submit" class="submit-btn">Register for Halaqa Circle</button>
                </form>
            `
        });
    });

    // Event Registration
    document.getElementById('eventsButton')?.addEventListener('click', () => {
        showModal({
            title: 'Upcoming Events Registration',
            content: `
                <div class="events-registration-form">
                    <div class="events-info">
                        <p>Stay updated with our latest events and pop-up shops! Visit our Instagram page to see all upcoming events:</p>
                        
                        <div class="instagram-link">
                            <a href="https://www.instagram.com/zikramodesty" target="_blank" class="social-link">
                                <i class="fab fa-instagram"></i> @zikramodesty
                            </a>
                            <p class="instagram-note">Check our Instagram for event details, dates, and locations</p>
                        </div>

                        <div class="registration-section">
                            <h4>Ready to Join an Event?</h4>
                            <p>Fill out the form below to register for our upcoming events. We'll send you confirmation details via email.</p>
                        </div>
                    </div>

                    <form id="eventsForm" onsubmit="handleFormSubmission(event, 'Event Registration')">
                        <div class="form-group">
                            <input type="text" name="name" placeholder="Full Name" required>
                            <input type="email" name="email" placeholder="Email Address" required>
                            <input type="tel" name="phone" placeholder="Phone Number (e.g., +251912345678)" required>
                            <textarea name="message" placeholder="Which event would you like to attend? Let us know any specific questions..."></textarea>
                        </div>
                        <button type="submit" class="submit-btn">Register for Events</button>
                    </form>
                </div>
            `
        });
    });

    // Charity Support
    document.getElementById('charityButton')?.addEventListener('click', () => {
        showModal({
            title: 'Support Afaf Charity Initiative',
            content: `
                <div class="charity-support-form">
                    <p>Join us in making a difference through our partnership with Afaf Charity. Your support helps empower women in our community.</p>
                    
                    <div class="donation-options">
                        <h4>Ways to Support:</h4>
                        <ul>
                            <li>Monthly Donation Program</li>
                            <li>One-time Contribution</li>
                            <li>Volunteer Opportunities</li>
                            <li>In-kind Donations</li>
                        </ul>
                    </div>

                    <form id="charityForm" onsubmit="handleFormSubmission(event, 'Charity Support')">
                        <input type="text" name="name" placeholder="Full Name" required>
                        <input type="email" name="email" placeholder="Email Address" required>
                        <input type="tel" name="phone" placeholder="Phone Number (e.g., +251912345678)" required>
                        
                        <select name="supportType" required>
                            <option value="">Select Support Type</option>
                            <option value="monthly">Monthly Donation</option>
                            <option value="one-time">One-time Donation</option>
                            <option value="volunteer">Volunteer</option>
                            <option value="in-kind">In-kind Donation</option>
                        </select>

                        <textarea name="message" placeholder="Tell us how you'd like to help..."></textarea>
                        <button type="submit" class="submit-btn">Submit Support Request</button>
                    </form>

                    <div class="charity-social-links">
                        <p>Follow Afaf Charity:</p>
                        <a href="https://www.instagram.com/afafcharity" target="_blank" class="social-link">
                            <i class="fab fa-instagram"></i> @afafcharity
                        </a>
                    </div>
                </div>
            `
        });
    });

    // Contact Form
    document.getElementById('contactForm')?.addEventListener('submit', (event) => {
        handleFormSubmission(event, 'Contact');
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeCollections();
    initializeCommunitySection();
});

// UI Functions
function initializeUI() {
    // Theme toggle
    initializeTheme();
    
    // Mobile menu
    initializeMobileMenu();
    
    // Scroll handlers
    initializeScrollHandlers();
    
    // Loading screen
    initializeLoadingScreen();
}

function initializeTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    const currentTheme = localStorage.getItem('theme') || (prefersDarkScheme.matches ? 'dark' : 'light');
    
    document.documentElement.setAttribute('data-theme', currentTheme);
    
    themeToggle?.addEventListener('click', () => {
        const newTheme = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });
}

function initializeMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    mobileMenuBtn?.addEventListener('click', () => {
        navLinks?.classList.toggle('active');
    });
    
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.nav-controls') && navLinks?.classList.contains('active')) {
            navLinks.classList.remove('active');
        }
    });
}

function initializeScrollHandlers() {
    // Smooth scroll for navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            document.querySelector(anchor.getAttribute('href'))?.scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
    
    // Back to top button
    const backToTopButton = document.getElementById('back-to-top');
    window.addEventListener('scroll', () => {
        if (backToTopButton) {
            backToTopButton.classList.toggle('visible', window.scrollY > 300);
        }
    });
    
    backToTopButton?.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

function initializeLoadingScreen() {
    const loadingScreen = document.querySelector('.loading-screen');
    if (!loadingScreen) return;
    
    // Prevent scrolling while loading
    document.body.style.overflow = 'hidden';
    
    // Show loading screen with animation
    setTimeout(() => {
        loadingScreen.style.opacity = '0';
        // Re-enable scrolling
        document.body.style.overflow = '';
        
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, ANIMATION_DURATION);
    }, LOADING_DURATION);
}

// Prevent loading screen on back/forward navigation
window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
        const loadingScreen = document.querySelector('.loading-screen');
        if (loadingScreen) {
            loadingScreen.style.display = 'none';
            document.body.style.overflow = '';
        }
    }
});

// Initialize all button handlers
function initializeButtonHandlers() {
    // Hero section buttons
    const shopNowBtn = document.querySelector('.hero .btn.primary');
    const learnMoreBtn = document.querySelector('.hero .btn.secondary');
    
    if (shopNowBtn) {
        shopNowBtn.addEventListener('click', () => {
            document.querySelector('#collections').scrollIntoView({ behavior: 'smooth' });
        });
    }
    
    if (learnMoreBtn) {
        learnMoreBtn.addEventListener('click', () => {
            document.querySelector('#community').scrollIntoView({ behavior: 'smooth' });
        });
    }

    // Initialize community section handlers
    initializeHalaqaCircle();
    initializePopupEvents();
    initializeCharitySupport();
}

// Halaqa Circle Registration
function initializeHalaqaCircle() {
    const joinCircleBtn = document.querySelector('.community-card:nth-child(1) .join-btn');
    
    if (joinCircleBtn) {
        joinCircleBtn.addEventListener('click', () => {
            showModal({
                title: 'Join Halaqa Circle',
                content: `
                    <div class="registration-form">
                        <p>Join our exclusive sisterhood circle for spiritual growth and community connection.</p>
                        <p class="price-highlight">Membership Fee: 3,000 Birr / 3 months</p>
                        <form id="halaqaForm">
                            <input type="text" name="name" placeholder="Full Name" required>
                            <input type="email" name="email" placeholder="Email Address" required>
                            <input type="tel" name="phone" placeholder="Phone Number" required>
                            <button type="submit" class="submit-btn">Register Now</button>
                        </form>
                    </div>
                `
            });

            // Handle form submission
            const form = document.getElementById('halaqaForm');
            if (form) {
                form.addEventListener('submit', async (e) => {
                    e.preventDefault();
                    const formData = new FormData(form);
                    await handleFormSubmission(formData, 'Halaqa Circle');
                });
            }
        });
    }
}

// Pop-up Events
function initializePopupEvents() {
    const viewEventsBtn = document.querySelector('.community-card:nth-child(2) .join-btn');
    
    if (viewEventsBtn) {
        viewEventsBtn.addEventListener('click', () => {
            showModal({
                title: 'Upcoming Events',
                content: `
                    <div class="events-list">
                        <div class="event-item">
                            <h4>Try-On Session</h4>
                            <p>Experience our latest collection in person.</p>
                            <p class="event-date">Next Session: Every Saturday</p>
                            <button onclick="registerForEvent('try-on')" class="event-btn">Register</button>
                        </div>
                        <div class="event-item">
                            <h4>Styling Workshop</h4>
                            <p>Learn tips and tricks for styling your modest wear.</p>
                            <p class="event-date">Monthly - First Sunday</p>
                            <button onclick="registerForEvent('workshop')" class="event-btn">Register</button>
                        </div>
                        <div class="event-item">
                            <h4>Community Meetup</h4>
                            <p>Connect with like-minded sisters in your area.</p>
                            <p class="event-date">Bi-weekly - Wednesday</p>
                            <button onclick="registerForEvent('meetup')" class="event-btn">Register</button>
                        </div>
                    </div>
                `
            });
        });
    }
}

// Charity Support
function initializeCharitySupport() {
    const supportBtn = document.querySelector('.community-card:last-child .join-btn');
    
    if (supportBtn) {
        supportBtn.addEventListener('click', () => {
            showModal({
                title: 'Support Afaf Charity',
                content: `
                    <div class="charity-support-form">
                        <p>Join us in making a difference! Your support helps provide essential items and education to women in need.</p>
                        <div class="donation-options">
                            <h4>Ways to Support:</h4>
                            <ul>
                                <li>Purchase our Abayas - Two pads donated per purchase</li>
                                <li>Direct donation to support women's education</li>
                                <li>Volunteer for community outreach programs</li>
                            </ul>
                        </div>
                        <form id="charityForm">
                            <h4>Get Involved</h4>
                            <input type="text" name="name" placeholder="Full Name" required>
                            <input type="email" name="email" placeholder="Email Address" required>
                            <input type="tel" name="phone" placeholder="Phone Number" required>
                            <select name="supportType" required>
                                <option value="">Select How You'd Like to Help</option>
                                <option value="donate">Make a Donation</option>
                                <option value="volunteer">Volunteer</option>
                                <option value="partnership">Business Partnership</option>
                            </select>
                            <textarea name="message" placeholder="Your Message (Optional)"></textarea>
                            <button type="submit" class="submit-btn">Submit</button>
                        </form>
                        <div class="charity-social-links">
                            <p>Follow Afaf Charity for updates:</p>
                            <a href="https://www.instagram.com/afaf_charity" target="_blank" class="social-link">
                                <i class="fab fa-instagram"></i> @afaf_charity
                            </a>
                        </div>
                    </div>
                `
            });

            // Handle form submission
            setTimeout(() => {
                const form = document.getElementById('charityForm');
                if (form) {
                    form.addEventListener('submit', async (e) => {
                        e.preventDefault();
                        const formData = new FormData(form);
                        await handleFormSubmission(formData, 'Charity Support');
                    });
                }
            }, 100);
        });
    } else {
        console.error('Support button not found');
    }
}

// Event registration handler
function registerForEvent(eventType) {
    showModal({
        title: 'Event Registration',
        content: `
            <div class="registration-form">
                <form id="eventRegForm">
                    <input type="text" name="name" placeholder="Full Name" required>
                    <input type="email" name="email" placeholder="Email Address" required>
                    <input type="tel" name="phone" placeholder="Phone Number" required>
                    <input type="hidden" name="eventType" value="${eventType}">
                    <button type="submit" class="submit-btn">Confirm Registration</button>
                </form>
            </div>
        `
    });

    const form = document.getElementById('eventRegForm');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            await handleFormSubmission(formData, `Event - ${eventType}`);
        });
    }
}

// Expose charity support function globally
window.showCharitySupport = function() {
    showModal({
        title: 'Support Afaf Charity',
        content: `
            <div class="charity-support-form">
                <p>Join us in making a difference! Your support helps provide essential items and education to women in need.</p>
                <div class="donation-options">
                    <h4>Ways to Support:</h4>
                    <ul>
                        <li>Purchase our Abayas - Two pads donated per purchase</li>
                        <li>Direct donation to support women's education</li>
                        <li>Volunteer for community outreach programs</li>
                    </ul>
                </div>
                <form id="charityForm">
                    <h4>Get Involved</h4>
                    <input type="text" name="name" placeholder="Full Name" required>
                    <input type="email" name="email" placeholder="Email Address" required>
                    <input type="tel" name="phone" placeholder="Phone Number" required>
                    <select name="supportType" required>
                        <option value="">Select How You'd Like to Help</option>
                        <option value="donate">Make a Donation</option>
                        <option value="volunteer">Volunteer</option>
                        <option value="partnership">Business Partnership</option>
                    </select>
                    <textarea name="message" placeholder="Your Message (Optional)"></textarea>
                    <button type="submit" class="submit-btn">Submit</button>
                </form>
                <div class="charity-social-links">
                    <p>Follow Afaf Charity for updates:</p>
                    <a href="https://www.instagram.com/afaf_charity" target="_blank" class="social-link">
                        <i class="fab fa-instagram"></i> @afaf_charity
                    </a>
                </div>
            </div>
        `
    });

    // Handle form submission
    setTimeout(() => {
        const form = document.getElementById('charityForm');
        if (form) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                const formData = new FormData(form);
                await handleFormSubmission(formData, 'Charity Support');
            });
        }
    }, 100);
};

// Modal Functions
function showModal({ title, content }) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <h2>${title}</h2>
            ${content}
        </div>
    `;
    
    document.body.appendChild(modal);
    modal.style.display = 'block';
    
    // Close button functionality
    const closeBtn = modal.querySelector('.close-modal');
    if (closeBtn) {
        closeBtn.onclick = () => {
            modal.remove();
        };
    }
    
    // Click outside to close
    modal.onclick = (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    };
    
    // Add to active modals list
    window.activeModals = window.activeModals || [];
    window.activeModals.push(modal);
}

function closeModal() {
    const activeModals = window.activeModals || [];
    if (activeModals.length > 0) {
        const lastModal = activeModals.pop();
        if (lastModal && lastModal.parentNode) {
            lastModal.remove();
        }
    }
}