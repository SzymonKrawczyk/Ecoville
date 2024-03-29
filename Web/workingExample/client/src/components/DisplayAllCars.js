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
            <div className="form-container">
                {sessionStorage.accessLevel >  ACCESS_LEVEL_GUEST ? 
                    <div className="logout">
                        <Logout/>
                    </div>
                :
                    <div>
                        <Link className="green-button" to={"/Login"}>Login</Link>
                        <Link className="red-button" to={"/ResetDatabase"}>Reset Database</Link>  <br/><br/><br/></div>
                }
                
                <div className="table-container">
                    <CarTable cars={this.state.cars} /> 
                        
                    {sessionStorage.accessLevel >= ACCESS_LEVEL_ADMIN ?
                        sessionStorage.name
                    :
                        null
                    }
                </div>
            </div> 
        )
    }
}