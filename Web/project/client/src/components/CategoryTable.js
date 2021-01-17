import React, {Component} from "react"
import {Link} from "react-router-dom"
import CategoryTableRow from "./CategoryTableRow"


export default class CategoryTable extends Component 
{
    render() 
    {
        return (
			<table className="table">
				<thead>
					<tr>
						<td>Category name</td>
						<td></td>
						<td></td>
					</tr>
				</thead>
				<tbody>
					{this.props.categoryTable.map((category) => <CategoryTableRow key={category._id} category={category}/>)}
					
					
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
							<Link to={"/CategoryAdd"}>Create new</Link>		
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