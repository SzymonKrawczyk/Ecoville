import React, {Component} from "react"
import {Link} from "react-router-dom"
import MessageTableRow from "./MessageTableRow"

import LinkInClass from "../components/LinkInClass"

export default class MessageTable extends Component 
{

	constructor(props) {		
		super(props)
		
		this.state = {
			_messageTable: [],
			lastSortedBy: "",
			lastSortingOrder: 0
		}
    }
	
	componentDidMount() {
		this.setState._messageTable = this.props.messageTable;
		console.log('componentDidMount:')
		console.log(this.state._messageTable)
	  }

	componentDidUpdate(prevProps) {
		if(prevProps.messageTable != this.props.messageTable ){
			this.setState({_messageTable: this.props.messageTable}) 
			console.log('componentDidUpdate:')
			console.log(this.state._messageTable)
		}
	  }



	sortMessages = (e) => {

		var sorters = {
			byAutor : function(a,b) {
				return ((a.author.toUpperCase() <b.author.toUpperCase()) ? -1 : ((a.author.toUpperCase() > b.author.toUpperCase()) ? 1 : 0));
			},
			byContent : function(a,b) {
				return ((a.content.toUpperCase() <b.content.toUpperCase()) ? -1 : ((a.content.toUpperCase() > b.content.toUpperCase()) ? 1 : 0));
			},
			byTimestamp : function(a,b) {
				return (a.timestamp._seconds - b.timestamp._seconds);
			},
		};

		console.log('sortMessages: ' + e.target.innerText)

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
			case 'Author':
				if(this.state.lastSortingOrder==1){
					this.state._messageTable.sort(sorters.byAutor);
				}else{
					this.state._messageTable.sort(sorters.byAutor).reverse();
				}
			  	break;
			case 'Timestamp':
				if(this.state.lastSortingOrder==1){
					this.state._messageTable.sort(sorters.byTimestamp);
				}else{
					this.state._messageTable.sort(sorters.byTimestamp).reverse();
				}
				break;
			case 'Message Content':
				if(this.state.lastSortingOrder==1){
					this.state._messageTable.sort(sorters.byContent);
				}else{
					this.state._messageTable.sort(sorters.byContent).reverse();
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
			<table className="table table_msg">
				<thead>
					<tr>
						<td> <LinkInClass className="linkInClass" value="Author" onClick={this.sortMessages}/> </td>
						<td> <LinkInClass className="linkInClass" value="Timestamp" onClick={this.sortMessages}/> </td>
						<td> <LinkInClass className="linkInClass" value="Message Content" onClick={this.sortMessages}/> </td>
						<td></td>
					</tr>
				</thead>
				<tbody>
					{this.state._messageTable.map((message) => <MessageTableRow key={message._id} message={message}/>)}
					
					
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