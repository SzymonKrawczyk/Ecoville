import React, {Component} from "react"
import {Redirect, Link} from "react-router-dom"

import axios from "axios"

import AdministratorTable from "./AdministratorTable"

import {ACCESS_LEVEL_GUEST, ACCESS_LEVEL_ADMIN, SERVER_HOST} from "../config/global_constants"


export default class AdministratorList extends Component {
	
    constructor(props)  {
		
        super(props)
        
        this.state = { 
			  adminTable:[]
			, logout: false
		}
    }
    
    
    componentDidMount() {
		
        axios.defaults.withCredentials = true // needed for sessions to work
        axios.post(`${SERVER_HOST}/administratorsList/`)
        .then(res =>  {
			
            if(res.data) {
				if (res.data.isLogged == false || res.data.isAdmin == false) {
					
					
					sessionStorage.clear() ;
                    sessionStorage.username = "GUEST";
                    sessionStorage.accessLevel = ACCESS_LEVEL_GUEST;
                    console.log('logout, server restart');
					
					
					this.setState({logout: true});
				}
                if (res.data.errorMessage) {
					
                    console.log(res.data.errorMessage)
					
                } else {  
				
					console.log("Records read")
                    this.setState({adminTable: res.data}) 
                }   
            } else {
				
                console.log("Record not found")
            }
        })
    }

  
    render() {   
	
		document.title = 'Ecoville | Administrators'	
        return (           
			<div className="body_content">
			{this.state.logout ? <Redirect to="/Login"/> : null} 
				<div className="card_standard">
			
					<div className="card_title_container">
						<div className="card_standard card_title">
							<h2>Administrators</h2>
						</div>
					</div>			
					<AdministratorTable adminTable={this.state.adminTable} /> 
				</div>
			</div>
        )
    }
}