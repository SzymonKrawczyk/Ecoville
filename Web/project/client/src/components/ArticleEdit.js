import React, {Component} from "react"
import {Redirect, Link} from "react-router-dom"
import axios from "axios"

import LinkInClass from "../components/LinkInClass"

import {ACCESS_LEVEL_GUEST, ACCESS_LEVEL_ADMIN, SERVER_HOST} from "../config/global_constants"

export default class ArticleEdit extends Component  {
	
    constructor(props)  {
        super(props)
		console.log("const edit")
        this.state = {
            title: ``
            , likedBy: 0
            , shortDescription: ``
            , content: ``
            , added: ""
			, source: ""
			, errorMessage: {}
			, redirectToArticlesList: sessionStorage.accessLevel < ACCESS_LEVEL_ADMIN
			, logout: false
			, canSubmit: true
        }
    }

    componentDidMount() { 
	
        this.inputToFocus.focus()
  
        axios.defaults.withCredentials = true // needed for sessions to work
        axios.get(`${SERVER_HOST}/article/${this.props.match.params.id}`)
        .then(res =>  {    
    
            if(res.data) {
            
				if (res.data.isLogged == false || res.data.isAdmin == false) {
					
					this.setState({logout: true});
					
					sessionStorage.clear();
                    sessionStorage.username = "GUEST";
                    sessionStorage.accessLevel = ACCESS_LEVEL_GUEST;
					
                    console.log('logout, server restart');
				}
				
                if (res.data.errorMessage) {
					
					console.log(res.data.errorMessage);
                    this.setState({
                        errorMessage: res.data.errorMessage
                    });
					
                } else { 
                
                    const d = new Date(res.data.added._seconds * 1000);
		            const dateString = ("0" + d.getDate()).slice(-2) + "/" + ("0"+(d.getMonth()+1)).slice(-2) + "/" +
		                d.getFullYear() + " " + ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2);

                    var likes = 0;
                    if( res.data.likedBy != null ){
                        likes = res.data.likedBy.length;
                    }

                    this.setState({
                        title: res.data.title,
                        likedBy: res.data.likes,
                        shortDescription: res.data.shortDescription,
                        content: res.data.content,
                        added: dateString,
						source: res.data.source
                    });
                }
				
            } else {
				
                console.log(`Record not found`);
            }
        })
    }


    handleChange = (e) =>  {
		
        this.setState({[e.target.name]: e.target.value})
    }
	
	validate = () => {
		
		for (var key in this.state) {
			if (typeof(this.state[key]) == 'string'){
				this.state[key] = this.state[key].trim();
			}
		}
		
        let titleValidation = this.state.title.length >=5;
        let shortDescriptionValidation = this.state.shortDescription.length >= 16;
        let contentValidation = this.state.content.length >= 64;
		
		this.setState({errorMessage: {
              titleError: titleValidation ? null : 'title has to be at least 5 characters long',
              shortDescriptionError: shortDescriptionValidation ? null : 'short description has to be at least 16 characters long',
              contentError: contentValidation ? null : 'content has to be at least 64 characters long',
		}}) 
        return titleValidation && shortDescriptionValidation && contentValidation;
	}


    handleSubmit = (e) =>  {
		
        e.preventDefault();
		
		if (this.validate() && this.state.canSubmit){

			this.state.canSubmit = false;

			const articleObject = {
                title: this.state.title,
                shortDescription: this.state.shortDescription,
                content: this.state.content,
				source: this.state.source
			};

			axios.defaults.withCredentials = true // needed for sessions to work
			axios.put(`${SERVER_HOST}/article/${this.props.match.params.id}`, articleObject)
			.then(res =>  {    
			
				this.state.canSubmit = true;

				if(res.data) {
					
					if (res.data.isLogged == false || res.data.isAdmin == false) {
						
						this.setState({logout: true});
						
						sessionStorage.clear() 
						sessionStorage.username = "GUEST"
						sessionStorage.accessLevel = ACCESS_LEVEL_GUEST
					}
					if (res.data.errorMessage) {
						
						console.log(res.data.errorMessage);
						this.setState({
							errorMessage: res.data.errorMessage
						});
						
					} else {  
					
						console.log(`Record updated`)
						this.setState({redirectToArticlesList:true})
					}
				} else {
					console.log(`Record not updated`)
				}
			})
		}
    }


    render() {
		
		document.title = 'Articles | Edit'
        return (
		
		<div className="body_content">
			{this.state.logout ? <Redirect to="/Login"/> : null} 
            {this.state.redirectToArticlesList ? <Redirect to="/ArticlesList"/> : null} 
			<div className="card_standard">
		
				<div className="card_title_container">
					<div className="card_standard card_title">
						<h2>Articles | Edit</h2>
					</div>
				</div>
		
				<table className="table table_create_edit">
					<tbody>

					    <tr>
						    <td>
							    Title
						    </td>
					    	<td>
                                <input 
                                className="input" 
                                type="text" 
                                name="title" 
                                ref = {(input) => { this.inputToFocus = input }}
                                value={this.state.title}
                                onChange={this.handleChange}/>
						    </td>
						    <td>
							    <span className="error_msg">{this.state.errorMessage.titleError}</span>
						    </td>
					    </tr>

                        <tr>
						    <td>
							    Likes
						    </td>
						    <td>
							    {this.state.likedBy}
						    </td>
						    <td> </td>
					    </tr>
					    <tr>
						    <td>
							    Created
						    </td>
						    <td>
							    {this.state.added}
						    </td>
						    <td> </td>
					    </tr>

                        <tr>
							<td>
                            	Short Description
							</td>
							<td>
								<textarea 
								className="input textarea" 
                                type="text"
                                name="shortDescription" 
								value={this.state.shortDescription}
								onChange={this.handleChange}
								/>
							</td>
							<td>
								<span className="error_msg">{this.state.errorMessage.shortDescriptionError}</span>
							</td>
						</tr>

                        <tr>
							<td>
                            Content
							</td>
							<td>
								<textarea 
								className = "input textarea" 
								type = "text"
								name = "content"
								value = {this.state.content}
								onChange = {this.handleChange}
								/>
							</td>
							<td>
								<span className="error_msg">{this.state.errorMessage.contentError}</span>
							</td>
						</tr>
						
						<tr>
							<td>
                            Source<br/>(optional)
							</td>
							<td>
								<textarea 
								className = "input textarea" 
								type = "text"
								name = "source"
								value = {this.state.source}
								onChange = {this.handleChange}
								/>
							</td>
							<td>
								
							</td>
						</tr>

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
								<LinkInClass className="linkInClass" value="Save" onClick={this.handleSubmit}/>
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
								<Link to={"/ArticlesList"}>Back</Link>
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
			</div>
		</div>		
        )
    }
}