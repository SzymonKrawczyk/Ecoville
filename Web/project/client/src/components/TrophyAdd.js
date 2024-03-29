import React, {Component} from "react"
import {Redirect, Link} from "react-router-dom"
import Form from "react-bootstrap/Form"

import axios from "axios"

import LinkInClass from "../components/LinkInClass"

import {ACCESS_LEVEL_GUEST, ACCESS_LEVEL_ADMIN, SERVER_HOST} from "../config/global_constants"


export default class TrophyAdd extends Component {
	
    constructor(props) {
		
        super(props)

        this.state = {
              name: ""
            , description: ""
            , cost: 0
            //, image: ""
            , redirectToTrophiesList: sessionStorage.accessLevel < ACCESS_LEVEL_ADMIN
			, redirectToEdit: false
			, errorMessage: {}
			, logout: false
			, canSubmit: true
        }
    }


    componentDidMount() {
		
        this.inputToFocus.focus()        
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
        let descriptionValidation = this.state.description.length >= 16;
        let costValidation = this.state.cost >= 0;
        //let imageValidation = this.state.image.length > 0;
		
		this.setState({errorMessage: {
              nameError: nameValidation ? null : 'name has to be at least 5 characters long',
              descriptionError: descriptionValidation ? null : 'description has to be at least 16 characters long',
              costError: costValidation ? null : 'cost has to be non-negative number',
              //imageError: imageValidation ? null : 'Media Path is required',              
        }}) 
        
        return nameValidation && descriptionValidation && costValidation;
	}

    handleSubmit = (e) =>  {
		
		e.preventDefault();		
		
		if (this.validate() && this.state.canSubmit){
			
			this.state.canSubmit = false;

			const trophyObject = {
                  name: this.state.name,
                  description: this.state.description,
                  cost: this.state.cost
                  //image: this.state.image
			}

            console.log(trophyObject);

			axios.defaults.withCredentials = true // needed for sessions to work
			axios.post(`${SERVER_HOST}/trophy`, trophyObject)
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
					
						this.setState({id: res.data.id})
						console.log("Record added")
						this.setState({redirectToEdit:true})
					} 
				} else {
					console.log("Record not added")
				}
			})
		}
    }


    render() {  
	
		document.title = 'Trophies | Add'
        return (
		<div className="body_content">
		
			{this.state.redirectToEdit ? <Redirect to={"/TrophyEdit/" + this.state.id}/> : null}
			{this.state.logout ? <Redirect to="/Login"/> : null} 
            {this.state.redirectToTrophiesList ? <Redirect to="/TrophiesList"/> : null} 
				
			<div className="card_standard">
		
				<div className="card_title_container">
					<div className="card_standard card_title">
						<h2>Trophies | Add</h2>
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
                            	Description
							</td>
							<td>
								<textarea 
								className = "input textarea" 
								type = "text"
								name = "description"
								value = {this.state.description}
								onChange = {this.handleChange}
								/>
							</td>
							<td>
								<span className="error_msg">{this.state.errorMessage.descriptionError}</span>
							</td>
						</tr>

                        <tr>
						    <td>
							    Cost
						    </td>
						    <td>
                                <input 
                                className="input" 
                                type="number" 
                                name="cost" 
                                value={this.state.cost}
                                onChange={this.handleChange}
                                />
						    </td>
						    <td>
							    <span className="error_msg">{this.state.errorMessage.costError}</span>
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
								<Link to={"/TrophiesList"}>Back</Link>
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