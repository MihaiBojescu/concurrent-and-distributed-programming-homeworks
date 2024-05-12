import {
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js';
import React from 'react';
import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import './App.css';
import { Notifications } from './components/notifications/notifications';
import { store } from './reducer/store';
import { router } from './router/router';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

export const App: React.FC = () => (
  <Provider store={store}>
    <RouterProvider router={router} />
    <Notifications />
  </Provider>
);

