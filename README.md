# 📱 User Management Mobile Application

A fully functional **React Native User Management System** that allows users to view, create, update, and delete user profiles with **offline support, image uploads, pagination, and state persistence**.

This project demonstrates practical usage of modern **React Native architecture**, including **Redux Toolkit, Redux Persist, API integration, offline-first behavior, and modular component design**.

---

# 🚀 Key Features

## 🔐 Authentication System

The application includes a simple authentication flow.

### Login Options

Users can log in using either:

• **Email + Password**
• **Mobile Number + Password**

### Authentication Behavior

* Login state is stored in **Redux**
* Authentication data is persisted using **Redux Persist**
* Users remain logged in after closing and reopening the application
* On logout, all stored data is cleared and the user is redirected to the login screen

### Validation

Input validation is implemented for:

* Email format validation
* Mobile number validation
* Password validation

---

# 👤 User Management

The core functionality of the application revolves around managing user profiles.

---

# 📋 User List Screen

Displays a list of all users retrieved from the API.

### Features

* API based user fetching
* Pagination support
* Infinite scroll
* Pull-to-refresh
* Avatar image display
* Placeholder avatar when no image is available
* Floating Action Button for adding new users
* Cached user list available when offline

### Pagination

The list implements **infinite scrolling pagination**:

* Initial users load when the screen opens
* Additional users load automatically when reaching the end of the list
* API requests stop when no more data is available

---

# 👤 User Detail Screen

Displays complete details of a selected user.

### Information Displayed

* Profile Image
* Full Name
* Email Address
* Phone Number
* Birth Date
* Gender
* Address

### Actions Available

Users can:

* **Edit the user**
* **Delete the user**

### Offline Behavior

If the device is offline:

* Delete action is stored in an **offline queue**
* The action will automatically sync when internet becomes available

---

# ✏️ Add / Edit User Screen

Used for both creating and editing user profiles.

### Form Fields

* Profile Image
* First Name
* Last Name
* Email
* Phone Number
* Dial Code (Country Picker)
* Birth Date
* Gender
* Address

### UI Improvements

* Camera icon overlay for editing profile picture
* Clean card layout
* Custom input components
* Reusable button components
* Country picker for dial code

### Image Upload

Users can take a picture using the **front camera**.

Steps:

1. Camera permission requested
2. Photo captured
3. Image uploaded to **Cloudinary**
4. Image URL stored with user profile

---

# 📷 Image Upload (Cloudinary)

Images are uploaded using the **Cloudinary Upload API**.

### Flow

User captures image
⬇
Image uploaded to Cloudinary
⬇
Cloudinary returns secure URL
⬇
URL saved in user profile

### Benefits

* No image storage required in backend
* Fast CDN image delivery
* Scalable image hosting

---

# 📡 Offline Support

The application implements an **offline-first architecture**.

Users can continue interacting with the app even without internet.

---

# 📦 Redux Persist (Offline Cache)

User data is stored locally using **Redux Persist**.

### Benefits

* User list is cached locally
* App works without internet
* Faster app startup
* Reduced API calls

---

# 🔄 Offline Action Queue

When the user performs actions offline, the app stores them in a queue.

### Offline Actions Supported

* Create User
* Update User
* Delete User

These actions are stored locally and executed later.

### Queue Example

If a user:

* Adds a user offline
* Updates another user
* Deletes a user

The queue will store:

```
CREATE_USER
UPDATE_USER
DELETE_USER
```

---

# 🔁 Automatic Sync

The application uses **NetInfo** to detect internet connection.

When internet becomes available:

1️⃣ Offline queue starts processing
2️⃣ All queued actions sync with the API
3️⃣ Redux store updates
4️⃣ User list refreshes automatically

During sync:

* UI shows **"Syncing offline changes..."**
* User interaction is temporarily disabled

---

# ⚙️ Error Handling

Centralized error handling has been implemented.

### API Errors

Handled using **Axios interceptors**

