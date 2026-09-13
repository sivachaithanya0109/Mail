# Mailbox Delight

Build a high-fidelity email client interface inspired by the desktop Gmail experience.

IMPORTANT:
This is a FRONTEND UI PROTOTYPE only. Do not connect to Gmail, Google APIs, SMTP, or any real email service. Use realistic static mock email data. The interface should feel extremely polished and production-ready.

Do not copy Google's logo, proprietary illustrations, or trademarks. Use a neutral email-product name and logo, while closely following the familiar Gmail-style information architecture, spacing, density, interactions, and visual hierarchy.

## Main goal

Create a complete desktop email application where the user can:

1. View an inbox containing realistic email messages.
2. Select emails.
3. Open an email and read it.
4. Navigate between emails.
5. View sender/security details.
6. Interact with menus, buttons, stars, checkboxes, tabs, and panels.
7. Navigate between Inbox, Starred, Sent, Drafts, and other folders.

All interactions can be simulated locally with frontend state.

## Visual design

Use a clean, modern Gmail-inspired interface:

- Light gray/off-white application background
- White message/content surfaces
- Subtle borders
- Very light shadows
- Rounded corners where appropriate
- Compact email rows
- Professional typography similar to modern productivity applications
- Excellent spacing and alignment
- Muted gray secondary text
- Dark charcoal primary text
- Blue accent color for primary actions and links
- Small, consistent iconography
- Dense but comfortable desktop email layout

The result should look like a real mature email product, not a generic dashboard.

## Application shell

Create:

### Top header

- Product logo/name on the left
- Hamburger/sidebar toggle
- Large search field in the center
- Search icon
- Help icon
- Settings icon
- Apps/grid icon
- User avatar on the right

The header should remain fixed at the top.

### Left sidebar

Include:

- Compose button
- Inbox
- Starred
- Snoozed
- Sent
- Drafts
- More
- Labels section

Each navigation item should have an icon, label, and optional unread count.

The selected navigation item should have a subtle highlighted background.

## Inbox

Create a realistic inbox containing approximately 15–20 mock emails.

Each row should contain:

- Selection checkbox
- Star button
- Important/priority indicator
- Sender name
- Subject
- Short message preview
- Date/time
- Optional attachment indicator

Unread messages should have:

- Slightly stronger text weight
- Clear visual distinction
- Appropriate unread count

Read messages should appear more muted.

Add hover states to every email row.

Clicking anywhere on the email row should open that email.

Clicking the checkbox should select it without opening the email.

Clicking the star should toggle the star state without opening the email.

## Inbox toolbar

Above the messages, include:

- Select-all checkbox
- Refresh button
- More actions
- Archive
- Report spam
- Delete
- Mark as read/unread
- Snooze

When messages are selected, change the toolbar to show bulk actions.

Include pagination/navigation on the right.

## Category tabs

Under the toolbar, create Gmail-style category tabs:

- Primary
- Promotions
- Social
- Updates

Primary should be selected by default.

Switching tabs should display different mock messages.

## Open email view

When a user clicks an email, transition to an email reading view.

Include:

- Back button
- Archive
- Report spam
- Delete
- Mark unread
- Snooze
- More actions
- Previous/next message navigation

Then display:

- Subject
- Important indicator
- Sender avatar
- Sender name
- Sender email address
- Recipient information
- Date and time
- Message body
- Attachments if applicable

The message body should look like a realistic professional email.

Use realistic content such as:

- Work emails
- Notifications
- Account/security alerts
- Receipts
- Newsletters
- Project updates
- Meeting invitations

Do not use actual people's private information.

## Sender details / security popup

This is especially important.

When the user clicks the sender information or small details dropdown beside the recipient information, open a polished Gmail-inspired sender/details popover.

Show:

Sender:
Alex Morgan
alex.morgan@example.com

To:
user@example.com

Date:
September 9, 2026

Then include a security/authentication section:

Security
- Standard encryption (TLS)
- Signed by: example.com
- SPF: PASS
- DKIM: PASS
- DMARC: PASS

Include a small lock/security icon and a clear security status.

Add a "Show security details" or "Show original" style action.

When clicked, open a larger modal containing technical email metadata such as:

- Message ID
- Created date
- From
- To
- Reply-To
- MIME-Version
- Authentication results
- SPF
- DKIM
- DMARC
- TLS/encryption
- Mail server information
- Received headers

Use fake/example values only.

The security information should look technically credible but must clearly be mock/demo data.

## Compose window

Add a functional-looking Compose button.

When clicked, open a Gmail-style compose window in the bottom-right corner.

Include:

- To
- Cc
- Bcc
- Subject
- Rich text toolbar
- Message editor
- Attachment button
- Link button
- Emoji button
- Trash/discard
- Send button

The send action can simply show a success notification and close the compose window. Do not actually send email.

## Search

Make the search field visually functional.

When the user enters text, filter the mock emails based on:

- Sender
- Subject
- Preview
- Email content

Show a search-results state.

## Interactions

Implement frontend state for:

- Opening emails
- Returning to inbox
- Selecting emails
- Select all
- Star/unstar
- Mark read/unread
- Archive
- Delete
- Snooze
- Switching categories
- Switching folders
- Opening sender details
- Opening security details
- Opening/closing compose
- Searching
- Closing modals/popovers
- Previous/next email navigation

No backend is required.

## Responsive design

Desktop is the primary target.

Also provide a responsive tablet/mobile version:

- Collapsible sidebar
- Compact header
- Full-width message list
- Mobile-friendly email reading view
- Compose window adapted for mobile

## Component architecture

Use reusable components such as:

- AppShell
- Header
- Sidebar
- ComposeButton
- InboxToolbar
- CategoryTabs
- EmailList
- EmailRow
- EmailReader
- SenderDetailsPopover
- SecurityDetailsModal
- ComposeWindow
- SearchBar
- Toast
- DropdownMenu
- Modal

Keep the code clean and modular.

## Data

Create a local mock email dataset with realistic examples.

Each email should contain:

- id
- sender
- senderEmail
- recipient
- subject
- preview
- body
- date
- time
- unread
- starred
- important
- category
- folder
- attachments
- security/authentication information

Create enough data so the interface feels populated and realistic.

## UX details

Pay close attention to:

- Exact alignment
- Consistent spacing
- Typography hierarchy
- Hover states
- Active states
- Focus states
- Smooth transitions
- Dropdown positioning
- Modal positioning
- Scroll behavior
- Email row density
- Sidebar width
- Header height
- Button sizing
- Icon sizing

Avoid excessive animations. Use subtle transitions only.

## Final requirement

The final result should feel like a polished, high-fidelity Gmail-inspired email application prototype.

Prioritize visual accuracy, layout, spacing, typography, interaction states, and realistic email/security-detail screens over backend functionality.

Everything should work locally using mock data and frontend state only.


just consider this prompt i need exact email copy application interface can you please build that

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/57c563b1-7d95-4c75-8bb9-0af2fe420ef5).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
