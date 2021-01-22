import React, {Component} from "react"
import {Link} from "react-router-dom"
import AdministratorTableRow from "./AdministratorTableRow"

import LinkInClass from "../components/LinkInClass"


export default class AdministratorTable extends Component 
{

	constructor(props) {		
		super(props)
		
		this.state = {
			_administratorTable: [],
			lastSortedBy: "",
			lastSortingOrder: 0
		}
    }
	
	componentDidMount() {
		this.setState._administratorTable = this.props.adminTable;
		console.log('componentDidMount:')
		console.log(this.props.adminTable)
		console.log(this.state._administratorTable)
	  }

	componentDidUpdate(prevProps) {
		if(prevProps.adminTable != this.props.adminTable ){
			this.setState({_administratorTable: this.props.adminTable}) 
			console.log('componentDidUpdate:')
			console.log(this.props.adminTable)
			console.log(this.state._administratorTable)
		}
	  }



	  sortAdministrators = (e) => {

		var sorters = {
			byName : function(a,b) {
				return ((a.username.toUpperCase() <b.username.toUpperCase()) ? -1 : ((a.username.toUpperCase() > b.username.toUpperCase()) ? 1 : 0));
			}
		};

		console.log('sortAdministrators: ' + e.target.innerText)

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
			case 'Username':
				if(this.state.lastSortingOrder==1){
					this.state._administratorTable.sort(sorters.byName);
				}else{
					this.state._administratorTable.sort(sorters.byName).reverse();
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
						<td> <LinkInClass className="linkInClass" value="Username" onClick={this.sortAdministrators}/> </td>
						<td></td>
						<td></td>
					</tr>
				</thead>
				<tbody>
					{this.state._administratorTable.map((admin) => <AdministratorTableRow key={admin._id} admin={admin}/>)}
					
					
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