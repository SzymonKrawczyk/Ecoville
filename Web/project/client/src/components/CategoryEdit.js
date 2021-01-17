import React, {Component} from "react"
import {Redirect, Link} from "react-router-dom"
import axios from "axios"

import LinkInClass from "../components/LinkInClass"

import {ACCESS_LEVEL_GUEST, ACCESS_LEVEL_ADMIN, SERVER_HOST} from "../config/global_constants"

export default class CategoryEdit extends Component  {
	
    constructor(props)  {
        super(props)
		console.log("const edit")
        this.state = {
              name: ``
			, errorMessage: {}
			, redirectToCategoriesList: sessionStorage.accessLevel < ACCESS_LEVEL_ADMIN
			, logout: false
        }
    }

    componentDidMount() { 
	
        this.inputToFocus.focus()
  
        axios.defaults.withCredentials = true // needed for sessions to work
        axios.get(`${SERVER_HOST}/category/${this.props.match.params.id}`)
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
                        name: res.data.name
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
		
		let nameValidation = this.state.name.length >= 3;
		
		this.setState({errorMessage: {
			  nameError: nameValidation ? null : 'Category name has to be at least 3 characters long'
		}}) 
		return nameValidation;
	}


    handleSubmit = (e) =>  {
		
        e.preventDefault();
		
		if (this.validate()){

			const categoryObject = {
				name: this.state.name
			};

			axios.defaults.withCredentials = true // needed for sessions to work
			axios.put(`${SERVER_HOST}/category/${this.props.match.params.id}`, categoryObject)
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
						this.setState({redirectToCategoriesList:true})
					}
				} else {
					console.log(`Record not updated`)
				}
			})
		}
    }


    render() {
		
		document.title = 'Ecoville | Categories'
        return (
		
		<div className="body_content">
			{this.state.logout ? <Redirect to="/Login"/> : null} 
            {this.state.redirectToCategoriesList ? <Redirect to="/CategoriesList"/> : null} 
			<div className="card_standard">
		
				<div className="card_title_container">
					<div className="card_standard card_title">
						<h2>Categories | Edit</h2>
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
								<Link to={"/CategoriesList"}>Back</Link>
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