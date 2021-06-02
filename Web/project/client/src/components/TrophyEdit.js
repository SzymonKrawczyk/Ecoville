import React, {Component} from "react"
import {Redirect, Link} from "react-router-dom"
import axios from "axios"

import LinkInClass from "../components/LinkInClass"

import {ACCESS_LEVEL_GUEST, ACCESS_LEVEL_ADMIN, SERVER_HOST} from "../config/global_constants"

export default class TrophyEdit extends Component  {
	
    constructor(props)  {
        super(props)
		console.log("const edit")
        this.state = {
            name: ""
            , description: ""
            , cost: 0
            //, image: ""
			, pic: null
			, _id: null
			, picNew: null
			, picChanged: false
			, picName: ""
            , redirectToTrophiesList: sessionStorage.accessLevel < ACCESS_LEVEL_ADMIN
			//, reload: false
			, errorMessage: {}
			, logout: false
			, canSubmit: true
			, reload: false
        }
    }

    componentDidMount() { 
	
        this.inputToFocus.focus()
  
        axios.defaults.withCredentials = true // needed for sessions to work
        axios.get(`${SERVER_HOST}/trophy/${this.props.match.params.id}`)
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
                        name: res.data.name,
                        description: res.data.description,
                        cost: res.data.cost,
						pic: res.data.pic, 
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
	
	handleChangePic = (e) =>  {
        this.setState({[e.target.name]: e.target.value})
		this.setState({picChanged: true});
		this.setState({picNew: e.target.files[0]});
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
              costError: costValidation ? null : 'cost has to be non-negative number'
              //imageError: imageValidation ? null : 'Media Path is required'            
        }}) 
        
        return nameValidation && descriptionValidation && costValidation;
	}
	
	handleSubmitPic = (e) =>  {
		
		e.preventDefault();		
		
		if (this.state.canSubmit && this.state.picNew != null && this.state.picChanged){
			console.log(this.state.picNew);

			this.state.canSubmit = false;

			const trophyObject = new FormData();
			trophyObject.append('file', this.state.picNew);
			trophyObject.append('myData', this.state.name);
			for (var value of trophyObject.values()) {
				console.log(value);
			}

			axios.defaults.withCredentials = true // needed for sessions to work
			axios.post(`${SERVER_HOST}/trophyUploadPicture/${this.props.match.params.id}`, trophyObject)
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
						//this.setState({redirectToTrophiesList:true})
						//this.setState({reload:true})
					} 
				} else {
					console.log("Record not added")
				}
			})
			
			
			this.setState({reload:true})
			
		}
    }


    handleSubmit = (e) =>  {
		
        e.preventDefault();
		
		if (this.validate() && this.state.canSubmit){

			this.state.canSubmit = false;

			const trophyObject = {
                name: this.state.name,
                description: this.state.description,
                cost: this.state.cost
          }

			axios.defaults.withCredentials = true // needed for sessions to work
			axios.put(`${SERVER_HOST}/trophy/${this.props.match.params.id}`, trophyObject)
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
						this.setState({redirectToTrophiesList:true})
					}
				} else {
					console.log(`Record not updated`)
				}
			})
		}
    }


    render() {
		
		document.title = 'Trophies | Edit'
        return (
		
		<div className="body_content">
			{this.state.logout ? <Redirect to="/Login"/> : null} 
            {this.state.redirectToTrophiesList ? <Redirect to="/TrophiesList"/> : null} 
			<div className="card_standard">
		
				<div className="card_title_container">
					<div className="card_standard card_title">
						<h2>Trophies | Edit</h2>
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
								Picture 
							</td>
							<td>
								<img className="userProfilePic" src={SERVER_HOST + "/trophies/" + this.state.pic} alt="Trophy Picture"/><br/>
								<input 
								className="input" 
								type="file" 
								name="picName" 
								accept="image/png, image/jpeg"
								value={this.state.picName}
								onChange={this.handleChangePic}
								/><br/>
								<LinkInClass className="linkInClass" value="Change" onClick={this.handleSubmitPic}/>	
							</td>
							<td>
								{ this.state.pic != "defaultTrophy.jpg" ? <Link to={"/TrophyDeletePic/" + this.state._id}>Delete</Link> : ""}						
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