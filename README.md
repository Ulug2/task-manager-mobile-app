# Task Manager Mobile App

A simple mobile application built with React Native and Expo to help you manage your daily tasks.

## Features

- **Create Tasks:** Easily add new tasks with a title, optional description, location, and due date/time.
- **View Tasks:** See a list of all your tasks.
- **Task Details:** View detailed information for each task.
- **Update Status:** Change the status of a task (e.g., Pending, In Progress, Completed, Cancelled).
- **Delete Tasks:** Remove tasks you no longer need.
- **Sort Tasks:** Sort tasks by date or status.
- **Persistent Storage:** Tasks are saved locally on your device using AsyncStorage.

## Prerequisites

Before you begin, ensure you have met the following requirements:

- [Node.js](https://nodejs.org/) (LTS version recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Expo Go](https://expo.dev/go) app on your iOS or Android device (for testing on a physical device)
- OR an Android Emulator / iOS Simulator set up on your development machine.
- [Expo CLI](https://docs.expo.dev/get-started/installation/):
  ```bash
  npm install -g expo-cli
  ```

## Getting Started

Follow these steps to get the project up and running on your local machine.

### 1. Clone the Repository (if applicable)

If you've already cloned it, skip this step.

```bash
git clone <your-repository-url>
cd task-manager
```

### 2. Navigate to the App Directory

The main application code is within the `Task_Manager_App` directory.

```bash
cd Task_Manager_App
```

### 3. Install Dependencies

Install the project dependencies using npm or yarn:

```bash
npm install
# or
yarn install
```

### 4. Running the Application

Once the dependencies are installed, you can start the Expo development server:

```bash
npm start
# or
yarn start
# or
expo start
```

This will open the Expo Developer Tools in your web browser. You can then:

- **Scan the QR code** with the Expo Go app on your physical device.
- **Run on an Android emulator/device** (press `a` in the terminal).
- **Run on an iOS simulator/device** (press `i` in the terminal).

## Technologies Used

- **React Native:** For building native mobile applications using JavaScript and React.
- **Expo:** A framework and platform for universal React applications, simplifying development and deployment.
- **Expo Router:** File-system based routing for React Native apps.
- **TypeScript:** For static typing and improved code quality.
- **AsyncStorage:** For local data persistence on the device.
- **React Native Gesture Handler:** For handling touch gestures.
- **React Native Safe Area Context:** For handling safe areas on different devices.
- **@react-native-community/datetimepicker:** For native date and time selection.
