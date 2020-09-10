import React, { useState } from 'react';
import './App.css';
import { useStateValue } from './StateProvider'; 
import Login from './components/Login';
import Sidebar from './components/Sidebar';
import Chat from './components/Chat';

function App() {
    const [{user: username}, dispatch] = useStateValue();
    const [selectedUser, setSelectedUser] = useState('');

    return (
        <div className="app">
            {
                !username ? (
                    <Login />
                ) : (
                    <div className="app__body">
                        <Sidebar onClick={(name) => setSelectedUser(name)}/>
                        <Chat selectedUser={selectedUser} />
                    </div>
                    
                )
            }
        </div>
    );
}

export default App;
