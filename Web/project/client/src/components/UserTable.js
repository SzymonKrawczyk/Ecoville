import React, {Component} from "react"
import {Link} from "react-router-dom"
import UserTableRow from "./UserTableRow"


export default class UserTable extends Component 
{
    render() 
    {
        return (
			<table className="table">
				<thead>
					<tr>
						<td>Name</td>
						<td>Email</td>
						<td>Points Current/Total</td>
                        <td>Created</td>
					</tr>
				</thead>
				<tbody>
					{this.props.userTable.map((user) => <UserTableRow key={user._id} user={user}/>)}
				
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