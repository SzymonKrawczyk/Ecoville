import React, {Component} from "react"
import {Redirect} from "react-router-dom"
import axios from "axios"

import {ACCESS_LEVEL_GUEST, ACCESS_LEVEL_ADMIN, SERVER_HOST} from "../config/global_constants"


export default class MissionConfirmUser extends Component  {
	
    constructor(props)  {
		
        super(props)
        console.log(this.props.match.params.idm);
        console.log(this.props.match.params.idu);
        this.state = {
              redirectToMissionEdit: sessionStorage.accessLevel < ACCESS_LEVEL_ADMIN
			, logout: false
        }
    }
    
    
    componentDidMount() {  
	
        axios.defaults.withCredentials = true // needed for sessions to work
        axios.post(`${SERVER_HOST}/missionConfirmUser/${this.props.match.params.idm}/${this.props.match.params.idu}`)
        .then(res =>  {
			
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
                    console.log("User confirmed")
                }
                this.setState({redirectToMissionEdit:true})
				
            } else {
				
                console.log("User not confirmed")
            }
        })
    }
  
  
    render()  {
		let temp = `/MissionEdit/${this.props.match.params.idm}`
        return (
            <div>   
				{this.state.logout ? <Redirect to="/Login"/> : null} 
                {this.state.redirectToMissionEdit ? <Redirect to={temp}/> : null}                      
            </div>
        )
    }
}