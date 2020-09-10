import React from 'react';
import './Message.css';

function Message({ message, sender, timestamp, username }) {
    return (
        <div className="message">
            <div className={`message__sender ${sender === username && "message__receiver"}`}>
                <span className="message__from">
                    {sender}
                </span>

                <div className="message__content">
                    <p>{message}</p>
                    <div className="message__timestamp">
                        <p>{timestamp}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Message
