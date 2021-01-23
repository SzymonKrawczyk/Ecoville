import React, {Component} from "react"
import {Link} from "react-router-dom"
import MissionTableRow from "./MissionTableRow"

import LinkInClass from "../components/LinkInClass"

export default class MissionTable extends Component 
{

	constructor(props) {		
		super(props)
		
		this.state = {
			_missionTable: [],
			lastSortedBy: "",
			lastSortingOrder: 0
		}
    }
	
	componentDidMount() {
		this.setState._missionTable = this.props.missionTable;
		console.log('componentDidMount:')
		console.log(this.state._missionTable)
	  }

	componentDidUpdate(prevProps) {
		if(prevProps.missionTable != this.props.missionTable ){
			this.setState({_missionTable: this.props.missionTable}) 
			console.log('componentDidUpdate:')
			console.log(this.state._missionTable)
		}
	  }



	sortMissions = (e) => {

		var sorters = {
			byName : function(a,b) {
				return ((a.name.toUpperCase() <b.name.toUpperCase()) ? -1 : ((a.name.toUpperCase() > b.name.toUpperCase()) ? 1 : 0));
			},
			byCategory : function(a,b) {
				return ((a.category.toUpperCase() <b.category.toUpperCase()) ? -1 : ((a.category.toUpperCase() > b.category.toUpperCase()) ? 1 : 0));
			},
			byPoints : function(a,b) {
				return (a.points - b.points);
			},
			byParticipants : function(a,b) {
				return (a.currentParticipants - b.currentParticipants);
			},
			byDate : function(a,b) {
				return (a.when._seconds - b.when._seconds);
			},
		};

		console.log('sortMissions: ' + e.target.innerText)

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
					this.state._missionTable.sort(sorters.byName);
				}else{
					this.state._missionTable.sort(sorters.byName).reverse();
				}
			  	break;
			case 'Category':
				if(this.state.lastSortingOrder==1){
					this.state._missionTable.sort(sorters.byCategory);
				}else{
					this.state._missionTable.sort(sorters.byCategory).reverse();
				}
				break;
			case 'Points':
				if(this.state.lastSortingOrder==1){
					this.state._missionTable.sort(sorters.byPoints);
				}else{
					this.state._missionTable.sort(sorters.byPoints).reverse();
				}
				break;
			case "Participants" :
				if(this.state.lastSortingOrder==1){
					this.state._missionTable.sort(sorters.byParticipants);
				}else{
					this.state._missionTable.sort(sorters.byParticipants).reverse();
				}
				break;
			case "Date" :
				if(this.state.lastSortingOrder==1){
					this.state._missionTable.sort(sorters.byDate);
				}else{
					this.state._missionTable.sort(sorters.byDate).reverse();
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
			<table className="table table_missions table_data">
				<thead>
					<tr>
						<td> <LinkInClass className="linkInClass" value="Name" onClick={this.sortMissions}/> </td>
						<td> <LinkInClass className="linkInClass" value="Category" onClick={this.sortMissions}/> </td>
						<td> <LinkInClass className="linkInClass" value="Points" onClick={this.sortMissions}/> </td>
						<td> <LinkInClass className="linkInClass" value="Participants" onClick={this.sortMissions}/> </td>
						<td> <LinkInClass className="linkInClass" value="Date" onClick={this.sortMissions}/> </td>
						<td></td>
						<td></td>
					</tr>
				</thead>
				<tbody>
					{this.state._missionTable.map((mission) => <MissionTableRow key={mission._id} mission={mission}/>)}
					
					
					<tr>
						<td> &nbsp; </td>
						<td> &nbsp; </td>
						<td> &nbsp; </td>
						<td> &nbsp; </td>
						<td> &nbsp; </td>
						<td> &nbsp; </td>
						<td> &nbsp; </td>
					</tr>
					<tr>
						<td>
							<Link to={"/MissionAdd"}>Create new</Link>		
						</td>
						<td> &nbsp; </td>
						<td> &nbsp; </td>
						<td> &nbsp; </td>
						<td> &nbsp; </td>
						<td> &nbsp; </td>
						<td> &nbsp; </td>
					</tr>
					<tr>
						<td>
							<Link to={"/Panel"}>Back</Link>	
						</td>
						<td> &nbsp; </td>
						<td> &nbsp; </td>
						<td> &nbsp; </td>
						<td> &nbsp; </td>
						<td> &nbsp; </td>
						<td> &nbsp; </td>
					</tr>
				</tbody>
			</table>
		
		
             
				
        )
    }
}