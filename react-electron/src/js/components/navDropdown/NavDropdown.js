import React from 'react'
import { Nav, NavDropdown } from 'react-bootstrap'
import './NavDropdown.scss'

// DROPDOWN OPTIONS AND THEIR CORRESPONDING ROUTES
const SYNCING = 'Syncing'
const SYNCING_ROUTE = '/app'
const JOB_STATUS = 'Job Status'
const JOB_STATUS_ROUTE = '/jobstatus'
const DRC = 'DRC'
const DRC_ROUTE = '/drc'
const LOGIN = 'Log in'
const LOGIN_ROUTE = '/login'

let dropdownRouteMappings = {}
dropdownRouteMappings[SYNCING] = SYNCING_ROUTE
dropdownRouteMappings[JOB_STATUS] = JOB_STATUS_ROUTE
dropdownRouteMappings[DRC] = DRC_ROUTE
dropdownRouteMappings[LOGIN] = LOGIN_ROUTE 

function handleSelect(that, eventKey) {
  that.props.history.push(dropdownRouteMappings[eventKey]);
}

function NavDropdownComponent() {
  return (
    <Nav 
      variant="pills" 
      activeKey="1" 
      onSelect={(eventKey) => (handleSelect(this, eventKey))} 
      className="navDropdownWrapper"
      style={{
        paddingLeft:0,
        paddingRight:0,
        paddingBottom:0,
        zIndex:10000000
      }}
    >
      <NavDropdown
        className="navDropdown"
        title={
          <span className="navDropdownLabel" id="navDropdownLabel" >Views</span>
        }
        id="nav-dropdown"
      >
        <NavDropdown.Item 
          eventKey={SYNCING}
        >
          {SYNCING}
        </NavDropdown.Item>
        <NavDropdown.Divider />
        <NavDropdown.Item eventKey={JOB_STATUS}>{JOB_STATUS}</NavDropdown.Item>
        <NavDropdown.Divider />
        <NavDropdown.Item eventKey={LOGIN}>{LOGIN}</NavDropdown.Item>
      </NavDropdown>
    </Nav>
  );
}

export default NavDropdownComponent;