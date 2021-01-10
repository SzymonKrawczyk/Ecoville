import React, {Component} from "react"
import {Redirect, Link} from "react-router-dom"
import axios from "axios"

import LinkInClass from "../components/LinkInClass"
import {SERVER_HOST} from "../config/global_constants"


export default class Login extends Component
{
    constructor(props)
    {
        super(props)
        
        this.state = {
            email:"",
            password:"",
            isLoggedIn:false,
            errorMessage:""
        }
    }
    
    
    handleChange = (e) => 
    {
        this.setState({[e.target.name]: e.target.value})
    }
    
    
    handleSubmit = (e) => 
    {
        axios.defaults.withCredentials = true // needed for sessions to work
        axios.post(`${SERVER_HOST}/login/${this.state.email}/${this.state.password}`)
        .then(res => 
        {     
            if(res.data)
            {
                if (res.data.errorMessage)
                {
                    console.log(res.data.errorMessage)    
                    this.setState({isLoggedIn:false, errorMessage:res.data.errorMessage})
                }
                else // user successfully logged in
                { 
                    console.log("User logged in")
                    
                    sessionStorage.name = res.data.email
                    sessionStorage.accessLevel = res.data.accessLevel
                    
                    this.setState({isLoggedIn:true})
                }        
            }
            else
            {
                console.log("Login failed")
            }
        })                
    }


    render()
    {            
        return (
            <form className="form-container" noValidate = {true} id = "loginOrRegistrationForm">
                <h2>Login</h2>
                
                {this.state.isLoggedIn ? <Redirect to="/DisplayAllCars"/> : null} 
                
                <input 
                    type = "email" 
                    name = "email" 
                    placeholder = "Email"
                    autoComplete="email"
                    value={this.state.email} 
                    onChange={this.handleChange}
                /><br/>
                    
                <input 
                    type = "password" 
                    name = "password" 
                    placeholder = "Password"
                    autoComplete="password"
                    value={this.state.password} 
                    onChange={this.handleChange}
                /><br/>
				<b>{this.state.errorMessage} </b>
				<br/>
				<br/>
                
                <LinkInClass value="Login" className="green-button" onClick={this.handleSubmit}/> 
                <Link className="red-button" to={"/DisplayAllCars"}>Cars</Link>                                      
            </form>
        )
    }
}