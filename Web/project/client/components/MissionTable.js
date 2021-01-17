import React, {Component} from "react"
import {Link} from "react-router-dom"
import MissionTableRow from "./MissionTableRow"


export default class MissionTable extends Component 
{
    render() 
    {
        return (
			<table className="table table_missions">
				<thead>
					<tr>
						<td>Name</td>
						<td>Category</td>
						<td>Points</td>
						<td>Participants</td>
						<td>Date</td>
						<td></td>
						<td></td>
					</tr>
				</thead>
				<tbody>
					{this.props.missionTable.map((mission) => <MissionTableRow key={mission._id} mission={mission}/>)}
					
					
					<tr>
						<td> &nbsp; </td>
						<td> &nbsp; </td>
						<td> &nbsp; </td>
						<td> &nbsp; </td>
						<td> &nbsp; </td>
						<td> &nbsp; </td>
						<td> &nbsp; </td>
					</tr>
					<tr>
						<td>
							<Link to={"/MissionAdd"}>Create new</Link>		
						</td>
						<td> &nbsp; </td>
						<td> &nbsp; </td>
						<td> &nbsp; </td>
						<td> &nbsp; </td>
						<td> &nbsp; </td>
						<td> &nbsp; </td>
					</tr>
					<tr>
						<td>
							<Link to={"/Panel"}>Back</Link>	
						</td>
						<td> &nbsp; </td>
						<td> &nbsp; </td>
						<td> &nbsp; </td>
						<td> &nbsp; </td>
						<td> &nbsp; </td>
						<td> &nbsp; </td>
					</tr>
				</tbody>
			</table>
		
		
             
				
        )
    }
}