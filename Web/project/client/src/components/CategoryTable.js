import React, {Component} from "react"
import {Link} from "react-router-dom"
import CategoryTableRow from "./CategoryTableRow"

import LinkInClass from "../components/LinkInClass"

export default class CategoryTable extends Component 
{

	constructor(props) {		
		super(props)
		
		this.state = {
			_categoryTable: [],
			lastSortedBy: "",
			lastSortingOrder: 0
		}
    }
	
	componentDidMount() {
		this.setState._categoryTable = this.props.categoryTable;
		console.log('componentDidMount:')
		console.log(this.state._categoryTable)
	  }

	componentDidUpdate(prevProps) {
		if(prevProps.categoryTable != this.props.categoryTable ){
			this.setState({_categoryTable: this.props.categoryTable}) 
			console.log('componentDidUpdate:')
			console.log(this.state._categoryTable)
		}
	  }



	sortCategories = (e) => {

		var sorters = {
			byName : function(a,b) {
				return ((a.name.toUpperCase() <b.name.toUpperCase()) ? -1 : ((a.name.toUpperCase() > b.name.toUpperCase()) ? 1 : 0));
			}
		};

		console.log('sortCategories: ' + e.target.innerText)

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
			case 'Category name':
				if(this.state.lastSortingOrder==1){
					this.state._categoryTable.sort(sorters.byName);
				}else{
					this.state._categoryTable.sort(sorters.byName).reverse();
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
			<table className="table table_data">
				<thead>
					<tr>
						<td> <LinkInClass className="linkInClass" value="Category name"onClick={this.sortCategories}/> </td>
						<td></td>
						<td></td>
					</tr>
				</thead>
				<tbody>
					{this.state._categoryTable.map((category) => <CategoryTableRow key={category._id} category={category}/>)}
					
					
					<tr className="force_white">
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