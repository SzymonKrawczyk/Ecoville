import React, {Component} from "react"
import {Redirect} from "react-router-dom"
import axios from "axios"

import {ACCESS_LEVEL_GUEST, ACCESS_LEVEL_ADMIN, SERVER_HOST} from "../config/global_constants"


export default class GadgetDelete extends Component  {
	
    constructor(props)  {
		
        super(props)
        
        this.state = {
              redirectToGadgetsList: sessionStorage.accessLevel < ACCESS_LEVEL_ADMIN
			, logout: false
        }
    }
    
    
    componentDidMount() {  
	
        axios.defaults.withCredentials = true // needed for sessions to work
        axios.delete(`${SERVER_HOST}/gadget/${this.props.match.params.id}`)
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
                    console.log("Record deleted")
                }
                this.setState({redirectToGadgetsList:true})
				
            } else {
				
                console.log("Record not deleted")
            }
        })
    }
  
  
    render()  {
        return (
            <div>   
				{this.state.logout ? <Redirect to="/Login"/> : null} 
                {this.state.redirectToGadgetsList ? <Redirect to="/GadgetsList"/> : null}                      
            </div>
        )
    }
}