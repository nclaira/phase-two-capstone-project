# MongoDB Setup Guide

## Quick Setup

### Option 1: Local MongoDB

1. **Install MongoDB** (if not already installed):
   - Windows: Download from [MongoDB Download Center](https://www.mongodb.com/try/download/community)
   - Or use MongoDB via Docker: `docker run -d -p 27017:27017 --name mongodb mongo`

2. **Start MongoDB**:
   - Windows: MongoDB should start automatically as a service
   - Or manually: `mongod` (in a separate terminal)

3. **Create `.env.local` file** in the `capstone` folder:
   ```
   MONGODB_URI=mongodb://localhost:27017/medium-clone
   ```

### Option 2: MongoDB Atlas (Cloud - Recommended)

1. **Create a free account** at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

2. **Create a cluster** (free tier is fine)

3. **Get your connection string**:
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/`)

4. **Create `.env.local` file** in the `capstone` folder:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/medium-clone?retryWrites=true&w=majority
   ```
   Replace `username`, `password`, and `cluster` with your actual values.

## Verify Setup

1. **Check the console** when you start the app - you should see:
   - `🔄 Connecting to MongoDB...`
   - `✅ MongoDB connected successfully`
   - `📊 Database: medium-clone`

2. **Check MongoDB**:
   - **Local**: Open MongoDB Compass and connect to `mongodb://localhost:27017`
   - **Atlas**: Use the Atlas web interface
   - Look for database: `medium-clone`
   - Look for collection: `users`

3. **Test signup**: Create a new user and check the console logs for confirmation.

## Troubleshooting

### "Connection refused" error
- Make sure MongoDB is running
- Check if port 27017 is available
- Verify your connection string is correct

### "Authentication failed" error (Atlas)
- Make sure your username and password are correct
- Check if your IP address is whitelisted in Atlas
- Verify the connection string format

### Users not appearing in MongoDB
- Check the browser console for errors
- Check the server console (terminal) for connection logs
- Verify the `.env.local` file is in the `capstone` folder (not root)
- Restart the Next.js dev server after creating `.env.local`

## Database Structure

- **Database**: `medium-clone`
- **Collections**:
  - `users` - User accounts
  - `posts` - Blog posts/stories

