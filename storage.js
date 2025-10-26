// Local Storage utility functions
class Storage {
    static getUsers() {
        const users = localStorage.getItem('mailflow_users');
        return users ? JSON.parse(users) : [];
    }

    static saveUsers(users) {
        localStorage.setItem('mailflow_users', JSON.stringify(users));
    }

    static getCurrentUser() {
        const user = localStorage.getItem('mailflow_current_user');
        return user ? JSON.parse(user) : null;
    }

    static setCurrentUser(user) {
        localStorage.setItem('mailflow_current_user', JSON.stringify(user));
    }

    static clearCurrentUser() {
        localStorage.removeItem('mailflow_current_user');
    }

    static getEmails() {
        const emails = localStorage.getItem('mailflow_emails');
        return emails ? JSON.parse(emails) : [];
    }

    static saveEmails(emails) {
        localStorage.setItem('mailflow_emails', JSON.stringify(emails));
    }

    static addEmail(email) {
        const emails = this.getEmails();
        email.id = Date.now() + Math.random();
        email.timestamp = new Date().toISOString();
        emails.push(email);
        this.saveEmails(emails);
        return email;
    }

    static getUserEmails(userEmail) {
        const emails = this.getEmails();
        return emails.filter(email => 
            email.to === userEmail || email.from === userEmail
        );
    }

    static getInboxEmails(userEmail) {
        const emails = this.getEmails();
        return emails.filter(email => email.to === userEmail);
    }

    static getSentEmails(userEmail) {
        const emails = this.getEmails();
        return emails.filter(email => email.from === userEmail);
    }

    static markEmailAsRead(emailId) {
        const emails = this.getEmails();
        const email = emails.find(e => e.id === emailId);
        if (email) {
            email.read = true;
            this.saveEmails(emails);
        }
    }

    static deleteEmail(emailId) {
        const emails = this.getEmails();
        const updatedEmails = emails.filter(e => e.id !== emailId);
        this.saveEmails(updatedEmails);
    }

    // Initialize with sample data for demonstration
    static initializeSampleData() {
        const users = this.getUsers();
        const emails = this.getEmails();

        // Add sample users if none exist
        if (users.length === 0) {
            const sampleUsers = [
                { 
                    id: 1, 
                    name: 'John Smith', 
                    email: 'john@mailflow.com', 
                    password: 'password123' 
                },
                { 
                    id: 2, 
                    name: 'Sarah Johnson', 
                    email: 'sarah@mailflow.com', 
                    password: 'password123' 
                }
            ];
            this.saveUsers(sampleUsers);
        }

        // Add sample emails if none exist
        if (emails.length === 0) {
            const sampleEmails = [
                {
                    id: 1,
                    from: 'sarah@mailflow.com',
                    to: 'john@mailflow.com',
                    subject: 'Welcome to MailFlow!',
                    message: 'Hi John! Welcome to MailFlow. This is your first email in our system. You can compose, send, and receive emails just like a real email client. Try sending a reply!',
                    timestamp: new Date(Date.now() - 86400000).toISOString(),
                    read: false
                },
                {
                    id: 2,
                    from: 'system@mailflow.com',
                    to: 'john@mailflow.com',
                    subject: 'Getting Started Guide',
                    message: 'Here are some tips to get started with MailFlow:\n\n1. Use the Compose tab to write new emails\n2. Check your Inbox for new messages\n3. View sent messages in the Sent tab\n4. Click on any email to read it in full\n\nEnjoy using MailFlow!',
                    timestamp: new Date(Date.now() - 43200000).toISOString(),
                    read: false
                }
            ];
            this.saveEmails(sampleEmails);
        }
    }
}