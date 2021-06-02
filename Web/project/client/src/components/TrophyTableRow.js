import React, {Component} from "react"
import {Link} from "react-router-dom"



export default class TrophyTableRow extends Component 
{    
    render() 
    {
        return (
            <tr>
                <td>{this.props.trophy.name}</td>
                <td>{this.props.trophy.cost}</td>
                <td>
                    <Link to={"/TrophyEdit/" + this.props.trophy._id}>Edit</Link>                  
                </td>
                <td>
                    <Link to={"/TrophyDelete/" + this.props.trophy._id}>Delete</Link>    
                </td>
            </tr>
        )
    }
}