import React, {Component} from "react"
import {Redirect} from "react-router-dom"
import axios from "axios"

import {ACCESS_LEVEL_GUEST, ACCESS_LEVEL_ADMIN, SERVER_HOST} from "../config/global_constants"


export default class GadgetDeleteTrophy extends Component  {
	
    constructor(props)  {
		
        super(props)
        this.state = {
              redirectToGadgetEdit: sessionStorage.accessLevel < ACCESS_LEVEL_ADMIN
			, logout: false
        }
    }
    
    
    componentDidMount() {  
	
        axios.defaults.withCredentials = true // needed for sessions to work
        axios.post(`${SERVER_HOST}/gadgetDeletePic/${this.props.match.params.id}`)
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
                    console.log("Gadget confirmed")
                }
                this.setState({redirectToGadgetEdit:true})
				
            } else {
				
                console.log("Gadget not confirmed")
            }
        })
    }
  
  
    render()  {
		let temp = `/GadgetEdit/${this.props.match.params.id}`
        return (
            <div>   
				{this.state.logout ? <Redirect to="/Login"/> : null} 
                {this.state.redirectToGadgetEdit ? <Redirect to={temp}/> : null}                      
            </div>
        )
    }
}