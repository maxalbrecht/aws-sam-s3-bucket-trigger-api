class Deposition {
  constructor(depositionPropertiesFile) {
    this.deponentFirstName = null;
    this.deponentLastName = null;
    this.depositionDate = null;
    this.caseName = null;
    this.caseNumber = null;

    //this.SetPropertyValues(depositionPropertiesFile);
  }

  SetPropertyValues(depositionPropertiesFile) {
    let properties = this.getFileContent("./private/DepositionPropertiesFile.json");
    this.deponentFirstName = properties.DeponentFirstName;
    this.deponentLastName = properties.DeponentLastName;
    this.depositionDate = properties.DepositionDate;
    this.caseName = properties.CaseName;
    this.aseNumber = properties.CaseNumber;
  }
}

export default Deposition;