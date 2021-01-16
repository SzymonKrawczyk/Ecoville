import React, {Component} from "react"
import {Link} from "react-router-dom"



export default class MessageTableRow extends Component 
{    
	
    render() 
    {
		const d = new Date(this.props.message.timestamp._seconds * 1000);
		const dateString = ("0" + d.getDate()).slice(-2) + "/" + ("0"+(d.getMonth()+1)).slice(-2) + "/" +
		d.getFullYear() + " " + ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2);
        return (
            <tr>
                <td>{this.props.message.author}</td>
                <td>{dateString}</td>
                <td>{this.props.message.content}</td>                
                <td>
                    <Link to={"/MessageDelete/" + this.props.message._id}>Delete</Link>    
                </td>
            </tr>
        )
    }
}