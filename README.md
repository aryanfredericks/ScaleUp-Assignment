# ScaleUp-Assignment

# Instructions for Testing the Application

## Prerequisites:
1. **Node.js**: Ensure that Node.js is installed on your system. You can download it from [here](https://nodejs.org/).
2. **Visual Studio Code (VSCode)**: Install Visual Studio Code, a lightweight and powerful source code editor. You can download it from [here](https://code.visualstudio.com/).
3. **Expo CLI**: Install Expo CLI globally using the following command:
   ```
   npm install -g expo-cli
   ```
4. **Expo Go**: Download and install the Expo Go app on your mobile phone from the App Store (iOS) or Google Play Store (Android).

## Setting Up the Environment:
1. Open Command Prompt (Windows) or Terminal (macOS/Linux).
2. Obtain your IP address by running the following command:
   ```
   ipconfig
   ```
   Note down your IP address. You will need it later.

## Configuring the Application:
1. Navigate to the `frontend/components/pages` directory of the application.
2. Open the files and replace all occurrences of `'10.0.2.2'` with your copied IP address.

## Running the Frontend:
1. In the Command Prompt or Terminal, navigate to the root directory of the application.
2. Install the necessary Node modules by running:
   ```
   npm install
   ```
3. Launch the frontend by running the following command:
   ```
   npx expo start
   ```
4. Scan the QR code displayed in the terminal using the Expo Go app on your mobile phone to start the development server.

## Running the Backend:
1. Again, ensure you are in the root directory of the application.
2. Install the required Node modules by running:
   ```
   npm install
   ```
3. Launch the Express server by running:
   ```
   node app.js
   ```
