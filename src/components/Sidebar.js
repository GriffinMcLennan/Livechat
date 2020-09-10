import React, { useState, useEffect } from 'react';
import './Sidebar.css';
import { Avatar } from '@material-ui/core';
import { useStateValue } from '../StateProvider';
import { SearchOutlined } from '@material-ui/icons';
import db from '../firebase';
import UserTile from './UserTile';
import CasinoIcon from '@material-ui/icons/Casino';

/* `https://avatars.dicebear.com/api/human/${seed}.svg` */

function Sidebar({ onClick }) {
    const [{ user: username }, dispatch] = useStateValue();
    const [searchUser, setSearchUser] = useState('');
    const [users, setUsers] = useState([]);
    const [searchUsers, setSearchUsers] = useState([]);
    const [userPhoto, setUserPhoto] = useState('');

    useEffect(() => {
        const unsub1 = db.collection('Users').onSnapshot(snapshot => {
            setUsers(snapshot.docs.filter(doc => doc.data().username !== username).map(doc => doc.data()));
            setSearchUsers(snapshot.docs.filter(doc => doc.data().username !== username).map(doc => doc.data()));
        });

        const unsub2 = db.collection('Users').doc(username).onSnapshot(doc => {
            setUserPhoto(doc.data().photoURL);
        })
        return () => {
            unsub1();
            unsub2();
        }

    }, [username]);

    useEffect(() => {
        setSearchUsers((
            users.filter(user => user.username.toLowerCase().includes(searchUser.toLowerCase())).map(user => user)
        ));
    }, [searchUser, users]);

    const genNewPhoto = () => {
        let seed = Math.floor(Math.random() * 30000 + 1);

        db.collection('Users').doc(username).set({
            photoURL: `https://avatars.dicebear.com/api/human/${seed}.svg`,
        }, { merge: true });
    }

    return (
        <div className="sidebar">
            <div className="sidebar__header">
                <div className="sidebar__headerInfo">
                    <Avatar src={`${userPhoto}`} />
                    <p>{username}</p>
                </div>

                <CasinoIcon onClick={genNewPhoto} />
            </div>

            <div className="sidebar__search">
                <div className="search__container">
                    <SearchOutlined />
                    <input placeholder="Search for a User" type="text" onChange={(e) => setSearchUser(e.target.value)} />
                </div>
            </div>

            <div className="sidebar__users">
                {
                    searchUsers.map(user => (
                        <UserTile key={user.username} user={user} onClick={onClick} />
                    ))
                }
            </div>

        </div>
    )
}

export default Sidebar
