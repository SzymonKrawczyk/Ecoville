import React, {Component} from "react"
import {Redirect, Link} from "react-router-dom"

import axios from "axios"

import MissionTable from "./MissionTable"

import {ACCESS_LEVEL_GUEST, ACCESS_LEVEL_ADMIN, SERVER_HOST} from "../config/global_constants"


export default class MissionsList extends Component {
	
    constructor(props)  {
		
        super(props)
        
        this.state = { 
			  missionTable:[]
			, logout: false
		}
    }
    
    
    componentDidMount() {
		
        axios.defaults.withCredentials = true // needed for sessions to work
        axios.post(`${SERVER_HOST}/missionsList/`)
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
                    this.setState({missionTable: res.data}) 
                }   
            } else {
				
                console.log("Record not found")
            }
        })
    }

  
    render() {   
	
		document.title = 'Ecoville | Missions'	
        return (           
			<div className="body_content">
			{this.state.logout ? <Redirect to="/Login"/> : null} 
				<div className="card_standard">
			
					<div className="card_title_container">
						<div className="card_standard card_title">
							<h2>Missions</h2>
						</div>
					</div>			
					<MissionTable missionTable={this.state.missionTable} /> 
				</div>
			</div>
        )
    }
}