
Project Title: Email Client

Description
-----------
Web-based email application for sending and receiving emails. This repository contains the frontend portion of the Email Client: a lightweight user interface for composing, viewing, and managing emails.

Features implemented in this frontend version
--------------------------------------------
- Compose and send emails (UI only; form validation present)
- Inbox view with message listing and pagination UI
- Message detail view to read full email content
- Drafts support (UI to save and edit drafts locally)
- Basic search and filtering of visible messages
- Simple client-side storage using `localStorage` for drafts and cached messages
- Responsive design with basic styling in `styles.css`
- Email input validation and user feedback for common errors

Planned backend integration and future improvements
--------------------------------------------------
- Backend API endpoints for:
  - Sending emails (SMTP or mail-sending service)
  - Retrieving messages (IMAP/POP3 proxy or REST API)
  - Managing folders/labels and message state (read/unread, starred)
  - Draft persistence and synchronization across devices
- Authentication and user accounts (OAuth2, JWT-based sessions)
- Real-time updates via WebSockets or Server-Sent Events for new 

Notes
-----
This frontend is currently a static client-side implementation. To enable full functionality you will need to connect it to a backend service that implements the email protocols or proxies to a mail provider.
