import React, { useEffect, useState, useRef } from 'react';
import './Chat.css';
import db from '../firebase';
import { useStateValue } from '../StateProvider';
import Message from './Message';
import SendIcon from '@material-ui/icons/Send';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import { Avatar } from '@material-ui/core';

function Chat({ selectedUser }) {
    const [{ user: username }, dispatch] = useStateValue();
    const [info, setInfo] = useState([]);
    const [input, setInput] = useState('');
    const [selectedUserPhoto, setSelectedUserPhoto] = useState('');
    const [lastSeen, setLastSeen] = useState('Not seen recently');
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }

    useEffect(scrollToBottom, [info]);

    useEffect(() => {
        setLastSeen('');
        setSelectedUserPhoto('');
        if (selectedUser === '') {
            return;
        }

        var docKey = getKey(username, selectedUser);
        var unsub1;

        async function getOrCreateRoom() {
            var doc = await db.collection('Chats').doc(docKey).get();

            if (!doc.exists) {
                await db.collection('Chats').doc(docKey).set({
                    messages: [],
                    senders: [],
                    timestamps: [],
                });
            }

            unsub1 = db.collection('Chats').doc(docKey).onSnapshot(snapshot => {
                let tmpDataObj = snapshot.data();
                let tmpInfo = [];
                let lastSeenInd = -1;

                for (let i = 0; i < tmpDataObj.messages.length; i++) {
                    let message = tmpDataObj.messages[i];
                    let sender = tmpDataObj.senders[i];
                    let timestamp = tmpDataObj.timestamps[i];

                    if (sender === selectedUser) {
                        lastSeenInd = i;
                    }

                    tmpInfo.push({ message, sender, timestamp });
                }

                if (lastSeenInd !== -1) {
                    setLastSeen(tmpDataObj.timestamps[lastSeenInd]);
                }
                else {
                    setLastSeen('Not seen recently');
                }

                setInfo(tmpInfo);
            });
        }

        getOrCreateRoom();
        let unsub2 = db.collection('Users').doc(selectedUser).onSnapshot(doc => {
            let data = doc.data();

            if (data.hasOwnProperty('photoURL')) {
                setSelectedUserPhoto(data.photoURL);
            }

        })

        return () => {
            if (unsub1) {
                unsub1();
            }

            if (unsub2) {
                unsub2();
            }
        }

    }, [selectedUser, username]);

    const getKey = (a, b) => {
        if (a <= b) {
            return a + b;
        }
        else {
            return b + a;
        }
    }

    const sendMessage = (e) => {
        e.preventDefault();

        if (selectedUser === '') {
            alert("Select a user first");
            return;
        }

        async function updateChat() {
            let docKey = getKey(username, selectedUser);
            let ref = await db.collection('Chats').doc(docKey).get();
            let oldData = ref.data();

            let messages = oldData.messages;
            let senders = oldData.senders;
            let timestamps = oldData.timestamps;

            messages.push(input);
            senders.push(username);
            timestamps.push(getDateTime());

            db.collection('Chats').doc(docKey).set({
                messages: messages,
                senders: senders,
                timestamps: timestamps,
            });

        }

        updateChat();
        setInput('');

    }

    const getDateTime = () => {
        let today = new Date();
        let month = padTime(today.getMonth() + 1);

        let day = padTime(today.getDate());

        let date = today.getFullYear() + '/' + month + '/' + day;

        let hours = today.getHours();
        var ampm;

        if (hours > 12) {
            hours -= 12;
            ampm = 'PM';
        }
        else {
            ampm = 'AM';
        }

        if (hours === 0) {
            hours = 12;
        }

        let minutes = padTime(today.getMinutes());
        let seconds = padTime(today.getSeconds());
        let time = hours + ":" + minutes + ":" + seconds + ampm;
        return time + ' ' + date;
    }

    const padTime = (time) => {
        if (time < 10) {
            time = '0' + time;
        }

        return time;
    }

    return (
        <div className="chat">
            <div className="chat__header">
                {
                    selectedUser ? (
                        <div className="selectedUser__info">
                            <Avatar src={`${selectedUserPhoto}`} />
                            <h1>{selectedUser}</h1>

                            {
                                lastSeen === 'Not seen recently' || lastSeen === '' ? (
                                    <h4>{lastSeen}</h4>
                                ) : (
                                        <h4>Last seen at: {lastSeen} </h4>
                                    )
                            }

                        </div>
                    ) : (
                            <div className="selectedUser__info" />
                        )
                }
            </div>

            <div className="chat__messages">
                {
                    info.map(tuple => (
                        <Message key={`${tuple.timestamp}${tuple.message}`} message={tuple.message} timestamp={tuple.timestamp} sender={tuple.sender} username={username} />
                    ))
                }
                <div ref={messagesEndRef} />
            </div>

            <div className="chat__input">
                <form className="chat__form" onSubmit={(e) => sendMessage(e)}>
                    <FormControl className="chat__formControl">
                        <TextField
                            className="chat__textField"
                            style={{ width: 300, marginTop: "auto" }}
                            value={input}
                            placeholder="Enter a message"
                            type="text"
                            onChange={(e) => setInput(e.target.value)}
                        />

                        <IconButton
                            className="chat__iconButton"
                            disabled={!input}
                            variant="contained"
                            color="primary"
                            onClick={(e) => sendMessage(e)}>
                            <SendIcon />
                        </IconButton>
                    </FormControl>

                </form>
            </div>
        </div>
    )
}

export default Chat
