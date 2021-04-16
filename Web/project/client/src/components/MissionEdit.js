import React, {Component} from "react"
import {Redirect, Link} from "react-router-dom"
import axios from "axios"

import LinkInClass from "../components/LinkInClass"

import {ACCESS_LEVEL_GUEST, ACCESS_LEVEL_ADMIN, SERVER_HOST} from "../config/global_constants"

export default class MissionEdit extends Component  {
	
    constructor(props)  {
        super(props)
		console.log("const edit")
        this.state = {
			  _id: ""
            , name: ""
            , id_category: ""
			, categories: []
			, points: 0
			, when: null
			, whenString: ""
			, durationMinutes: 0
			, location: ""
			, decription: ""
			, requiredParticipants: 0
			, currentParticipants: []
            , redirectToMissionsList: sessionStorage.accessLevel < ACCESS_LEVEL_ADMIN
			, errorMessage: {}
			, logout: false
			, canSubmit: true
        }
    }

    componentDidMount() { 
	
        this.inputToFocus.focus()
  
        axios.defaults.withCredentials = true // needed for sessions to work
        axios.get(`${SERVER_HOST}/mission/${this.props.match.params.id}`)
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
					
					const d = new Date(res.data.when._seconds * 1000);
					const dateString = ("0" + d.getDate()).slice(-2) + "/" + ("0"+(d.getMonth()+1)).slice(-2) + "/" +
					d.getFullYear() + " " + ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2) + ":" + ("0" + d.getSeconds()).slice(-2);
					
					const d2 = new Date(res.data.added._seconds * 1000);
					const dateString2 = ("0" + d2.getDate()).slice(-2) + "/" + ("0"+(d2.getMonth()+1)).slice(-2) + "/" +
					d2.getFullYear() + " " + ("0" + d2.getHours()).slice(-2) + ":" + ("0" + d2.getMinutes()).slice(-2) + ":" + ("0" + d2.getSeconds()).slice(-2);
					
					let tempParticipants = res.data.currentParticipants;
					function compareParticipants( a, b ) {
					  if ( a.confirmed && !b.confirmed ){
						return 1;
					  }
					  if ( !a.confirmed && b.confirmed ){
						return -1;
					  }
					  return 0;
					}

					tempParticipants.sort( compareParticipants );
					
