import React, {Component} from "react"
import {Redirect, Link} from "react-router-dom"
import axios from "axios"

import LinkInClass from "../components/LinkInClass"

import {ACCESS_LEVEL_GUEST, ACCESS_LEVEL_ADMIN, SERVER_HOST} from "../config/global_constants"

export default class AdministratorEdit extends Component  {
	
    constructor(props)  {
        super(props)
		console.log("const edit")
        this.state = {
              username: ``
			, errorMessage: {}
			, redirectToAdministratorsList: sessionStorage.accessLevel < ACCESS_LEVEL_ADMIN
			, logout: false
        }
    }

    componentDidMount() { 
	
        this.inputToFocus.focus()
  
        axios.defaults.withCredentials = true // needed for sessions to work
        axios.get(`${SERVER_HOST}/administrator/${this.props.match.params.id}`)
        .then(res =>  {    
		
            if(res.data) {
				
				if (res.data.isLogged == false || res.data.isAdmin == false) {
					
					this.setState({logout: true});
					
					sessionStorage.clear();
                    sessionStorage.username = "GUEST";
                    sessionStorage.accessLevel = ACCESS_LEVEL_GUEST;
					
                    console.log('logout, server restart');
				}
				
                if (res.data.errorMessage) {
					
					console.log(res.data.errorMessage);
                    this.setState({
                        errorMessage: res.data.errorMessage
                    });
					
                } else { 
				
                    this.setState({
                        username: res.data.username
                    });
                }
				
            } else {
				
                console.log(`Record not found`);
            }
        })
    }


    handleChange = (e) =>  {
		
        this.setState({[e.target.name]: e.target.value})
    }


    handleSubmit = (e) =>  {
		
        e.preventDefault();

        const adminObject = {
            username: this.state.username
        };

        axios.defaults.withCredentials = true // needed for sessions to work
        axios.put(`${SERVER_HOST}/administrator/${this.props.match.params.id}`, adminObject)
        .then(res =>  {    
		
            if(res.data) {
				
				if (res.data.isLogged == false || res.data.isAdmin == false) {
					
					this.setState({logout: true});
					
					sessionStorage.clear() 
                    sessionStorage.username = "GUEST"
                    sessionStorage.accessLevel = ACCESS_LEVEL_GUEST
				}
                if (res.data.errorMessage) {
					
					console.log(res.data.errorMessage);
                    this.setState({
                        errorMessage: res.data.errorMessage
                    });
					
                } else {  
				
                    console.log(`Record updated`)
                    this.setState({redirectToAdministratorsList:true})
                }
            } else {
                console.log(`Record not updated`)
            }
        })
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
						<h2>Administrators | Edit</h2>
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
								className="input" 
								type="text" 
								name="username" 
								ref = {(input) => { this.inputToFocus = input }}
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
								<LinkInClass className="linkInClass" value="Save" onClick={this.handleSubmit}/>
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