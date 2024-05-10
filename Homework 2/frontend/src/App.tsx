import './App.css';
import { useWebSockets } from './hooks/useWebSockets';
import { NetContextProvider } from './reducer/net/context';
import { NotificationsContextProvider } from './reducer/notifications/context';
import { UsersContextProvider } from './reducer/users/context'
import { ProjectsContextProvider } from './reducer/projects/context';
import { VisualisationsContextProvider } from './reducer/visualisations/context';
import { DataContextProvider } from './reducer/data/context';
import { RouterProvider } from 'react-router-dom';
import { router } from './router/router';
import { Notifications } from './components/notifications/notifications';
import { TokensContextProvider } from './reducer/tokens/context';

export const App = () => {
  const websocket = useWebSockets('wss://2n8nbnrly9.execute-api.eu-central-1.amazonaws.com/Production', 5000)

  return (
    <NetContextProvider websocket={websocket}>
      <NotificationsContextProvider>
        <UsersContextProvider websocket={websocket}>
          <DataContextProvider websocket={websocket}>
            <VisualisationsContextProvider websocket={websocket}>
              <TokensContextProvider websocket={websocket}>
                <ProjectsContextProvider websocket={websocket}>
                  <RouterProvider router={router} />
                  <Notifications />
                </ProjectsContextProvider>
              </TokensContextProvider>
            </VisualisationsContextProvider>
          </DataContextProvider>
        </UsersContextProvider>
      </NotificationsContextProvider>
    </NetContextProvider>
  );
}