import React, {Component} from "react"
import {Link} from "react-router-dom"



export default class AdministratorTableRow extends Component 
{    
    render() 
    {
        return (
            <tr>
                <td>{this.props.admin.username}</td>
                <td>
                    <Link to={"/AdministratorEdit/" + this.props.admin._id}>Edit</Link>                  
                </td>
                <td>
                    <Link to={"/AdministratorDelete/" + this.props.admin._id}>Delete</Link>    
                </td>
            </tr>
        )
    }
}