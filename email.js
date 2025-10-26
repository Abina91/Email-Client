// Email management functionality
class EmailManager {
    static sendEmail(to, subject, message) {
        const currentUser = Auth.getCurrentUser();
        if (!currentUser) {
            throw new Error('User not logged in');
        }

        // Basic email validation
        if (!to || !subject || !message) {
            throw new Error('All fields are required');
        }

        const email = {
            from: currentUser.email,
            fromName: currentUser.name,
            to: to.toLowerCase().trim(),
            subject: subject.trim(),
            message: message.trim(),
            read: false
        };

        return Storage.addEmail(email);
    }

    static getInboxEmails() {
        const currentUser = Auth.getCurrentUser();
        if (!currentUser) return [];
        
        return Storage.getInboxEmails(currentUser.email)
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    }

    static getSentEmails() {
        const currentUser = Auth.getCurrentUser();
        if (!currentUser) return [];
        
        return Storage.getSentEmails(currentUser.email)
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    }

    static getUnreadCount() {
        const inboxEmails = this.getInboxEmails();
        return inboxEmails.filter(email => !email.read).length;
    }

    static markAsRead(emailId) {
        Storage.markEmailAsRead(emailId);
    }

    static deleteEmail(emailId) {
        Storage.deleteEmail(emailId);
    }

    static formatDate(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
            return 'Today ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        } else if (diffDays === 2) {
            return 'Yesterday';
        } else if (diffDays <= 7) {
            return date.toLocaleDateString([], {weekday: 'short'});
        } else {
            return date.toLocaleDateString([], {month: 'short', day: 'numeric'});
        }
    }

    static getInitials(name) {
        return name.split(' ').map(word => word[0]).join('').toUpperCase();
    }
}

// Email UI handlers
function initEmailHandlers() {
    const composeForm = document.getElementById('composeForm');
    const refreshBtn = document.getElementById('refreshBtn');

    // Compose form submission
    composeForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const to = document.getElementById('toEmail').value;
        const subject = document.getElementById('subject').value;
        const message = document.getElementById('message').value;

        try {
            EmailManager.sendEmail(to, subject, message);
            showToast('Email sent successfully!', 'success');
            
            // Clear form
            composeForm.reset();
            
            // Switch to sent view
            switchView('sent');
            updateEmailLists();
        } catch (error) {
            showToast(error.message, 'error');
        }
    });

    // Refresh button
    refreshBtn.addEventListener('click', () => {
        updateEmailLists();
        showToast('Refreshed!', 'success');
    });

    // Initialize email lists
    updateEmailLists();
}

function updateEmailLists() {
    updateInboxList();
    updateSentList();
    updateUnreadCount();
}

function updateInboxList() {
    const emailList = document.getElementById('emailList');
    const emails = EmailManager.getInboxEmails();

    if (emails.length === 0) {
        emailList.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">📭</div>
                <h3>No emails yet</h3>
                <p>Your inbox is empty. New emails will appear here.</p>
            </div>
        `;
        return;
    }

    emailList.innerHTML = emails.map(email => `
        <div class="email-item ${!email.read ? 'unread' : ''}" data-email-id="${email.id}">
            <div class="email-avatar">
                ${EmailManager.getInitials(email.fromName || email.from)}
            </div>
            <div class="email-content">
                <div class="email-sender">${email.fromName || email.from}</div>
                <div class="email-subject">${email.subject}</div>
                <div class="email-preview">${email.message.substring(0, 80)}...</div>
            </div>
            <div class="email-date">${EmailManager.formatDate(email.timestamp)}</div>
        </div>
    `).join('');

    // Add click handlers for email items
    emailList.querySelectorAll('.email-item').forEach(item => {
        item.addEventListener('click', () => {
            const emailId = parseInt(item.dataset.emailId);
            const email = emails.find(e => e.id === emailId);
            if (email) {
                showEmailModal(email);
                if (!email.read) {
                    EmailManager.markAsRead(emailId);
                    updateEmailLists();
                }
            }
        });
    });
}

function updateSentList() {
    const sentList = document.getElementById('sentList');
    const emails = EmailManager.getSentEmails();

    if (emails.length === 0) {
        sentList.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">📤</div>
                <h3>No sent emails</h3>
                <p>Emails you send will appear here.</p>
            </div>
        `;
        return;
    }

    sentList.innerHTML = emails.map(email => `
        <div class="email-item" data-email-id="${email.id}">
            <div class="email-avatar">
                ${EmailManager.getInitials(email.to)}
            </div>
            <div class="email-content">
                <div class="email-sender">To: ${email.to}</div>
                <div class="email-subject">${email.subject}</div>
                <div class="email-preview">${email.message.substring(0, 80)}...</div>
            </div>
            <div class="email-date">${EmailManager.formatDate(email.timestamp)}</div>
        </div>
    `).join('');

    // Add click handlers for sent email items
    sentList.querySelectorAll('.email-item').forEach(item => {
        item.addEventListener('click', () => {
            const emailId = parseInt(item.dataset.emailId);
            const email = emails.find(e => e.id === emailId);
            if (email) {
                showEmailModal(email, true);
            }
        });
    });
}

function updateUnreadCount() {
    const unreadCount = EmailManager.getUnreadCount();
    const badge = document.getElementById('unreadCount');
    badge.textContent = unreadCount;
    badge.style.display = unreadCount > 0 ? 'block' : 'none';
}

function showEmailModal(email, isSent = false) {
    const modal = document.getElementById('emailModal');
    const modalSubject = document.getElementById('modalSubject');
    const modalFrom = document.getElementById('modalFrom');
    const modalTo = document.getElementById('modalTo');
    const modalDate = document.getElementById('modalDate');
    const modalMessage = document.getElementById('modalMessage');

    modalSubject.textContent = email.subject;
    modalFrom.textContent = isSent ? 'You' : (email.fromName || email.from);
    modalTo.textContent = isSent ? email.to : 'You';
    modalDate.textContent = new Date(email.timestamp).toLocaleString();
    modalMessage.textContent = email.message;

    modal.classList.remove('hidden');
}

function hideEmailModal() {
    const modal = document.getElementById('emailModal');
    modal.classList.add('hidden');
}