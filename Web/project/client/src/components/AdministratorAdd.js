import React, {Component} from "react"
import {Redirect, Link} from "react-router-dom"
import Form from "react-bootstrap/Form"

import axios from "axios"

import LinkInClass from "../components/LinkInClass"

import {ACCESS_LEVEL_GUEST, ACCESS_LEVEL_ADMIN, SERVER_HOST} from "../config/global_constants"


export default class AdministratorAdd extends Component {
	
    constructor(props) {
		
        super(props)

        this.state = {
              username:""
            , password:""
            , redirectToAdministratorsList: sessionStorage.accessLevel < ACCESS_LEVEL_ADMIN
			, errorMessage: {}
			, logout: false
        }
    }


    componentDidMount() {
		
        this.inputToFocus.focus()        
    }
 
 
    handleChange = (e) =>  {
		
        this.setState({[e.target.name]: e.target.value})
    }
	
	validate = () => {
		
		let usernameValidation = this.state.username.length >= 5;
		let passwordValidation = this.state.password.length >= 8;
		
		this.setState({errorMessage: {
			  usernameError: usernameValidation ? null : 'username has to be at least 5 characters long'
			, passwordError: passwordValidation ? null : 'password has to be at least 8 characters long'
		}}) 
		return usernameValidation && passwordValidation;
	}



    handleSubmit = (e) =>  {
		
		e.preventDefault();		
		
		if (this.validate()){

			const adminObject = {
				  username: this.state.username
				, password: this.state.password
			}

			axios.defaults.withCredentials = true // needed for sessions to work
			axios.post(`${SERVER_HOST}/administrator`, adminObject)
			.then(res =>  {   
			
				if(res.data) {
					
					if (res.data.isLogged == false || res.data.isAdmin == false) {
					
						this.setState({logout: true});
						
						sessionStorage.clear() ;
						sessionStorage.username = "GUEST";
						sessionStorage.accessLevel = ACCESS_LEVEL_GUEST;
                    console.log('logout, server restart');
					}
					if (res.data.errorMessage) {
						
						console.log(res.data.errorMessage)  
						this.setState({errorMessage:res.data.errorMessage})  
						
					} else {   
					
						console.log("Record added")
						this.setState({redirectToAdministratorsList:true})
					} 
				} else {
					
					console.log("Record not added")
				}
			})
		}
    }


    render() {  
	
		document.title = 'Ecoville | Administrators'
        return (
		<div className="body_content">
		
			{this.state.logout ? <Redirect to="/Login"/> : null} 
            {this.state.redirectToAdministratorsList ? <Redirect to="/AdministratorsList"/> : null} 
				
			<div className="card_standard">
		
				<div className="card_title_container">
					<div className="card_standard card_title">
						<h2>Administrators | Add</h2>
					</div>
				</div>
		
				<table className="table table_create_edit">
					<tbody>
						<tr>
							<td>
								Username
							</td>
							<td>
								<input 
								ref = {(input) => { this.inputToFocus = input }}
								className="input" 
								type="text" 
								name="username"
								value={this.state.username}
								onChange={this.handleChange}
								/>
							</td>
							<td>
								<span className="error_msg">{this.state.errorMessage.usernameError}</span>
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
							<td>
								<span className="error_msg">{this.state.errorMessage.passwordError}</span>
							</td>
						</tr>
						
						
						
						<tr>
							<td>
								&nbsp;
							</td>
							<td>
								&nbsp;
							</td>
							<td>
								&nbsp;
							</td>
						</tr>
						<tr>
							<td>
								<LinkInClass className="linkInClass" value="Create" onClick={this.handleSubmit}/>
							</td>
							<td>
								&nbsp;
							</td>
							<td>
								&nbsp;
							</td>
						</tr>
						<tr>
							<td>
								<Link to={"/AdministratorsList"}>Back</Link>
							</td>
							<td>
								&nbsp;
							</td>
							<td>
								&nbsp;
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
        )
    }
}