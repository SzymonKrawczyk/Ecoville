import React, {Component} from "react"
import {Link} from "react-router-dom"



export default class GadgetTableRow extends Component 
{    
    render() 
    {
        return (
            <tr>
                <td>{this.props.gadget.name}</td>
                <td>{this.props.gadget.cost}</td>
                <td>{this.props.gadget.amount}</td>
                <td>
                    <Link to={"/GadgetEdit/" + this.props.gadget._id}>Edit</Link>                  
                </td>
                <td>
                    <Link to={"/GadgetDelete/" + this.props.gadget._id}>Delete</Link>    
                </td>
            </tr>
        )
    }
}