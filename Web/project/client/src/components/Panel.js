import React, {Component} from "react"
import {Link} from "react-router-dom"

import axios from "axios"

import CarTable from "./CarTable"
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
    
    
    componentDidMount() 
    {
        axios.defaults.withCredentials = true // needed for sessions to work
        axios.get(`${SERVER_HOST}/cars/`)
        .then(res => 
        {
            if(res.data)
            {
                if (res.data.errorMessage)
                {
                    console.log(res.data.errorMessage)    
                }
                else
                {           
                    console.log("Records read")   
                    this.setState({cars: res.data}) 
                }   
            }
            else
            {
                console.log("Record not found")
            }
        })
    }

  
    render() 
    {   
        return (           
		<div className="body_content">
			<div className="card_standard">
	
				<div className="card_title_container">
					<div className="card_standard card_title">
						<h2>Ecoville admin panel</h2>
					</div>
				</div>
		
				<div className="panel_button_container">
					<div className="button panel_button">Administrators</div>
					<div className="button panel_button"><Logout/></div>
					<div className="button panel_button">Users</div>
					<div className="button panel_button">Messages</div>
					<div className="button panel_button">Missions</div>
					<div className="button panel_button">Articles (Tips)</div>
					<div className="button panel_button">Trophies</div>
					<div className="button panel_button">Categories</div>
						
					<div style={{clear: "both"}}></div>
					<div></div>
				</div>
			</div>
                <div className="table-container">
                    <CarTable cars={this.state.cars} /> 
                        
                    {sessionStorage.accessLevel >= ACCESS_LEVEL_ADMIN ?
                        sessionStorage.username
                    :
                        null
                    }
                </div>
		</div>
        )
    }
}