                    this.setState({
						  _id: res.data._id
						, name: res.data.name
						, id_category: res.data.id_category
						, categories: res.data.categories
						, points: res.data.points
						, when: res.data.when
						, whenString: dateString
						, durationMinutes: res.data.durationMinutes
						, location: res.data.location
						, description: res.data.description
						, requiredParticipants: res.data.requiredParticipants
						, currentParticipants: tempParticipants
						, added: res.data.added
						, addedString: dateString2
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
		
		for (var key in this.state) {
			if (typeof(this.state[key]) == 'string'){
				this.state[key] = this.state[key].trim();
			}
		}
		
		let nameValidation = this.state.name.length >= 5;
		
		let categoryValidation = false;
		if (this.state.categories){
			for (let i = 0; i < this.state.categories.length; ++i) {
				
				if (this.state.id_category == this.state.categories[i]._id) {
					categoryValidation = true;
					break;
				}
			}			
		}
		
		let pointsValidation = this.state.points > 0;
		
		let dateValidation = true;
		const paragraph = this.state.whenString;
		const regex = /(\d{2})/g;
		const found = paragraph.match(regex);
		if (found != null && found.length == 7) {
			
			let date = new Date();
			
			if (found[0] > 31) dateValidation = false;
			else date.setDate(found[0]);
			
			if (found[1] > 12 || found[1] < 1) dateValidation = false;
			else date.setMonth(found[1]-1);
			
			if ((parseInt(found[2])*100 + parseInt(found[3])) < 2000) dateValidation = false;
			else date.setFullYear(parseInt(found[2])*100 + parseInt(found[3]));
			
			if (found[4] > 24) dateValidation = false;
			else date.setHours(found[4]);
			
			if (found[5] > 60) dateValidation = false;
			else date.setMinutes(found[5]);
			
			if (found[6] > 60) dateValidation = false;
			else date.setSeconds(found[6]);
			
			
			if (date <= new Date()) dateValidation = false;
			else this.state.when = Date.parse(date);
			
			//console.log(date)
			//console.log(this.state.when)
			
			
		} else {
			//console.log(found);
			dateValidation = false;
		}
		
		let durationValidation = this.state.durationMinutes > 0;
		
		let locationValidation = this.state.location.length < 3 && this.state.location.length > 0;
		
		let descriptionValidation = this.state.description.trim().length >= 16;
		
		
		this.setState({errorMessage: {
			  nameError: nameValidation ? null : 'name has to be at least 5 characters long'
			, categoryError: categoryValidation ? null : 'category is required'
			, pointsError: pointsValidation ? null : 'points value has to be greater than 0'
			, dateError: dateValidation ? null : 'future date in format dd/mm/yyyy hh:mm:ss is required'
			, durationError: durationValidation ? null : 'duration value has to be greater than 0'
			, locationError: locationValidation ? null : 'location name has to be shorter than 3 characters'
			, descriptionError: descriptionValidation ? null : 'description has to be at least 16 characters long'
		}}) 
		return nameValidation && categoryValidation && pointsValidation && dateValidation && durationValidation && locationValidation && descriptionValidation;
	
	}


    handleSubmit = (e) =>  {
		
        e.preventDefault();
		
		if (this.validate() && this.state.canSubmit){

			this.state.canSubmit = false;

			const missionObject = {
				  name: this.state.name
				, id_category: this.state.id_category
				, points: this.state.points
				, when: this.state.when
				, durationMinutes: this.state.durationMinutes
				, location: this.state.location
				, description: this.state.description
				, requiredParticipants: this.state.requiredParticipants
			};

			axios.defaults.withCredentials = true // needed for sessions to work
			axios.put(`${SERVER_HOST}/mission/${this.props.match.params.id}`, missionObject)
			.then(res =>  {    
			
				this.state.canSubmit = true;

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
						this.setState({redirectToMissionsList:true})
					}
				} else {
					console.log(`Record not updated`)
				}
			})
		}
    }


    render() {
		
		document.title = 'Ecoville | Missions'
        return (
		
		<div className="body_content">
			{this.state.logout ? <Redirect to="/Login"/> : null} 
            {this.state.redirectToMissionsList ? <Redirect to="/MissionsList"/> : null} 
			<div className="card_standard">
		
				<div className="card_title_container">
					<div className="card_standard card_title">
						<h2>Missions | Edit</h2>
					</div>
				</div>
		
				<table className="table table_create_edit">
					<tbody>
						<tr>
							<td>
								Name
							</td>
							<td>
								<input 
								className="input" 
								type="text" 
								name="name" 
								ref = {(input) => { this.inputToFocus = input }}
								value={this.state.name}
								onChange={this.handleChange}
								/>
							</td>
							<td>
								<span className="error_msg">{this.state.errorMessage.nameError}</span>
							</td>
						</tr>
						<tr>
							<td>
								Category
							</td>
							<td>
								<select 
								name="id_category" 
								className="input"
								value={this.state.id_category}
								onChange={this.handleChange}
								>
									<option value="0">-</option>
									{this.state.categories.map((category) => <option key={category._id} value={category._id}>{category.name}</option>)}
								</select>
							</td>
							<td>
								<span className="error_msg">{this.state.errorMessage.categoryError}</span>
							</td>
						</tr>
						<tr>
							<td>
								Points
							</td>
							<td>
								<input 
								className="input" 
								type="number" 
								name="points" 
								value={this.state.points}
								onChange={this.handleChange}
								/>
							</td>
							<td>
								<span className="error_msg">{this.state.errorMessage.pointsError}</span>
							</td>
						</tr>
						<tr>
							<td>
								Required Participants
							</td>
							<td>
								<input 
								className="input" 
								type="number" 
								name="requiredParticipants" 								
								value={this.state.requiredParticipants}
								onChange={this.handleChange}
								/>
							</td>
							<td>
								<span className="error_msg">{this.state.errorMessage.requiredParticipantsError}</span>
							</td>
						</tr>
						<tr>
							<td>
								Created
							</td>
							<td>
								{this.state.addedString}
							</td>
							<td> </td>
						</tr>
						<tr>
							<td>
								Date (when)
							</td>
							<td>
								<input 
								className="input" 
								type="text" 
								name="whenString" 								
								value={this.state.whenString}
								onChange={this.handleChange}
								/>
							</td>
							<td>
								<span className="error_msg">{this.state.errorMessage.dateError}</span>
							</td>
						</tr>
						<tr>
							<td>
								Duration (minutes)
							</td>
							<td>
								<input 
								className="input" 
								type="text" 
								name="durationMinutes" 
								value={this.state.durationMinutes}
								onChange={this.handleChange}
								/>
							</td>
							<td>
								<span className="error_msg">{this.state.errorMessage.durationError}</span>
							</td>
						</tr>
						<tr>
							<td>
								Location (building)
							</td>
							<td>
								<input 
								className="input" 
								type="text" 
								name="location" 
								value={this.state.location}
								onChange={this.handleChange}
								/>
							</td>
							<td>
								<span className="error_msg">{this.state.errorMessage.locationError}</span>
							</td>
						</tr>
						<tr>
							<td>
								Description
							</td>
							<td>
								<textarea 
								className="input textarea" 
								type="text" 
								name="description"
								value={this.state.description}
								onChange={this.handleChange}
								>
								
								</textarea>
							</td>
							<td>
								<span className="error_msg">{this.state.errorMessage.descriptionError}</span>
							</td>
						</tr>
						<tr>
						<td>
							Current Participants
						</td>
						<td>
							<table className="table table_user_spec">
								<tbody>
								{this.state.currentParticipants.map((participant) => 
								
									<tr key={participant._id}>
										<td>{participant.firstName} {participant.lastName}</td>
										
										{participant.confirmed ? <td><Link to={"/MissionConfirmUser/" + this.state._id + "/" + participant._id}>Remove</Link></td> : <td></td>}
										
									</tr>)
								}
								</tbody>
							</table>
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
								<Link to={"/MissionsList"}>Back</Link>
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