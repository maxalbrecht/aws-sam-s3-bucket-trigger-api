import { createStore, applyMiddleware, compose } from "redux";
import rootReducer from "../reducers/index";
import { rootMiddleware } from "../middleware/index"
//import { forbiddenWordsMiddleware } from "../middleware";
import thunk from "redux-thunk";
const storeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(
  rootReducer,
  storeEnhancers(applyMiddleware(rootMiddleware, thunk))
);
window.store = store;
export default store;