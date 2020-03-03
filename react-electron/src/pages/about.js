import React from "react"
import { Link } from "react-router-dom"
import Logo from "../logo.svg"
import "./pages.css"

const About = () => {
    return (
        <div className="header">
            <h2>Welcome to the About Page</h2>
            <p>This is a companion application to enable users to type in the necessary information to send jobs for further processing.</p>
            <Link className ="App-link" to= "/">Link to Main Application</Link>
            <img className="about-img" width="275" src={Logo} alt=""/>
        </div>
    )
}

export default About