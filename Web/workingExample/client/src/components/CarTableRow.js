import React, {Component} from "react"
import {Link} from "react-router-dom"

import {ACCESS_LEVEL_GUEST, ACCESS_LEVEL_ADMIN} from "../config/global_constants"


export default class CarTableRow extends Component 
{    
    render() 
    {
        return (
            <tr>
                <td>{this.props.car.model}</td>
                <td>{this.props.car.colour}</td>
                <td>{this.props.car.year}</td>
                <td>{this.props.car.price}</td>
                <td> </td>
            </tr>
        )
    }
}