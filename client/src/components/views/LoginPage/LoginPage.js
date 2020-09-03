import React, {useState} from 'react';
import axios from 'axios';

import {useDispatch } from 'react-redux';
import {loginUser} from '../../../_actions/user_action';


function LoginPage(props){

    const dispatch = useDispatch();

    const [Email, setEmail] = useState("")
    const [Password, setPassword] = useState("")

    // onChange 메소드를 사용해서 state 값을 변경시켜서 값을 입력할 수 있도록
    const onEmailHandler = (event) => {
        setEmail(event.currentTarget.value)
    }
    const onPasswordHandler = (event) => {
        setPassword(event.currentTarget.value)
    }
    const onSubmitHandler = (event) =>{
        event.preventDefault();

        let body = {
            email: Email,
            password: Password
        }

        dispatch(loginUser(body))
            .then(response => {
                if(response.payload.loginSuccess){
                    props.history.push('/')
                } else{
                    alert('error')
                }
            })

    }

    return(
        <div style={{
            display: 'flex', justifyContent: 'center', alignItems:'center',
            width:'100%', height:'100vh'
        }} >
            <form style={{ display:'flex', flexDirection:'column'}}
                onSubmit={onSubmitHandler}
            >
                <label>Email</label>
                <input type = "email" value={Email} onChange={onEmailHandler}/>  
                <label>Password</label>
                <input type = "password" value={Password} onChange={onPasswordHandler}/>

                <br />
                <button>
                    Login
                </button>
            </form>

        </div>
    )
}

export default LoginPage