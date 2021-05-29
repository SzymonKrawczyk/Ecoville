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
			, profilePic: "default.jpg"
            , redirectToUsersList: sessionStorage.accessLevel < ACCESS_LEVEL_ADMIN
			, errorMessage: {}
			, logout: false
			, addPoints: 0
			, ban: ""
			, banDate: ""
			, gadgets: []
			, canSubmit: true
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
						
						
					let dateString2 = "";
						
					if (res.data.ban){
						const d2 = new Date(res.data.ban._seconds * 1000);
						dateString2 = ("0" + d2.getDate()).slice(-2) + "/" + ("0"+(d2.getMonth()+1)).slice(-2) + "/" +
						d2.getFullYear() + " " + ("0" + d2.getHours()).slice(-2) + ":" + ("0" + d2.getMinutes()).slice(-2) + ":" + ("0" + d2.getSeconds()).slice(-2);
					}

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
						gadgets: res.data.gadgets,
						ban: dateString2,
						_id: res.data._id
                    });
					
					let tempPic = res.data.profilePic;
					//console.log(tempPic);
					if (tempPic != null && typeof(tempPic) != 'undefined') {this.setState({ profilePic: res.data.profilePic});}
					console.log(`pic: ${SERVER_HOST}/userImg/${this.state.profilePic}`)
                }
				
            } else {
				
                console.log(`Record not found`);
            }
        })
		
    }
 
 
    handleChange = (e) =>  {
        this.setState({[e.target.name]: e.target.value})
    }
	
	handlePointsChange = (e) =>  {

		console.log(this.state.currentPoints)
		console.log(parseInt(e.target.value) + parseInt(this.state.currentPoints))

		if( parseInt(e.target.value) + parseInt(this.state.currentPoints) < 0 ){
			this.setState({[e.target.name]: -1 * parseInt(this.state.currentPoints)})
			this.setState({errorMessage: {
				pointsError: 'Result has to be greater than 0',
		  }
		}) 
		}else{
			this.setState({[e.target.name]: e.target.value})
			this.setState({errorMessage: {
				pointsError: '',
		  }}) 
		}
    }
	

	validate = () => {
		
		for (var key in this.state) {
			if (typeof(this.state[key]) == 'string'){
				this.state[key] = this.state[key].trim();
			}
		}
        
        let firstNameValidation = this.state.firstName.length >=3;
        let lasstNameValidation = this.state.lastName.length >= 3;
		
		this.setState({errorMessage: {
              pointsError: firstNameValidation ? null : 'first name has to be at least 3 characters long',
              lastNamenError: lasstNameValidation ? null : 'last name has to be at least 3 characters long',
		}}) 
        return firstNameValidation && lasstNameValidation;
	}
	
	toggleDeleteVisibility = () => {
		let div = document.getElementById("deleteVisibilityDiv");
		div.style.display = div.style.display == "none" ? "block" : "none";
	}
	
	toggleDeleteVisibility2 = () => {
		let div = document.getElementById("deleteVisibilityDiv2");
		div.style.display = div.style.display == "none" ? "block" : "none";
	}
	
	validateBanDate = () => {
		
		let banValidation = true;
		
		const paragraph = this.state.ban;
		const regex = /(\d{2})/g;
		const found = paragraph.match(regex);
		if (found != null && found.length == 7) {
			
			let date = new Date();
			
			if (found[0] > 31) banValidation = false;
			else date.setDate(found[0]);
			
			if (found[1] > 12 || found[1] < 1) banValidation = false;
			else date.setMonth(found[1]-1);
			
			if ((parseInt(found[2])*100 + parseInt(found[3])) < 2000) banValidation = false;
			else date.setFullYear(parseInt(found[2])*100 + parseInt(found[3]));
			
			if (found[4] > 24) banValidation = false;
			else date.setHours(found[4]);
			
			if (found[5] > 60) banValidation = false;
			else date.setMinutes(found[5]);
			
			if (found[6] > 60) banValidation = false;
			else date.setSeconds(found[6]);
			
			
			this.state.banDate = Date.parse(date);
			
		} else {
			//console.log(found);
			banValidation = false;
		}
		
		this.setState({errorMessage: {
              banError: banValidation ? null : 'date in format dd/mm/yyyy hh:mm:ss is required'
		}}) 
		
		return banValidation;
	}

	handleSubmitBan = (e) =>  {
		


		e.preventDefault();		
		
		if (this.validateBanDate() && this.state.canSubmit){

			this.state.canSubmit = false;

			const sendObj = {
                    ban: this.state.banDate
			}

			axios.defaults.withCredentials = true // needed for sessions to work
			axios.put(`${SERVER_HOST}/userTempBan/${this.props.match.params.id}`, sendObj)
			.then(res =>  {   
			
				this.state.canSubmit = true;

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
					
						console.log("Ban added")
						this.setState({errorMessage: {
							 banError: 'Action successful'
						}}) 
						//this.setState({redirectToUsersList:true})
					} 
				} else {
					console.log("Ban not added")
				}
			})
		}
    }

    handleSubmit = (e) =>  {
		


		e.preventDefault();		
		
		if (this.validate() && this.state.canSubmit){

			this.state.canSubmit = false;

			const userObject = {
                    firstName: this.state.firstName
                  , lastName: this.state.lastName
			}

			axios.defaults.withCredentials = true // needed for sessions to work
			axios.put(`${SERVER_HOST}/user/${this.props.match.params.id}`, userObject)
			.then(res =>  {   
			
				this.state.canSubmit = true;

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
							Modify current points
						</td>
						<td>
							<table className="table table_user_spec">
								<tbody>
									<tr>
										<td>
											<table className="table table_user_spec">
												<tbody>
													<tr>
														<td>
															<input 
															className="input" 
															type="number" 
															name="addPoints" 
															value={this.state.addPoints}
															onChange={this.handlePointsChange}/>
														</td>
														<td>
															<Link to={"/UserAddPoints/" + this.state._id + "/" + this.state.addPoints}>Confirm</Link>
														</td>
													</tr>
												</tbody>
											</table>
										</td>
									</tr>
								</tbody>
							</table>
							
						</td>
						<td>
							<span className="error_msg">{this.state.errorMessage.pointsError}</span>
						</td>
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
							Gadgets
						</td>
						<td>
							<table className="table table_user_spec">
								<tbody>
									<tr>
										<td>
											<table className="table table_user_spec">
												<tbody>
													{
														this.state.gadgets.map((gadget) => 
										
															<tr key={gadget._id}>
																<td>
																	<img className="userGadgetPic" src={SERVER_HOST + "/gadgets/" + gadget.pic} alt="Gadget Picture"/>									
																	<div className="userGadgetName">{gadget.name}</div>
																</td>
																<td>
																	{ gadget.collected ? "Redeemed!" : <Link to={"/UserRedeemGadget/" + this.state._id + "/" + gadget._id}>Confirm Redeem</Link>}
																</td>
															</tr>
														)
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
							Profile Picture
						</td>
						<td>
							<img className="userProfilePic" src={SERVER_HOST + "/userImg/" + this.state.profilePic} alt="Profile Picture"/>
						</td>
						<td>
							{ this.state.profilePic != "default.jpg" ? <Link to={"/UserDeletePic/" + this.state._id}>Delete</Link> : ""}						
						</td>
					</tr>
					
					<tr>
						<td>
							Posts
						</td>
						<td>
							<LinkInClass className="linkInClass" value="Delete all posts created by this user" onClick={this.toggleDeleteVisibility2}/><br/>
							<div id="deleteVisibilityDiv2" style={{display: 'none', marginLeft: '30px'}}>
								Are you sure? This action can't be reversed!<br/>
								<Link to={"/UserDeletePosts/" + this.state._id}>Yes</Link>&nbsp;&nbsp;&nbsp;&nbsp;<LinkInClass className="linkInClass" value="No" onClick={this.toggleDeleteVisibility2}/>
							</div>
						</td>
						
						<td></td>
					</tr>
					
					<tr>
						<td>
							Ban user until:
						</td>
						<td>							
							<table className="table table_user_spec">
								<tbody>
									<tr>
										<td>
											<table className="table table_user_spec">
												<tbody>
													<tr>
														<td>
															<input 
																className="input" 
																type="text" 
																name="ban" 								
																value={this.state.ban}
																onChange={this.handleChange}
															/>
														</td>
														<td>
															<LinkInClass className="linkInClass" value="Confirm" onClick={this.handleSubmitBan}/>
														</td>
													</tr>
												</tbody>
											</table>
										</td>
									</tr>
								</tbody>
							</table>
						</td>
						<td>
							<span className="error_msg">{this.state.errorMessage.banError}</span>
						</td>
					</tr>
					
					<tr>
						<td>
							Permament ban
						</td>
						<td>
							<LinkInClass className="linkInClass" value="Delete User Permamently" onClick={this.toggleDeleteVisibility}/><br/>
							<div id="deleteVisibilityDiv" style={{display: 'none', marginLeft: '30px'}}>
								Are you sure? This action can't be reversed!<br/>
								<Link to={"/UserDelete/" + this.state._id}>Yes</Link>&nbsp;&nbsp;&nbsp;&nbsp;<LinkInClass className="linkInClass" value="No" onClick={this.toggleDeleteVisibility}/>
							</div>
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