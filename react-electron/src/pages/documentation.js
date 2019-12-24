import React from "react"
import { Link } from "react-router-dom"
import Logo from "../logo.svg"
import "./pages.css"

const Documentation = () => {
    window.open('file:///C:\\Users\\devops2\\Documents\\GitHub\\aws-sam-s3-bucket-trigger-api\\docs\\build\\html\\index.html')
    return (
        <div className="header">
            <h2>Documentation</h2>
            <p>A new window will open</p>
            <Link className ="App-link" to= "/">Link to Home</Link>
            <img className="about-img" width="275" src={Logo} alt=""/>
        </div>
    )
}

export default Documentation