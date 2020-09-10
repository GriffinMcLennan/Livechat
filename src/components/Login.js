import React, { useState } from 'react';
import './Login.css';
import { TextField } from '@material-ui/core';
import { Button } from '@material-ui/core';
import { useStateValue } from '../StateProvider';
import { actionTypes } from '../reducer';
import db from '../firebase';

function Login() {
    const [{user}, dispatch] = useStateValue();
    const [input, setInput] = useState('');

    const signIn = (e) => {
        e.preventDefault();

        dispatch({
            type: actionTypes.SET_USER,
            user: input,
        });

        db.collection('Users').doc(input).set({
            username: input,
        }, { merge: true });
        
    }

    return (
        <div className="container">
            <div className="container__box">
                <h1>Livechat</h1>
                
                <div className="signin">
                    <form noValidate autoComplete="off" onSubmit={(e) => signIn(e)}>
                        <TextField id="standard-basic" label="Name:" onChange={(e) => setInput(e.target.value)}/>
                    </form>  

                    <Button onClick={(e) => signIn(e)}>Sign in</Button>
                </div>  
            </div>
            
        </div>
    )
}

export default Login;
