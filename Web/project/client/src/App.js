import React, {Component} from "react"
import {BrowserRouter, Switch, Route} from "react-router-dom"

import "./css/style.css"

import Login from "./components/Login"
import Logout from "./components/Logout"

import Panel from "./components/Panel"

import AdministratorsList from "./components/AdministratorsList"
import AdministratorDelete from "./components/AdministratorDelete"
import AdministratorAdd from "./components/AdministratorAdd"
import AdministratorEdit from "./components/AdministratorEdit"

import MessagesList from "./components/MessagesList"
import MessageDelete from "./components/MessageDelete"

import MissionsList from "./components/MissionsList"
import MissionDelete from "./components/MissionDelete"
import MissionAdd from "./components/MissionAdd"
import MissionEdit from "./components/MissionEdit"
import MissionConfirmUser from "./components/MissionConfirmUser"

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
					
                    <PrivateRoute exact path="/Panel" component={Panel}/> 
					
                    <PrivateRoute exact path="/AdministratorsList" component={AdministratorsList}/> 
                    <PrivateRoute exact path="/AdministratorDelete/:id" component={AdministratorDelete} />
                    <PrivateRoute exact path="/AdministratorAdd" component={AdministratorAdd} />
                    <PrivateRoute exact path="/AdministratorEdit/:id" component={AdministratorEdit} />
					
                    <PrivateRoute exact path="/MessagesList" component={MessagesList} />
                    <PrivateRoute exact path="/MessageDelete/:id" component={MessageDelete} />					
					
                    <PrivateRoute exact path="/MissionsList" component={MissionsList}/> 
                    <PrivateRoute exact path="/MissionDelete/:id" component={MissionDelete} />
                    <PrivateRoute exact path="/MissionAdd" component={MissionAdd} />
                    <PrivateRoute exact path="/MissionEdit/:id" component={MissionEdit} />
                    <PrivateRoute exact path="/MissionConfirmUser/:idm/:idu" component={MissionConfirmUser} />
					
                    <Route path="*" component={Login}/>
                </Switch>
            </BrowserRouter>
        )
    }
}