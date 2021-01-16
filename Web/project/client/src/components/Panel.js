import React, {Component} from "react"
import {Redirect, Link} from "react-router-dom"

import axios from "axios"

import Logout from "./Logout"

import {ACCESS_LEVEL_GUEST, ACCESS_LEVEL_ADMIN, SERVER_HOST} from "../config/global_constants"


export default class DisplayAllCars extends Component 
{
    constructor(props) 
    {
        super(props)
        
        this.state = {
            cars:[]
        }
    }
    
    
  
    render() 
    {   
		document.title = 'Ecoville | Panel'	
        return (           
		<div className="body_content">
		
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
						
					<div style={{clear: "both"}}></div>
					<div></div>
				</div>
			</div>
		</div>
        )
    }
}