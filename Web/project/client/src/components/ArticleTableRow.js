import React, {Component} from "react"
import {Link} from "react-router-dom"



export default class ArticleTableRow extends Component 
{    
    render() 
    {
        const d = new Date(this.props.article.added._seconds * 1000);
		const dateString = ("0" + d.getDate()).slice(-2) + "/" + ("0"+(d.getMonth()+1)).slice(-2) + "/" +
		    d.getFullYear() + " " + ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2);


        return (
            <tr>
                <td>{this.props.article.title}</td>
                <td>{this.props.article.likedBy.length}</td>
                <td>{dateString}</td>

                <td>
                    <Link to={"/ArticleEdit/" + this.props.article._id}>Details/Edit</Link>                  
                </td>
                <td>
                    <Link to={"/ArticleDelete/" + this.props.article._id}>Delete</Link>    
                </td>
            </tr>
        )
    }
}