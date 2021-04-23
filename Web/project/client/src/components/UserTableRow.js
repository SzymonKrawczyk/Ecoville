import React, {Component} from "react"
import {Link} from "react-router-dom"



export default class UserTableRow extends Component 
{    
    render() 
    {
        const d = new Date(this.props.user.created._seconds * 1000);
		const dateString = ("0" + d.getDate()).slice(-2) + "/" + ("0"+(d.getMonth()+1)).slice(-2) + "/" +
		    d.getFullYear() + " " + ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2);

        const fullName = this.props.user.firstName + " " + this.props.user.lastName;
        const points = this.props.user.currentPoints + "/" + this.props.user.totalPointsSum;

        return (
            <tr>
                <td>{fullName}</td>
                <td>{this.props.user.email}</td>
                <td>{points}</td>
                <td>{dateString}</td>

                <td>
                    <Link to={"/UserEdit/" + this.props.user._id}>Details/Edit</Link>                  
                </td>
            </tr>
        )
    }
}