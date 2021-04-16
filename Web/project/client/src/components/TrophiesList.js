import React, {Component} from "react"
import {Redirect, Link} from "react-router-dom"

import axios from "axios"

import TrophyTable from "./TrophyTable"

import {ACCESS_LEVEL_GUEST, ACCESS_LEVEL_ADMIN, SERVER_HOST} from "../config/global_constants"

export default class TrophiesList extends Component {
	
    constructor(props)  {
		
        super(props)
        
        this.state = { 
              trophyTable:[]
			, logout: false
		}
    }
    
    
    componentDidMount() {
		
        axios.defaults.withCredentials = true // needed for sessions to work
        axios.post(`${SERVER_HOST}/trophiesList/`)
        .then(res =>  {
            
            console.log(res.data)

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
					
                } else {  
				
					console.log("Records read")
                    this.setState({trophyTable: res.data}) 
                }   
            } else {
				
                console.log("Record not found")
            }
        })
    }

  
    render() {   
	
		document.title = 'Ecoville | Trophies'	
        return (           
			<div className="body_content">
			{this.state.logout ? <Redirect to="/Login"/> : null} 
				<div className="card_standard">
			
					<div className="card_title_container">
						<div className="card_standard card_title">
							<h2>Trophies</h2>
						</div>
					</div>			
					<TrophyTable trophyTable={this.state.trophyTable} /> 
				</div>
			</div>
        )
    }
}