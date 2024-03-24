import React, { useContext } from 'react';
import './App.css';
import { useWebSockets } from './hooks/useWebSockets';
import { AuthContextProvider } from './reducer/auth/context'
import { RouterProvider } from 'react-router-dom';
import { router } from './router/router';

export const App = () => {
  const websocket = useWebSockets('ws://127.0.0.1:8000')

  return (
    <AuthContextProvider websocket={websocket}>
      <RouterProvider router={router} />
    </AuthContextProvider>
  );
}