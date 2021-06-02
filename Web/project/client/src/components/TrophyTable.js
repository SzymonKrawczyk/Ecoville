import React, {Component} from "react"
import {Link} from "react-router-dom"
import TrophyTableRow from "./TrophyTableRow"

import LinkInClass from "../components/LinkInClass"

export default class TrophyTable extends Component 
{

	constructor(props) {		
		super(props)
		
		this.state = {
			_trophyTable: [],
			lastSortedBy: "",
			lastSortingOrder: 0
		}
    }
	
	componentDidMount() {
		this.setState._trophyTable = this.props.trophyTable;
		console.log('componentDidMount:')
		console.log(this.state._trophyTable)
	  }

	componentDidUpdate(prevProps) {
		if(prevProps.trophyTable != this.props.trophyTable ){
			this.setState({_trophyTable: this.props.trophyTable}) 
			console.log('componentDidUpdate:')
			console.log(this.state._trophyTable)
		}
	  }



	sortTrophies = (e) => {

		var sorters = {
			byName : function(a,b) {
				console.log("a: " + a.name + ", b: " + b.name )
				return ((a.name.toUpperCase() <b.name.toUpperCase()) ? -1 : ((a.name.toUpperCase() > b.name.toUpperCase()) ? 1 : 0));
			},
			byMediaPath : function(a,b) {
				return ((a.image.toUpperCase() <b.image.toUpperCase()) ? -1 : ((a.image.toUpperCase() > b.image.toUpperCase()) ? 1 : 0));
			},
			byCost : function(a,b) {
				return (a.cost - b.cost);
			},
		};

		console.log('sortTrophies: ' + e.target.innerText)

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
			case 'Name':
				if(this.state.lastSortingOrder==1){
					this.state._trophyTable.sort(sorters.byName);
				}else{
					this.state._trophyTable.sort(sorters.byName).reverse();
				}
			  	break;
			case 'Cost':
				if(this.state.lastSortingOrder==1){
					this.state._trophyTable.sort(sorters.byCost);
				}else{
					this.state._trophyTable.sort(sorters.byCost).reverse();
				}
				break;
			case 'Media Path':
				if(this.state.lastSortingOrder==1){
					this.state._trophyTable.sort(sorters.byMediaPath);
				}else{
					this.state._trophyTable.sort(sorters.byMediaPath).reverse();
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
						<td> <LinkInClass className="linkInClass" value="Name" onClick={this.sortTrophies}/> </td>
						<td> <LinkInClass className="linkInClass" value="Cost" onClick={this.sortTrophies}/> </td>
					</tr>
				</thead>
				<tbody>
					{this.state._trophyTable.map((trophy) => <TrophyTableRow key={trophy._id} trophy={trophy}/>)}
					
					
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
						
						<td> &nbsp; </td>
						<td> &nbsp; </td>
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