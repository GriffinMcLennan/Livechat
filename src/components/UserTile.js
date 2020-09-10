import React from 'react';
import './UserTile.css';

function UserTile({ onClick, user: { username } }) {
    return (
        <div className="usertile" onClick={() => onClick(username)}>
            <h1>{username}</h1>
        </div>
    )
}

export default UserTile
