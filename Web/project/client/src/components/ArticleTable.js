import React, {Component} from "react"
import {Link} from "react-router-dom"
import ArticleTableRow from "./ArticleTableRow"


export default class ArticleTable extends Component 
{
    render() 
    {
        return (
			<table className="table">
				<thead>
					<tr>
						<td>Title</td>
						<td>Likes</td>
						<td>Added</td>
					</tr>
				</thead>
				<tbody>
					{this.props.articleTable.map((article) => <ArticleTableRow key={article._id} article={article}/>)}
					
					
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
							<Link to={"/ArticleAdd"}>Create new</Link>		
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