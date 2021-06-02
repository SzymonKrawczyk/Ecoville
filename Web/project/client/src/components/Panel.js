import React, {Component} from "react"
import {Redirect, Link} from "react-router-dom"

import axios from "axios"

import Logout from "./Logout"

import {ACCESS_LEVEL_GUEST, ACCESS_LEVEL_ADMIN, SERVER_HOST} from "../config/global_constants"


export default class Panel extends Component 
{
    constructor(props) 
    {
        super(props)
        
        this.state = {
            
			  errorMessage: {}
			, logout: false
        }
    }
	
	componentDidMount() { 
	
  
        axios.defaults.withCredentials = true // needed for sessions to work
        axios.get(`${SERVER_HOST}/ping`)
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
					
					console.log(this.state.errorMessage);
					
                } 
				
            } else {
				
                console.log(`error`);
            }
        })
    }
	
    
    
  
    render() 
    {   
		document.title = 'Ecoville | Panel'	
        return (           
		<div className="body_content">
		
		{this.state.logout ? <Redirect to="/Login"/> : null} 
		
		{sessionStorage.accessLevel < ACCESS_LEVEL_ADMIN ? <Redirect to="/Login"/> : null }
		
			<div className="card_standard">
	
				<div className="card_title_container">
					<div className="card_standard card_title">
						<h2>Ecoville admin panel</h2>
					</div>
				</div>
		
				<div className="panel_button_container">

					<Link className="button panel_button" to={"/AdministratorsList"}>Administrators</Link>
					<Logout/>
					<Link className="button panel_button" to={"/UsersList"}>Users</Link>
					<Link className="button panel_button" to={"/MessagesList"}>Messages</Link>
					<Link className="button panel_button" to={"/MissionsList"}>Missions</Link>
					<Link className="button panel_button" to={"/ArticlesList"}>Articles (Tips)</Link>
					<Link className="button panel_button" to={"/TrophiesList"}>Trophies</Link>
					<Link className="button panel_button" to={"/CategoriesList"}>Categories</Link>
					<Link className="button panel_button" to={"/GadgetsList"}>Gadgets</Link>
						
					<div style={{clear: "both"}}></div>
					<div></div>
				</div>
			</div>
		</div>
        )
    }
}