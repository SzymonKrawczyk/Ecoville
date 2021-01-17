import React, {Component} from "react"
import {Link} from "react-router-dom"
import TrophyTableRow from "./TrophyTableRow"


export default class TrophyTable extends Component 
{
    render() 
    {
        return (
			<table className="table">
				<thead>
					<tr>
						<td>Name</td>
						<td>Cost</td>
						<td>Media Path</td>
					</tr>
				</thead>
				<tbody>
					{this.props.trophyTable.map((trophy) => <TrophyTableRow key={trophy._id} trophy={trophy}/>)}
					
					
					<tr>
						<td>
							&nbsp;
						</td>
						<td>
							&nbsp;
						</td>
						<td>
							&nbsp;
						</td>
					</tr>
					<tr>
						<td>
							<Link to={"/TrophyAdd"}>Create new</Link>		
						</td>
						<td>
							&nbsp;
						</td>
						<td>
							&nbsp;
						</td>
					</tr>
					<tr>
						<td>
							<Link to={"/Panel"}>Back</Link>	
						</td>
						<td>
							&nbsp;
						</td>
						<td>
							&nbsp;
						</td>
					</tr>
				</tbody>
			</table>
        )
    }
}