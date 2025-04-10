# Installation Guide

Follow these steps to set up and run the project locally:

## 1. Clone the Repository
```bash
git clone <repository-url>
```

## 2. Install Frontend Dependencies
Navigate to the root directory of the project and run:
```bash
npm install
```

## 3. Configure Frontend Environment Variables
Create a `.env` file in the root directory of the project and add the following variable:
```env
VITE_BACKEND_URL='http://localhost:3000'
```

## 4. Start the Frontend
Run the following command to start the frontend:
```bash
npm run dev
```
This will start the frontend server.

## 5. Install Backend Dependencies
Open a second terminal, navigate to the `Backend` directory, and run:
```bash
cd Backend
npm install
```

## 6. Configure Backend Environment Variables
Create a `.env` file in the `Backend` directory and add the following variables:

### MongoDB
- `MONGODB_URL`: Set this to your local MongoDB URL or an online database URL.
  - Example for local setup: `mongodb://localhost:27017/<database-name>`
  - Example for online setup (MongoDB Atlas): `mongodb+srv://<username>:<password>@cluster0.mongodb.net/<database-name>?retryWrites=true&w=majority`

### Cloudinary
- `CLOUDINARY_CLOUD_NAME`: The cloud name from your Cloudinary account.
- `CLOUDINARY_API_KEY`: The API key from your Cloudinary account.
- `CLOUDINARY_API_SECRET`: The API secret from your Cloudinary account.
  
#### Steps to Get Cloudinary Variables:
1. Log in to your Cloudinary account.
2. Navigate to the **Dashboard**.
3. Copy the values for **Cloud Name**, **API Key**, and **API Secret**.
4. Add them to your `.env` file.

### OAuth2 Credentials
- `CLIENT_ID`: The Client ID from your Google Cloud Console project.
- `CLIENT_SECRET`: The Client Secret from your Google Cloud Console project.
- `REFRESH_TOKEN`: The refresh token generated for your app.
- `SEND_EMAIL`: Your email address (same as used in the Google Cloud Console).

#### Steps to Get OAuth2 Variables:
1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project or select an existing one.
3. Enable the **Gmail API** for the project.
4. Navigate to **APIs & Services > Credentials**.
5. Create a new OAuth 2.0 Client ID:
   - Application type: Select "Web application."
   - Add authorized redirect URIs (e.g., `http://localhost` if running locally).
6. Download the credentials JSON file and extract the **Client ID** and **Client Secret**.
7. Use the **Google OAuth2 Playground** to generate a refresh token:
   - Visit [OAuth 2.0 Playground](https://developers.google.com/oauthplayground).
   - Select the necessary scopes (e.g., Gmail API).
   - Authorize and exchange the authorization code for a refresh token.
8. Add these values to your `.env` file.

## 7. Start the Backend
Run one of the following commands to start the backend server:
```bash
node index.js
```
or if you prefer automatic server restarts during development:
```bash
nodemon index.js
```

