import React, { useContext } from 'react';
import logo from './logo.svg';
import './App.css';
import { useWebSockets } from './hooks/useWebSockets';
import { AuthContext, AuthContextProvider } from './reducer/auth/context'

export const App = () => {
  const websocket = useWebSockets('ws://127.0.0.1:8000')

  return (
    <AuthContextProvider websocket={websocket}>
      <ClickityClick />
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.tsx</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
    </AuthContextProvider>
  );
}

const ClickityClick: React.FC = () => {
  const [state, dispatch] = useContext(AuthContext)

  const onClick = () => {
    dispatch({ type: 'login', credentials: { password: '123', username: '123' } })
  }

  return <button onClick={onClick}>{JSON.stringify(state, null, 4)}</button>
}
