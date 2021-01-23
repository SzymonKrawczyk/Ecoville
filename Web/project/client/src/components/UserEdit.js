import React, {Component} from "react"
import {Redirect, Link} from "react-router-dom"
import Form from "react-bootstrap/Form"

import axios from "axios"

import LinkInClass from "../components/LinkInClass"

import {ACCESS_LEVEL_GUEST, ACCESS_LEVEL_ADMIN, SERVER_HOST} from "../config/global_constants"

export default class UserEdit extends Component {
    constructor(props) {
		
        super(props)

        this.state = {
              firstName:""
			, lastName:""
			, email:""
            , currentPoints: 0
            , totalPointsSum: 0
			, created: null
			, createdString: ""
            , totalPoints: []
			, trophies: []
            , redirectToUsersList: sessionStorage.accessLevel < ACCESS_LEVEL_ADMIN
			, errorMessage: {}
			, logout: false
			, addPoints: 0
        }
    }


    componentDidMount() {
		
		this.inputToFocus.focus()   
		
		axios.defaults.withCredentials = true // needed for sessions to work
        axios.get(`${SERVER_HOST}/user/${this.props.match.params.id}`)
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
					console.log(res.data)
					

					const d = new Date(res.data.created._seconds * 1000);
		            const dateString = ("0" + d.getDate()).slice(-2) + "/" + ("0"+(d.getMonth()+1)).slice(-2) + "/" +
		                d.getFullYear() + " " + ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2);


                    this.setState({		
						firstName: res.data.firstName,
						lastName: res.data.lastName,
						email: res.data.email,
						currentPoints: res.data.currentPoints,
						totalPointsSum: res.data.totalPointsSum,
						created: res.data.created,
						createdString: dateString,
						totalPoints: res.data.totalPoints,
						trophies: res.data.trophies,
						_id: res.data._id
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
	
	validate = () => {
        
        let firstNameValidation = this.state.firstName.length >=3;
        let lasstNameValidation = this.state.lastName.length >= 3;
		
		this.setState({errorMessage: {
              firstNameError: firstNameValidation ? null : 'first name has to be at least 3 characters long',
              lastNamenError: lasstNameValidation ? null : 'last name has to be at least 3 characters long',
		}}) 
        return firstNameValidation && lasstNameValidation;
	}



    handleSubmit = (e) =>  {
		
		e.preventDefault();		
		
		if (this.validate()){


			const userObject = {
                    firstName: this.state.firstName
                  , lastName: this.state.lastName
			}

			axios.defaults.withCredentials = true // needed for sessions to work
			axios.put(`${SERVER_HOST}/user/${this.props.match.params.id}`, userObject)
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
						this.setState({redirectToUsersList:true})
					} 
				} else {
					console.log("Record not added")
				}
			})
		}
    }

    render() {  
    
		document.title = 'Users | Edit'
        return (

		<div className="body_content">
		
			{this.state.logout ? <Redirect to="/Login"/> : null} 
            {this.state.redirectToUsersList ? <Redirect to="/UsersList"/> : null} 
				
			<div className="card_standard">
		
				<div className="card_title_container">
					<div className="card_standard card_title">
						<h2>Users | Edit</h2>
					</div>
				</div>
		
				<table className="table table_create_edit">
				<tbody>
					<tr>
						<td>
							First Name
						</td>
						<td>
							<input 
							className="input" 
							type="text" 
							name="firstName" 
							ref = {(input) => { this.inputToFocus = input }}
							value={this.state.firstName}
							onChange={this.handleChange}/>
						</td>
						<td>
							<span className="error_msg">{this.state.errorMessage.firstNameError}</span>
						</td>
					</tr>
					<tr>
						<td>
							Last Name
						</td>
						<td>
							<input 
							className="input" 
							type="text" 
							name="lastName" 
							value={this.state.lastName}
							onChange={this.handleChange}/>
						</td>
						<td>
							<span className="error_msg">{this.state.errorMessage.lastNamenError}</span>
						</td>
					</tr>
					<tr>
						<td>
							Email
						</td>
						<td>
							{this.state.email}
						</td>
					</tr>
					<tr>
						<td>
							Current Points
						</td>
						<td>
							{this.state.currentPoints}
						</td>
					</tr>

					<tr>
						<td>
							Total points sum
						</td>
						<td>
							{this.state.totalPointsSum}
						</td>
					</tr>

					<tr>
						<td>
							Add points
						</td>
						<td>
							<input 
							className="input" 
							type="number" 
							name="addPoints" 
							value={this.state.addPoints}
							onChange={this.handleChange}/>
						</td>
						<td><Link to={"/UserAddPoints/" + this.state._id + "/" + this.state.addPoints}>Confirm</Link></td>
					</tr>

					<tr>
						<td>
							Total Points
						</td>
						<td>
							<table className="table table_user_spec">
								<tbody>
									<tr>
										<td>
											<table className="table table_user_spec">
												<tbody>
													{this.state.totalPoints.map((category) => 
									
														<tr key={category._id}>
														<td>{category.name}</td>
														<td>{category.points}</td>
														</tr>)
													}
												</tbody>
											</table>
										</td>
									</tr>
								</tbody>
							</table>
						</td>

					</tr>

					<tr>
						<td>
							Trophies
						</td>
						<td>
							<table className="table table_user_spec">
								<tbody>
									<tr>
										<td>
											<table className="table table_user_spec">
												<tbody>
													{this.state.trophies.map((trophy) => 
									
														<tr key={trophy._id}>
														<td>{trophy.name}</td>
														<td><Link to={"/UserDeleteTrophy/" + this.state._id + "/" + trophy._id}>Delete</Link></td>
														</tr>)
													}
												</tbody>
											</table>
										</td>
									</tr>
								</tbody>
							</table>
						</td>
						<td></td>
					</tr>
					
					<tr>
						<td>
							Created
						</td>
						<td>
							{this.state.createdString}
						</td>
						<td></td>
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
						<Link to={"/UsersList"}>Back</Link>
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