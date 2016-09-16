/**
 * Created by haunguyen on 9/16/16.
 */
import ReactDOM from 'react-dom';

export const isMounted = (component) => {
  // exceptions for flow control :(
  try {
    ReactDOM.findDOMNode(component);
    return true;
  } catch (e) {
    console.log(e);
    // Error: Invariant Violation: Component (with keys: props,context,state,refs,_reactInternalInstance) contains `render` method but is not mounted in the DOM
    return false;
  }
};