import React, {Component} from "react"
import {Link} from "react-router-dom"



export default class CategoryTableRow extends Component 
{    
    render() 
    {
        return (
            <tr>
                <td>{this.props.category.name}</td>
                <td>
                    <Link to={"/CategoryEdit/" + this.props.category._id}>Edit</Link>                  
                </td>
                <td>
					{ this.props.category.used == false ?  <Link to={"/CategoryDelete/" + this.props.category._id}>Delete</Link>  : ""}	
                      
                </td>
            </tr>
        )
    }
}