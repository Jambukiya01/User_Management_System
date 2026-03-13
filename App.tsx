/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { Provider } from 'react-redux';
import AppNavigator from './src/navigation/AppNavigator';
import { persistor, store } from './src/store/store';
import Toast from 'react-native-toast-message';
import { SafeAreaView } from 'react-native-safe-area-context';
import { KeyboardAvoidingView, Platform, StatusBar } from 'react-native';
import { PersistGate } from 'redux-persist/integration/react';

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <SafeAreaView style={{ flex: 1 }} edges={["bottom"]}>
            <StatusBar barStyle="dark-content" backgroundColor="white" />
            <AppNavigator />
            <Toast />
          </SafeAreaView>
        </KeyboardAvoidingView>
      </PersistGate>
    </Provider>
  );
}

export default App;
