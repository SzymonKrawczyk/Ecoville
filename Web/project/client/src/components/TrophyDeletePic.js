import React, {Component} from "react"
import {Redirect} from "react-router-dom"
import axios from "axios"

import {ACCESS_LEVEL_GUEST, ACCESS_LEVEL_ADMIN, SERVER_HOST} from "../config/global_constants"


export default class TrophyDeletePic extends Component  {
	
    constructor(props)  {
		
        super(props)
        this.state = {
              redirectToTrophyEdit: sessionStorage.accessLevel < ACCESS_LEVEL_ADMIN
			, logout: false
        }
    }
    
    
    componentDidMount() {  
	
        axios.defaults.withCredentials = true // needed for sessions to work
        axios.post(`${SERVER_HOST}/trophyDeletePic/${this.props.match.params.id}`)
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
                    console.log("Trophy confirmed")
                }
                this.setState({redirectToTrophyEdit:true})
				
            } else {
				
                console.log("Trophy not confirmed")
            }
        })
    }
  
  
    render()  {
		let temp = `/TrophyEdit/${this.props.match.params.id}`
        return (
            <div>   
				{this.state.logout ? <Redirect to="/Login"/> : null} 
                {this.state.redirectToTrophyEdit ? <Redirect to={temp}/> : null}                      
            </div>
        )
    }
}