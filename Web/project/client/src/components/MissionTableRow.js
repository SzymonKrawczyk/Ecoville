import React, {Component} from "react"
import {Link} from "react-router-dom"



export default class MissionTableRow extends Component 
{    
    render() 
    {
		const d = new Date(this.props.mission.when._seconds * 1000);
		const dateString = ("0" + d.getDate()).slice(-2) + "/" + ("0"+(d.getMonth()+1)).slice(-2) + "/" +
		d.getFullYear() + " " + ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2);
        return (
            <tr>
                <td>{this.props.mission.name}</td>
				<td>{this.props.mission.category}</td>
				<td>{this.props.mission.points}</td>
				<td>{this.props.mission.currentParticipants} / {this.props.mission.totalParticipants}</td>
				<td>{dateString}</td>
                <td>
                    <Link to={"/MissionEdit/" + this.props.mission._id}>Details / Edit</Link>                  
                </td>
                <td>
                    <Link to={"/MissionDelete/" + this.props.mission._id}>Delete</Link>    
                </td>
            </tr>
        )
    }
}