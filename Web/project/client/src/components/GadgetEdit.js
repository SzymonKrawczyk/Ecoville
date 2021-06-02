import React, {Component} from "react"
import {Redirect, Link} from "react-router-dom"
import Form from "react-bootstrap/Form"

import axios from "axios"

import LinkInClass from "../components/LinkInClass"

import {ACCESS_LEVEL_GUEST, ACCESS_LEVEL_ADMIN, SERVER_HOST} from "../config/global_constants"

export default class GadgetEdit extends Component {
    constructor(props) {
		
        super(props)

        this.state = {
              name:""
			, cost: 0
			, amount: 0
			, pic: null
			, picNew: null
			, picChanged: false
			, picName: ""
            , redirectToGadgetsList: sessionStorage.accessLevel < ACCESS_LEVEL_ADMIN
			, errorMessage: {}
			, logout: false
			, canSubmit: true
        }
    }


    componentDidMount() {
		
		this.inputToFocus.focus()   
		
		axios.defaults.withCredentials = true // needed for sessions to work
        axios.get(`${SERVER_HOST}/gadget/${this.props.match.params.id}`)
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
					

                    this.setState({		
						  name: res.data.name
						, cost: res.data.cost
						, amount: res.data.amount
						, pic: res.data.pic
						, _id: res.data._id
                    });
					
					//let tempPic = res.data.profilePic;
					//console.log(tempPic);
					//if (tempPic != null && typeof(tempPic) != 'undefined') {this.setState({ profilePic: res.data.profilePic});}
					//console.log(`pic: ${SERVER_HOST}/userImg/${this.state.profilePic}`)
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
		let costValidation = this.state.cost >= 0;
		let amountValidation = this.state.amount >= 0;
        
        
		
		this.setState({errorMessage: {
            nameError:  nameValidation ? null : 'name has to be at least 5 characters long',
			costError: costValidation ? null : 'cost has to be non-negative number',
			amountError: amountValidation ? null : 'amount has to be non-negative number'
		}}) 
        return nameValidation && costValidation && amountValidation;
	}
	
	handleSubmitPic = (e) =>  {
		
		e.preventDefault();		
		
		if (this.state.canSubmit && this.state.picNew != null && this.state.picChanged){
			console.log(this.state.picNew);

			this.state.canSubmit = false;

			const gadgetObject = new FormData();
			gadgetObject.append('file', this.state.picNew);
			for (var value of gadgetObject.values()) {
				console.log(value);
			}

			axios.defaults.withCredentials = true // needed for sessions to work
			axios.post(`${SERVER_HOST}/gadgetUploadPicture/${this.props.match.params.id}`, gadgetObject)
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
						//this.setState({redirectToGadgetsList:true})
					} 
				} else {
					console.log("Record not added")
				}
			})
		}
    }
	

    handleSubmit = (e) =>  {
		
		e.preventDefault();		
		
		if (this.validate() && this.state.canSubmit){

			this.state.canSubmit = false;

			const gadgetObject = {
                      name: this.state.name
					, cost: this.state.cost
					, amount: this.state.amount
			}

			axios.defaults.withCredentials = true // needed for sessions to work
			axios.put(`${SERVER_HOST}/gadget/${this.props.match.params.id}`, gadgetObject)
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
						this.setState({redirectToGadgetsList:true})
					} 
				} else {
					console.log("Record not added")
				}
			})
		}
    }

    render() {  
    
		document.title = 'Gadgets | Edit'
        return (

		<div className="body_content">
		
			{this.state.logout ? <Redirect to="/Login"/> : null} 
            {this.state.redirectToGadgetsList ? <Redirect to="/GadgetsList"/> : null} 
				
			<div className="card_standard">
		
				<div className="card_title_container">
					<div className="card_standard card_title">
						<h2>Gadgets | Edit</h2>
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
							onChange={this.handleChange}/>
						</td>
						<td>
							<span className="error_msg">{this.state.errorMessage.nameError}</span>
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
							Amount
						</td>
						<td>
							<input 
							className="input" 
							type="number" 
							name="amount" 
							value={this.state.amount}
							onChange={this.handleChange}
							/>
						</td>
						<td>
							<span className="error_msg">{this.state.errorMessage.amountError}</span>
						</td>
					</tr>
					
					<tr>
						<td>
							Picture 
						</td>
						<td>
							<img className="userProfilePic" src={SERVER_HOST + "/gadgets/" + this.state.pic} alt="Gadget Picture"/><br/>
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
							{ this.state.pic != "defaultGadget.jpg" ? <Link to={"/GadgetDeletePic/" + this.state._id}>Delete</Link> : ""}						
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
						<Link to={"/GadgetsList"}>Back</Link>
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