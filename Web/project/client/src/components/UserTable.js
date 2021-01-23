import React, {Component} from "react"
import {Link} from "react-router-dom"
import UserTableRow from "./UserTableRow"

import LinkInClass from "../components/LinkInClass"

export default class UserTable extends Component 
{

	constructor(props) {		
		super(props)
		
		this.state = {
			_userTable: [],
			lastSortedBy: "",
			lastSortingOrder: 0
		}
    }
	
	componentDidMount() {
		this.setState._userTable = this.props.userTable;
		console.log('componentDidMount:')
		console.log(this.state._userTable)
	  }

	componentDidUpdate(prevProps) {
		if(prevProps.userTable != this.props.userTable ){
			this.setState({_userTable: this.props.userTable}) 
			console.log('componentDidUpdate:')
			console.log(this.state._userTable)
		}
	  }



	sortUsers = (e) => {

		var sorters = {
			byName : function(a,b) {
				return ((a.firstName.toUpperCase() <b.firstName.toUpperCase()) ? -1 : ((a.firstName.toUpperCase() > b.firstName.toUpperCase()) ? 1 : 0));
			},
			byEmail : function(a,b) {
				return ((a.email.toUpperCase() <b.email.toUpperCase()) ? -1 : ((a.email.toUpperCase() > b.email.toUpperCase()) ? 1 : 0));
			},
			byPoints : function(a,b) {
				return (a.currentPoints - b.currentPoints);
			},
			byCreated : function(a,b) {
				return (a.created._seconds - b.created._seconds);
			},
		};

		console.log('sortUsers: ' + e.target.innerText)

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
					this.state._userTable.sort(sorters.byName);
				}else{
					this.state._userTable.sort(sorters.byName).reverse();
				}
			  	break;
			case 'Email':
				if(this.state.lastSortingOrder==1){
					this.state._userTable.sort(sorters.byEmail);
				}else{
					this.state._userTable.sort(sorters.byEmail).reverse();
				}
				break;
			case 'Points Current/Total':
				if(this.state.lastSortingOrder==1){
					this.state._userTable.sort(sorters.byPoints);
				}else{
					this.state._userTable.sort(sorters.byPoints).reverse();
				}
				break;
			case "Created" :
				if(this.state.lastSortingOrder==1){
					this.state._userTable.sort(sorters.byCreated);
				}else{
					this.state._userTable.sort(sorters.byCreated).reverse();
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
						<td> <LinkInClass className="linkInClass" value="Name" name="name" onClick={this.sortUsers}/> </td>
						<td> <LinkInClass className="linkInClass" value="Email" name="email" onClick={this.sortUsers}/> </td>
						<td> <LinkInClass className="linkInClass" value="Points Current/Total" onClick={this.sortUsers}/> </td>
						<td> <LinkInClass className="linkInClass" value="Created" onClick={this.sortUsers}/> </td>
					</tr>
				</thead>
				<tbody>

					{this.state._userTable.map((user) => <UserTableRow key={user._id} user={user}/>)}

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