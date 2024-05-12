import React from 'react';
import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import './App.css';
import { Notifications } from './components/notifications/notifications';
import { store } from './reducer/store';
import { router } from './router/router';

export const App: React.FC = () => (
  <Provider store={store}>
    <RouterProvider router={router} />
    <Notifications />
  </Provider>
);

