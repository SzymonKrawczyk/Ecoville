import React, {Component} from "react"
import {BrowserRouter, Switch, Route} from "react-router-dom"

import "bootstrap/dist/css/bootstrap.css"
import "./css/App.css"

import Login from "./components/Login"
import Logout from "./components/Logout"
import DisplayAllCars from "./components/DisplayAllCars"
import PrivateRoute from "./components/PrivateRoute"


import {ACCESS_LEVEL_GUEST} from "./config/global_constants"

if (typeof sessionStorage.accessLevel === "undefined")
{
    sessionStorage.name = "GUEST"
    sessionStorage.accessLevel = ACCESS_LEVEL_GUEST
}
    
export default class App extends Component 
{
    render() 
    {
        return (
            <BrowserRouter>
                <Switch>                                  
                    <Route exact path="/" component={Login} />
                    <Route exact path="/Login" component={Login} />
                    <PrivateRoute exact path="/Logout" component={Logout} />
                    <PrivateRoute exact path="/DisplayAllCars" component={DisplayAllCars}/> 
                    <Route path="*" component={Login}/>                               
                </Switch>
            </BrowserRouter>
        )
    }
}