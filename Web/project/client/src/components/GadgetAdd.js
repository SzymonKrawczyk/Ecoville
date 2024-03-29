import React, {Component} from "react"
import {Redirect, Link} from "react-router-dom"
import Form from "react-bootstrap/Form"

import axios from "axios"

import LinkInClass from "../components/LinkInClass"

import {ACCESS_LEVEL_GUEST, ACCESS_LEVEL_ADMIN, SERVER_HOST} from "../config/global_constants"


export default class GadgetAdd extends Component {
	
    constructor(props) {
		
        super(props)

        this.state = {
              name: ""
            , cost: 0
            , amount: 0
            , redirectToGadgetsList: sessionStorage.accessLevel < ACCESS_LEVEL_ADMIN
			, redirectToEdit: false
			, errorMessage: {}
			, logout: false
			, canSubmit: true
			, id: null
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
		let costValidation = this.state.cost >= 0;
		let amountValidation = this.state.amount >= 0;
        
        
		
		this.setState({errorMessage: {
            nameError:  nameValidation ? null : 'name has to be at least 5 characters long',
			costError: costValidation ? null : 'cost has to be non-negative number',
			amountError: amountValidation ? null : 'amount has to be non-negative number'
		}}) 
        return nameValidation && costValidation && amountValidation;
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

            console.log(gadgetObject);

			axios.defaults.withCredentials = true // needed for sessions to work
			axios.post(`${SERVER_HOST}/gadget`, gadgetObject)
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
						console.log("Record added " + this.state.id)
						
						this.setState({redirectToEdit:true})
					} 
				} else {
					console.log("Record not added")
				}
			})
		}
    }


    render() {  
	
		document.title = 'Gadgets | Add'
        return (
		<div className="body_content">
		
			{this.state.redirectToEdit ? <Redirect to={"/GadgetEdit/" + this.state.id}/> : null}
			{this.state.logout ? <Redirect to="/Login"/> : null} 
            {this.state.redirectToGadgetsList ? <Redirect to="/GadgetsList"/> : null} 
				
			<div className="card_standard">
		
				<div className="card_title_container">
					<div className="card_standard card_title">
						<h2>Gadgets | Add</h2>
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