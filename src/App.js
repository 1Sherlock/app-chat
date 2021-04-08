import React, { useRef, useState } from 'react';

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/analytics';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

firebase.initializeApp({
    apiKey: "AIzaSyBK6gkmxLIoum36AYfxvxIJK7po9cjjQ1Y",
    authDomain: "chat-abccb.firebaseapp.com",
    projectId: "chat-abccb",
    storageBucket: "chat-abccb.appspot.com",
    messagingSenderId: "918681600587",
    appId: "1:918681600587:web:c2c649c26be106ea7ac3ce",
    measurementId: "G-703M78PGWQ"
})

const auth = firebase.auth();
const firestore = firebase.firestore();
const analytics = firebase.analytics();


function App() {

    const [user] = useAuthState(auth);

    return (
        <div >
            <SignOut />
            {user ? <ChatRoom /> : <SignIn />}
        </div>
    );
}

function SignIn() {

    const signInWithGoogle = () => {
        const provider = new firebase.auth.GoogleAuthProvider();
        auth.signInWithPopup(provider);
    }

    return (
        <>
            <button onClick={signInWithGoogle}>Sign in with Google</button>
        </>
    )

}

function SignOut() {
    return auth.currentUser && (
        <button onClick={() => auth.signOut()}>Sign Out</button>
    )
}


function ChatRoom() {
    const dummy = useRef();
    const messagesRef = firestore.collection('messages');
    const query = messagesRef.orderBy('createdAt').limit(25);

    const [messages] = useCollectionData(query, { idField: 'id' });

    const [formValue, setFormValue] = useState('');


    const sendMessage = async (e) => {
        e.preventDefault();

        const { uid, displayName } = auth.currentUser;

        await messagesRef.add({
            text: formValue,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            uid,
            displayName
        })

        setFormValue('');
        dummy.current.scrollIntoView({ behavior: 'smooth' });
    }

    return (<>
        <main>

            {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}

            <span ref={dummy} />

        </main>

        <form onSubmit={sendMessage} style={{marginTop: "30px"}}>

            <input value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="Type here" />

            <button type="submit" disabled={!formValue}>Enter</button>

        </form>
    </>)
}


function ChatMessage(props) {
    console.log(props)
    const { text, displayName } = props.message;

    return (<>
        <div style={{border: "1px solid #000", width: "300px", maxWidth: "100%", marginTop: "15px"}}>
            <h6 style={{margin: 0, textAlign: "right"}}>Author: {displayName}</h6>
            <p style={{margin: 0}}>{text}</p>
        </div>
    </>)
}


export default App;
