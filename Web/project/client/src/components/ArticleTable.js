import React, {Component} from "react"
import {Link} from "react-router-dom"
import ArticleTableRow from "./ArticleTableRow"

import LinkInClass from "../components/LinkInClass"

export default class ArticleTable extends Component 
{

	constructor(props) {		
		super(props)
		
		this.state = {
			_articleTable: [],
			lastSortedBy: "",
			lastSortingOrder: 0
		}
    }
	
	componentDidMount() {
		this.setState._articleTable = this.props.articleTable;
		console.log('componentDidMount:')
		console.log(this.state._articleTable)
	  }

	componentDidUpdate(prevProps) {
		if(prevProps.articleTable != this.props.articleTable ){
			this.setState({_articleTable: this.props.articleTable}) 
			console.log('componentDidUpdate:')
			console.log(this.state._articleTable)
		}
	  }



	sortArticles = (e) => {

		var sorters = {
			byTitle : function(a,b) {
				return ((a.title.toUpperCase() <b.title.toUpperCase()) ? -1 : ((a.title.toUpperCase() > b.title.toUpperCase()) ? 1 : 0));
			},
			byLikes : function(a,b) {
				return (a.likedBy.length - b.likedBy.length);
			},
			byAdded : function(a,b) {
				return (a.added._seconds - b.added._seconds);
			},
		};

		console.log('sortArticles: ' + e.target.innerText)

		var valueToSortBy = ""
		valueToSortBy = e.target.innerText

		if(this.state.lastSortingOrder == 0){
			this.state.lastSortingOrder = 1
		}else{
			if(this.state.lastSortedBy == valueToSortBy){
				this.state.lastSortingOrder *= -1
			}else{
				this.state.lastSortingOrder = 1
			}
		}
		this.state.lastSortedBy = valueToSortBy;


		switch (valueToSortBy) {
			case 'Title':
				if(this.state.lastSortingOrder==1){
					this.state._articleTable.sort(sorters.byTitle);
				}else{
					this.state._articleTable.sort(sorters.byTitle).reverse();
				}
			  	break;
			case 'Likes':
				if(this.state.lastSortingOrder==1){
					this.state._articleTable.sort(sorters.byLikes);
				}else{
					this.state._articleTable.sort(sorters.byLikes).reverse();
				}
				break;
			case "Added" :
				if(this.state.lastSortingOrder==1){
					this.state._articleTable.sort(sorters.byAdded);
				}else{
					this.state._articleTable.sort(sorters.byAdded).reverse();
				}
				break;
			default:
			  console.log("No sort function for: " + valueToSortBy);
		  }
		this.forceUpdate()
	}

    render() 
    {
        return (
			<table className="table">
				<thead>
					<tr>
						<td> <LinkInClass className="linkInClass" value="Title" onClick={this.sortArticles}/> </td>
						<td> <LinkInClass className="linkInClass" value="Likes" onClick={this.sortArticles}/> </td>
						<td> <LinkInClass className="linkInClass" value="Added" onClick={this.sortArticles}/> </td>
					</tr>
				</thead>
				<tbody>
					{this.state._articleTable.map((article) => <ArticleTableRow key={article._id} article={article}/>)}
					
					
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