class User {
  constructor({
    contactName,
    contactEmail,
    contactPhone,
    assignedUserEmail
  }={}){
    this.contactName = contactName;
    this.contactEmail = contactEmail;
    this.contactPhone = contactPhone;
    this.assignedUserEmail = assignedUserEmail;
  }
}

export default User;