import React, { Component } from "react";
import { Link } from "react-router-dom"
import Logo from "../logo.svg"
import "./pages.css"

class Documentation extends Component {
    render(){
        //^^//console.log(this.props.location.state)
        window.open(this.props.location.state)
        return (
            <div className="header">
                <h2>Documentation</h2>
                <p>A new window will open</p>
                <Link className ="App-link" to= "/">Link to Main Application</Link>
                <img className="about-img" width="275" src={Logo} alt=""/>
            </div>
        )
    }
}

// const Documentation = () => {
//     //^^//console.log("this is the process.env", process.env)
//     window.open(process.env.PUBLIC_URL + '/docs/build/index.html')
//     // <img  id="small-icon" src={process.env.PUBLIC_URL + '/favicon.ico'} />
//     return (
//         <div className="header">
//             <h2>Documentation</h2>
//             <p>A new window will open</p>
//             <Link className ="App-link" to= "/">Link to Main Application</Link>
//             <img className="about-img" width="275" src={Logo} alt=""/>
//         </div>
//     )
// }

export default Documentation