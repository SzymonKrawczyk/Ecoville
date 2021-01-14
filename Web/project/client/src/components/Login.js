import React, {Component} from "react"
import {Redirect, Link} from "react-router-dom"
import axios from "axios"

import LinkInClass from "../components/LinkInClass"
import {SERVER_HOST} from "../config/global_constants"

import {ACCESS_LEVEL_ADMIN} from "../config/global_constants"

export default class Login extends Component
{
    constructor(props)
    {
        super(props)
        
        this.state = {
            username:"",
            password:"",
            isLoggedIn:false,
            errorMessage:""
        }
    }
    
	validate = () => {
		const isUsernameGood = this.state.username.length > 0;
		const isPasswordGood = this.state.password.length > 0;
		//console.log(isUsernameGood)
		//console.log(isPasswordGood)
		return (isUsernameGood && isPasswordGood);
	}
    
    handleChange = (e) => 
    {
        this.setState({[e.target.name]: e.target.value})
		//console.log(this.validate())
		
    }   
	
    
    handleSubmit = (e) => 
    {
		
        e.preventDefault()
		if (this.validate()){
		
			axios.defaults.withCredentials = true // needed for sessions to work
			axios.post(`${SERVER_HOST}/login/${this.state.username}/${this.state.password}`)
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
						
						sessionStorage.username = res.data.username
						sessionStorage.accessLevel = res.data.accessLevel
						
						this.setState({isLoggedIn:true})
					}        
				}
				else
				{
					console.log("Login failed")
				}
			}) 
		} else {
			this.setState({errorMessage:"Fields cannot be empty"})
		}			
    }


    render()
    {       
		document.title = 'Ecoville | Login';
		console.log(`login: acces level: ${sessionStorage.accessLevel}, isLoggedIn: ${this.state.isLoggedIn}`)
        return (
		
			<div className="body_content">
				
				{sessionStorage.accessLevel >= ACCESS_LEVEL_ADMIN && this.state.isLoggedIn ? <Redirect to="/Panel"/> : null }
		 
				<div className="card_standard card_login">
		
					<div className="card_title_container">
						<div className="card_standard card_title">
							<h2>Ecoville admin panel</h2>
						</div>
					</div>
		
						<table className="table table_login">
						<tbody>
							<tr>
								<td>
									Username
								</td>
								<td>
									<input 
										className="input" 
										type="text" 
										name="username"
										value={this.state.username} 
										onChange={this.handleChange}
									/>
								</td>
							</tr>
							<tr>
								<td>
									Password
								</td>
								<td>
									<input 
										className="input" 
										type="password" 
										name="password"
										value={this.state.password} 
										onChange={this.handleChange}
									/>
								</td>
							</tr>
							<tr>
								<td>
									
								</td>
								<td>
									<input className="button" defaultValue="Login" onClick={this.handleSubmit} readOnly/>
								</td>
							</tr>
							<tr>
								<td></td>
								<td>
									<span className="error_msg">{this.state.errorMessage}</span>
								</td>
							</tr>
							</tbody>
						</table>
				</div>
			</div>            
        )
    }
}