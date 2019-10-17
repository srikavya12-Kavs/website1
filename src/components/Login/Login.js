import React, { Component } from 'react'
import { Link, Redirect } from 'react-router-dom'
import './Login.css'
import EmailInput from './LoginComponents/EmailInput'
import PasswordInput from './LoginComponents/PasswordInput'
import LoginButton from './LoginComponents/LoginButton'




class Login extends Component {
    constructor(props){
        super(props)
        this.state = {
            email: '',
            usertype: 'user',
            redirect: false,
            authenticated: false
        }

        this.updateEmail = this.updateEmail.bind(this)

    }

    updateEmail(email){
        this.setState({
            email: email,
        })
        console.log(email);
    }


    validateEmail(){
        const email = this.state.email.trim();
        if(email.length < 3 || email.length > 40){
            console.log('email must be between 3 and 40 characters')
            return 'email must be between 3 and 40 characters'
            
        }
    }


    handleSubmit = (e) => {
        e.preventDefault();
        //define user data object
        const authUser = {
            "email": e.target.email.value,
            "password": e.target.password.value
        }
        //call API to post registered users
        const url = 'https://crmmia-api.herokuapp.com/api/users/login'
        const options = {
            method: 'POST',
            body: JSON.stringify(authUser),
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        }
        //fetch data from /users/login enpoint
        fetch(url, options)
        .then(res => {
            console.log(res);
            //throw error if user is not authenticated
            if(!res.ok){
                throw new Error('user not authenticated');
            }
            //set App.js authentication state to true
            this.props.isAuthenticated(true);
            return res.json();
        })
        .then(resJson => {
            console.log(resJson);
            //set Login.js authentication state to true
            this.props.handleUserType(resJson.usertype);
            this.setState({
                email: resJson.email,
                usertype: resJson.usertype,
                authenticated: true
            })
            if (this.state.authenticated){
                localStorage.setItem('email', this.state.email)
            }
        })
        .catch(err => {
            console.log(err)
        })
      
    }


        

    render(){
        //redirect authenticated user to their homepage
        if(this.state.authenticated && this.state.usertype === 'user') {
            return <Redirect to='/user-home' />
        } else if (this.state.authenticated && this.state.userype === 'admin'){
            return <Redirect to='admin-home' />
        }
        return (
            <>
      
            <div className='login-container'>
                <h1>Enter your Login information</h1>
                <div className='margin-container'>
                    <div className='error-message'></div>
                    <form onSubmit={(e) => this.handleSubmit(e)}>
                        <div className='form-group'>
                            <label htmlFor='email'></label>
                            <EmailInput 
                                updateEmail={(e) => this.updateEmail(e.target.value)}
                            />
                        </div>
                        
                        <div className='form-group'>
                            <label htmlFor="password"></label>
                            <PasswordInput />
                        </div>
                        <div className='form-group'>
                            <LoginButton
                                text='Log In'
                            />
                        </div>
                    </form>
                    <div className='password-controls'>
                        <p>
                            Don't have an account?&nbsp;
                            <Link to='/select-account-type' style={{color: 'green'}}>
                                Sign up now!
                            </Link>
                        </p>
                        <p className='forgot-password'>
                            Forgot password?&nbsp;
                            <Link to='/forgot-password' style={{color: 'green'}}>
                                Reset password
                            </Link>
                        </p>
                    </div>
                </div>
                
            </div>
            </>
        )
    }
}

export default Login

