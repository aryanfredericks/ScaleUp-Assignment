import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import MainApp from './components/MainApp';
import AuthProvider from './contexts/authentication.js/AuthProvider';
import UserProvider from './contexts/user/UserProvider';
import TaskProvider from './contexts/tasks/TaskProvider';
export default function App() {
  return (
    <TaskProvider>
      <UserProvider>
        <AuthProvider>
          <MainApp />
        </AuthProvider>
      </UserProvider>
    </TaskProvider>
  );
}


