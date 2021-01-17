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

import CategoriesList from "./components/CategoriesList"
import CategoryDelete from "./components/CategoryDelete"
import CategoryAdd from "./components/CategoryAdd"
import CategoryEdit from "./components/CategoryEdit"

import ArticlesList from "./components/ArticlesList"
import ArticleDelete from "./components/ArticleDelete"
import ArticleAdd from "./components/ArticleAdd"
import ArticleEdit from "./components/ArticleEdit"

import TrophiesList from "./components/TrophiesList"
import TrophyDelete from "./components/TrophyDelete"
import TrophyAdd from "./components/TrophyAdd"
import TrophyEdit from "./components/TrophyEdit"

import UsersList from "./components/UsersList"
import UserDelete from "./components/UserDelete"
import UserEdit from "./components/UserEdit"
import UserAddPoints from "./components/UserAddPoints"
import UserDeleteTrophy from "./components/UserDeleteTrophy"

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
		
		    <PrivateRoute exact path="/CategoriesList" component={CategoriesList}/> 
                    <PrivateRoute exact path="/CategoryDelete/:id" component={CategoryDelete} />
                    <PrivateRoute exact path="/CategoryAdd" component={CategoryAdd} />
                    <PrivateRoute exact path="/CategoryEdit/:id" component={CategoryEdit} />

                    <PrivateRoute exact path="/ArticlesList" component={ArticlesList}/> 
                    <PrivateRoute exact path="/ArticleDelete/:id" component={ArticleDelete} />
                    <PrivateRoute exact path="/ArticleAdd" component={ArticleAdd}/> 
                    <PrivateRoute exact path="/ArticleEdit/:id" component={ArticleEdit} />

                    <PrivateRoute exact path="/TrophiesList" component={TrophiesList}/> 
                    <PrivateRoute exact path="/TrophyDelete/:id" component={TrophyDelete} />
                    <PrivateRoute exact path="/TrophyAdd" component={TrophyAdd}/> 
                    <PrivateRoute exact path="/TrophyEdit/:id" component={TrophyEdit} />

                    <PrivateRoute exact path="/UsersList" component={UsersList}/> 
                    <PrivateRoute exact path="/UserDelete/:id" component={UserDelete} />
                    <PrivateRoute exact path="/UserEdit/:id" component={UserEdit} />
                    <PrivateRoute exact path="/UserAddPoints/:idm/:idu" component={UserAddPoints} />
                    <PrivateRoute exact path="/UserDeleteTrophy/:idm/:idu" component={UserDeleteTrophy} />
					
                    <Route path="*" component={Login}/>
                </Switch>
            </BrowserRouter>
        )
    }
}
