import { Store, combineReducers } from "redux";
import { legacy_createStore as createStore } from "redux";
import { FulfillmentState, fulfillmentReducer } from "./FulfillmentState";
import { UserState, userReducer } from "./UserState";

/** All application state packaged as a redux store */
export default interface AppState {
  readonly user: UserState;
  readonly fulfillment: FulfillmentState;
}

const rootReducer = combineReducers<AppState>({
  user: userReducer,
  fulfillment: fulfillmentReducer,
});

export function configureStore(): Store<AppState> {
  const store = createStore(rootReducer, undefined);
  return store;
}
