import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <Stack
          screenOptions={{
            headerShown: false,
          }}
          initialRouteName="index"
        >
          <Stack.Screen name="index" options={{ title: 'Task Manager' }} />
          <Stack.Screen name="add" options={{ title: 'Add New Task' }} />
          <Stack.Screen name="[id]" options={{ title: 'Task Details' }} />
        </Stack>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}