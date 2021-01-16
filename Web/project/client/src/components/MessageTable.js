import React, {Component} from "react"
import {Link} from "react-router-dom"
import MessageTableRow from "./MessageTableRow"


export default class MessageTable extends Component 
{
    render() 
    {
        return (
			<table className="table table_msg">
				<thead>
					<tr>
						<td>Author</td>
						<td>Timestamp</td>
						<td>Message Content</td>
						<td></td>
					</tr>
				</thead>
				<tbody>
					{this.props.messageTable.map((message) => <MessageTableRow key={message._id} message={message}/>)}
					
					
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
						<td>
							&nbsp;
						</td>
					</tr>
				</tbody>
			</table>
		
		
             
				
        )
    }
}