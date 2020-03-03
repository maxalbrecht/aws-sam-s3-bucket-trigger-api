import { addArticle } from "../../../actions/index";

//Once the user wants to submit a job, this method is used to add the new job
// to the article array in the Redux store
function mapDispatchToProps(dispatch) {
  return {
    addArticle: article => dispatch(addArticle(article))
  };
}

export default mapDispatchToProps;