Example scenarios:

* Network failure
* API error responses
* Server errors

### UI Feedback

Users receive feedback through:

* Success toast messages
* Error toast messages
* Loading indicators

---

# 🎨 UI Architecture

Reusable UI components were created for better maintainability.

### Custom Components

| Component     | Purpose                 |
| ------------- | ----------------------- |
| CustomInput   | Reusable text input     |
| PrimaryButton | Styled button component |
| UserCard      | User list item UI       |
| Loader        | Activity indicator      |

### Design System

A shared color system is implemented using:

```
utils/colors.ts
```

This ensures consistent UI across the entire application.

---

# 🧠 State Management

The application uses **Redux Toolkit**.

### Redux Slices

#### Auth Slice

Manages authentication state.

Stores:

* Login type (email or mobile)
* Email or mobile number
* Login status

---

#### User Slice

Manages user data.

Handles:

* User list
* Pagination
* Loading states
* Offline syncing state

---

# 📁 Project Structure

```
src
│
├── api
│   ├── apiClient.ts
│   └── userApi.ts
│
├── assets
│   ├── images
│   └── index.ts
│
├── components
│   ├── CustomInput.tsx
│   ├── Loader.tsx
│   ├── PrimaryButton.tsx
│   └── UserCard.tsx
│
├── navigation
│   └── AppNavigator.tsx
│
├── screens
│   ├── LoginScreen.tsx
│   ├── UserListScreen.tsx
│   ├── UserDetailScreen.tsx
│   └── AddEditUserScreen.tsx
│
├── services
│   ├── cloudinaryService.ts
│   ├── offlineQueue.ts
│   └── syncService.ts
│
├── store
│   ├── store.ts
│   ├── authSlice.ts
│   ├── userSlice.ts
│   └── hooks.ts
│
└── utils
    ├── colors.ts
    ├── validators.ts
    └── toast.ts
```

---

# 🧩 Tech Stack

* React Native CLI
* TypeScript
* Redux Toolkit
* Redux Persist
* React Navigation
* Axios
* React Native Image Picker
* Cloudinary API
* NetInfo
* React Native Permissions

---

# ⚙️ Installation

## Clone Repository

```
git clone https://github.com/your-username/user-management-app.git
```

---

## Install Dependencies

```
npm install
```

or

```
yarn install
```

---

## iOS Setup

```
cd ios
pod install
```

---

## Run Application

### Android

```
npx react-native run-android
```

### iOS

```
npx react-native run-ios
```

---

# 🔑 Environment Variables

Create a `.env` file.

Example:

```
API_BASE_URL=https://mockapi.io/api
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_UPLOAD_PRESET=your_upload_preset
```

---

# 📄 User Data Model

The application uses the following user structure returned from the API.

Example user object:

{
  "first_name": "Emma",
  "last_name": "Johnson",
  "image": "https://randomuser.me/api/portraits/women/12.jpg",
  "phone_number": "4157283941",
  "dial_code": "+1",
  "birth_date": "1994-03-12",
  "address": "742 Evergreen St, San Francisco, USA",
  "gender": "female",
  "email": "emma.johnson@example.com",
  "id": "u1001"
}

### Field Description

| Field | Description |
|------|-------------|
| id | Unique user identifier |
| first_name | User's first name |
| last_name | User's last name |
| email | User email address |
| phone_number | Phone number |
| dial_code | Country dial code |
| birth_date | Date of birth (YYYY-MM-DD) |
| gender | User gender |
| address | Residential address |
| image | Profile image URL |

---

# 📦 Build APK

```
cd android
./gradlew assembleRelease
```

APK location:

```
android/app/build/outputs/apk/release/app-release.apk
```

---

# 🔮 Future Improvements

Possible improvements include:

* Unit testing
* Search functionality
* User filtering
* Dark mode support
* Form validation enhancements
* UI animations

---

# 👨‍💻 Author

Ashish Jambukiya

React Native Developer
