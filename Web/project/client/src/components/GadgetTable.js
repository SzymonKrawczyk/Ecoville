import React, {Component} from "react"
import {Link} from "react-router-dom"
import GadgetTableRow from "./GadgetTableRow"

import LinkInClass from "../components/LinkInClass"

export default class GadgetTable extends Component 
{

	constructor(props) {		
		super(props)
		
		this.state = {
			_gadgetTable: [],
			lastSortedBy: "",
			lastSortingOrder: 0
		}
    }
	
	componentDidMount() {
		this.setState._gadgetTable = this.props.gadgetTable;
		console.log('componentDidMount:')
		console.log(this.state._gadgetTable)
	  }

	componentDidUpdate(prevProps) {
		if(prevProps.gadgetTable != this.props.gadgetTable ){
			this.setState({_gadgetTable: this.props.gadgetTable}) 
			console.log('componentDidUpdate:')
			console.log(this.state._gadgetTable)
		}
	  }



	sortGadgets = (e) => {

		var sorters = {
			byName : function(a,b) {
				console.log("a: " + a.name + ", b: " + b.name )
				return ((a.name.toUpperCase() <b.name.toUpperCase()) ? -1 : ((a.name.toUpperCase() > b.name.toUpperCase()) ? 1 : 0));
			},
			byCost : function(a,b) {
				return (a.amount - b.amount);
			},
			byAmount : function(a,b) {
				return (a.amount - b.amount);
			},
		};

		console.log('sortGadgets: ' + e.target.innerText)

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
					this.state._gadgetTable.sort(sorters.byName);
				}else{
					this.state._gadgetTable.sort(sorters.byName).reverse();
				}
			  	break;
			case 'Cost':
				if(this.state.lastSortingOrder==1){
					this.state._gadgetTable.sort(sorters.byCost);
				}else{
					this.state._gadgetTable.sort(sorters.byCost).reverse();
				}
				break;
			case 'Amount':
				if(this.state.lastSortingOrder==1){
					this.state._gadgetTable.sort(sorters.byAmount);
				}else{
					this.state._gadgetTable.sort(sorters.byAmount).reverse();
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
						<td> <LinkInClass className="linkInClass" value="Name" onClick={this.sortGadgets}/> </td>
						<td> <LinkInClass className="linkInClass" value="Cost" onClick={this.sortGadgets}/> </td>
						<td> <LinkInClass className="linkInClass" value="Amount" onClick={this.sortGadgets}/> </td>
					</tr>
				</thead>
				<tbody>
					{this.state._gadgetTable.map((gadget) => <GadgetTableRow key={gadget._id} gadget={gadget}/>)}
					
					
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
							<Link to={"/GadgetAdd"}>Create new</Link>		
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