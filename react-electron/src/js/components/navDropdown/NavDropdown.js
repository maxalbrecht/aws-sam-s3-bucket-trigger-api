import React from 'react'
import { Nav, NavDropdown } from 'react-bootstrap'
import './NavDropdown.scss'

// DROPDOWN OPTIONS AND THEIR CORRESPONDING ROUTES
const SYNCING = 'Sync'
const SYNCING_ROUTE = '/app'
const JOB_STATUS = 'Job Status'
const JOB_STATUS_ROUTE = '/jobstatus'
const JOB_ARCHIVING = 'Store'
const JOB_ARCHIVING_ROUTE = '/jobarchiving'
const FILE_STITCHING = 'Stitch' 
const FILE_STITCHING_ROUTE = '/filestitching'
const MPEG_CONVERSION = 'MPEG Conversion'
const MPEG_CONVERSION_ROUTE = '/mpegconversion'
const CONVERSION = 'conversion'
const CONVERSION_ROUTE = '/conversion'
const DRC = 'DRC'
const DRC_ROUTE = '/drc'
const LOGIN = 'Log in'
const LOGIN_ROUTE = '/login'

let dropdownRouteMappings = {}
dropdownRouteMappings[SYNCING] = SYNCING_ROUTE
dropdownRouteMappings[JOB_STATUS] = JOB_STATUS_ROUTE
dropdownRouteMappings[JOB_ARCHIVING] = JOB_ARCHIVING_ROUTE
dropdownRouteMappings[FILE_STITCHING] = FILE_STITCHING_ROUTE
dropdownRouteMappings[DRC] = DRC_ROUTE
dropdownRouteMappings[LOGIN] = LOGIN_ROUTE 
dropdownRouteMappings[MPEG_CONVERSION] = MPEG_CONVERSION_ROUTE
dropdownRouteMappings[CONVERSION] = CONVERSION_ROUTE

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
          <span className="navDropdownLabel" id="navDropdownLabel" >Functions</span>
        }
        id="nav-dropdown"
      >
        <NavDropdown.Item eventKey={FILE_STITCHING}>{FILE_STITCHING}</NavDropdown.Item>
        <NavDropdown.Divider />
        <NavDropdown.Item eventKey={MPEG_CONVERSION}>{MPEG_CONVERSION}</NavDropdown.Item>
        <NavDropdown.Divider />
        <NavDropdown.Item eventKey={SYNCING}>{SYNCING}</NavDropdown.Item>
        <NavDropdown.Divider />
        <NavDropdown.Item eventKey={JOB_ARCHIVING}>{JOB_ARCHIVING}</NavDropdown.Item>
        <NavDropdown.Divider />
        <NavDropdown.Item eventKey={LOGIN}>{LOGIN}</NavDropdown.Item>
      </NavDropdown>
    </Nav>
  );
}

export default NavDropdownComponent;