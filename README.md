# Social-Media-Website (Codeial)

A modern social media application with friend system, real-time chat, and improved UI.

## New Features Added ✨

### 1. Friend System 👥
- Send friend requests to other users
- Accept or reject friend requests
- View friends list on profile
- Unfriend users
- Friend status badges (Friends, Request Sent, Request Received)

### 2. All Users Page 🌐
- Browse all registered users (like Facebook)
- See friend status for each user
- Quick actions to add friends, accept requests, or chat
- Modern card-based UI with avatars
- Responsive grid layout

### 3. Real-time Chat 💬
- Chat with friends in real-time using Socket.io
- Select friends from sidebar to start conversation
- Message history is saved in database
- Clean, modern chat interface
- Real-time message delivery

### 4. Improved UI 🎨
- Modern gradient design with purple theme
- Responsive navigation bar
- Card-based layouts for posts and users
- Avatar placeholders with user initials
- Smooth animations and transitions
- Mobile-friendly responsive design
- Better typography with Poppins font

## Setup Instructions

### Prerequisites
1. Install Node.js from: https://www.geeksforgeeks.org/installation-of-node-js-on-windows/
2. Install MongoDB from: https://www.mongodb.com/docs/manual/installation/

### Installation
1. Clone this project
2. Run `npm install` to install dependencies
3. Start MongoDB service
4. Run `npm start` or `nodemon index.js`
5. Open browser and go to http://localhost:8000

## How to Use

### Friend Features
1. Go to "All Users" page to see all registered users
2. Click "Add Friend" to send a friend request
3. View friend requests on your profile page
4. Accept or reject requests from your profile
5. Chat with friends using the Chat page

### Chat Features
1. Click "Chat" in navigation
2. Select a friend from the left sidebar
3. Type your message and press Enter or click Send
4. Messages are delivered in real-time to online friends

## Technical Details

### New Dependencies
- socket.io: Real-time bidirectional communication for chat

### Database Models
- User: Extended with friends, friendRequests, and sentRequests arrays
- Chat: Stores chat messages between users
- Post: Existing post model
- Comment: Existing comment model
- Like: Existing like model

### API Routes
- `/all-users`: Browse all users
- `/chat`: Real-time chat interface
- `/friends/send-request`: Send friend request
- `/friends/accept-request`: Accept friend request
- `/friends/reject-request`: Reject friend request
- `/friends/remove-friend`: Remove friend

### Controllers
- friends_controller.js: Handles all friend operations
- chat_controller.js: Handles chat functionality
- all_users_controller.js: Displays all users page
