import React, {Component} from "react"
import {Link} from "react-router-dom"
import AdministratorTableRow from "./AdministratorTableRow"


export default class AdministratorTable extends Component 
{
    render() 
    {
        return (
			<table className="table">
				<thead>
					<tr>
						<td>Username</td>
						<td></td>
						<td></td>
					</tr>
				</thead>
				<tbody>
					{this.props.adminTable.map((admin) => <AdministratorTableRow key={admin._id} admin={admin}/>)}
					
					
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
							<Link to={"/AdministratorAdd"}>Create new</Link>		
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