import React, {Component} from "react"
import {Redirect, Link} from "react-router-dom"
import Form from "react-bootstrap/Form"

import axios from "axios"

import LinkInClass from "../components/LinkInClass"

import {ACCESS_LEVEL_GUEST, ACCESS_LEVEL_ADMIN, SERVER_HOST} from "../config/global_constants"


export default class MissionAdd extends Component {
	
    constructor(props) {
		
        super(props)

        this.state = {
              name: ""
            , category: {}
			, categories: []
			, points: 0
			, date: ""
			, dateInTimestamp: 0
			, duration: 0
			, location: ""
			, description: ""
			, requiredParticipants: 0
            , redirectToMissionsList: sessionStorage.accessLevel < ACCESS_LEVEL_ADMIN
			, errorMessage: {}
			, logout: false
        }
    }


    componentDidMount() {
		
        this.inputToFocus.focus();

		axios.defaults.withCredentials = true // needed for sessions to work
        axios.post(`${SERVER_HOST}/categoriesList/`)
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
				
					console.log(res.data);
                    this.setState({
                        categories: res.data
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
				
				if (this.state.category == this.state.categories[i]._id) {
					categoryValidation = true;
					break;
				}
			}			
		}
		
		let pointsValidation = this.state.points > 0;
		
		let dateValidation = true;
		const paragraph = this.state.date;
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
			else this.state.dateInTimestamp = Date.parse(date);
			
			console.log(date)
			console.log(this.state.dateInTimestamp)
			
			
		} else {
			dateValidation = false;
		}
		
		let durationValidation = this.state.duration > 0;
		
		let locationValidation = this.state.location.length < 3 && this.state.location.length > 0;
		
		let descriptionValidation = this.state.description.trim().length >= 16;
		
		let requiredParticipantsValidation = this.state.requiredParticipants > 0;
		
		this.setState({errorMessage: {
			  nameError: nameValidation ? null : 'name has to be at least 5 characters long'
			, categoryError: categoryValidation ? null : 'category is required'
			, pointsError: pointsValidation ? null : 'points value has to be greater than 0'
			, dateError: dateValidation ? null : 'future date in format dd/mm/yyyy hh:mm:ss is required'
			, durationError: durationValidation ? null : 'duration value has to be greater than 0'
			, locationError: locationValidation ? null : 'location name has to be shorter than 3 characters'
			, descriptionError: descriptionValidation ? null : 'description has to be at least 16 characters long'
			, requiredParticipantsError: requiredParticipantsValidation ? null : 'value has to be greater than 0'
		}}) 
		return nameValidation && categoryValidation && pointsValidation && dateValidation && durationValidation && locationValidation && descriptionValidation && requiredParticipantsValidation;
	}



    handleSubmit = (e) =>  {
		
		e.preventDefault();		
		
		if (this.validate()){

			const missionObject = {
				  name: this.state.name
				, id_category: this.state.category
				, points: this.state.points
				, when: this.state.dateInTimestamp
				, durationMinutes: this.state.duration
				, location: this.state.location
				, description: this.state.description.trim()
				, requiredParticipants: this.state.requiredParticipants
			}
			console.log(missionObject.when);

			axios.defaults.withCredentials = true // needed for sessions to work
			axios.post(`${SERVER_HOST}/mission`, missionObject)
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
						this.setState({redirectToMissionsList:true})
					} 
				} else {
					
					console.log("Record not added")
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
						<h2>Missions | Add</h2>
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
								ref = {(input) => { this.inputToFocus = input }}
								className="input" 
								type="text" 
								name="name" 
								value={this.state.username}
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
								name="category" 
								className="input"
								value={this.state.category}
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
								Date (when)
							</td>
							<td>
								<input 
								className="input" 
								type="text" 
								name="date" 								
								value={this.state.date}
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
								name="duration" 
								value={this.state.duration}
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