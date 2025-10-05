# Firebase Setup Instructions

To connect your Mediprior app to Firebase, follow these steps:

## 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add Project"
3. Enter project name (e.g., "mediprior")
4. Follow the setup wizard

## 2. Enable Authentication

1. In Firebase Console, go to "Authentication"
2. Click "Get Started"
3. Enable "Email/Password" sign-in method

## 3. Create Firestore Database

1. In Firebase Console, go to "Firestore Database"
2. Click "Create Database"
3. Start in production mode
4. Choose a location close to your users

## 4. Create Storage Bucket

1. In Firebase Console, go to "Storage"
2. Click "Get Started"
3. Start in production mode

## 5. Get Firebase Configuration

1. In Firebase Console, go to Project Settings (gear icon)
2. Scroll down to "Your apps"
3. Click the web icon (</>)
4. Register your app
5. Copy the firebaseConfig object

## 6. Update Your Code

Open `src/lib/firebase.ts` and replace the config values with yours:

```typescript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

## 7. Set Up Firestore Rules

In Firebase Console > Firestore Database > Rules, use these rules:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    match /profiles/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    match /reports/{reportId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.uid;
    }
  }
}
```

## 8. Set Up Storage Rules

In Firebase Console > Storage > Rules:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /reports/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## 9. Test Your App

1. Run your app locally
2. Try signing up with a new account
3. Upload a test report
4. Complete your health profile

That's it! Your Mediprior app is now connected to Firebase.
