import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import App from './App';
import { store } from './store/store';
import './index.css';

// Initialize Capacitor
import { StatusBar, Style } from '@capacitor/status-bar';
import { Capacitor } from '@capacitor/core';

if (Capacitor.isNativePlatform()) {
  StatusBar.setStyle({ style: Style.Dark });
  StatusBar.setBackgroundColor({ color: '#1a1a1a' });
}

// Apply dark mode based on saved preference
const savedPreferences = localStorage.getItem('userPreferences');
if (savedPreferences) {
  try {
    const preferences = JSON.parse(savedPreferences);
    if (preferences.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  } catch (e) {
    // Default to light mode if parsing fails
    document.documentElement.classList.remove('dark');
  }
} else {
  // Default to light mode for new users
  document.documentElement.classList.remove('dark');
}

// Check if onboarding is needed
const isOnboardingComplete = localStorage.getItem('onboardingComplete');
if (!isOnboardingComplete && window.location.pathname !== '/onboarding') {
  window.location.href = '/onboarding';
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
        <Toaster position="top-center" />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
