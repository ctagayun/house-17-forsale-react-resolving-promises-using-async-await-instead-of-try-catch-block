/*================================================================
Task: Async/Await in React 
  - In our React application, we have started to resolve 
  promises with then/catch blocks. However, in modern JavaScript 
  (and therefore React), a more popular solution is using async/await.

=================================================================
Previous Task: Third Party Libraries
   - install axios
   - use axios instead of fetch 
   - See handleFetchStories for the changes
========================================================
Previous Task: Explicit Data Fetching
     Re-fetching all data each time someone types in the input field 
   isn't optimal. Eventually, we will be confronted with rate limiting 
   which returns an error instead of data.

     To solve this problem, we will change the implementation details 
  from implicit to explicit data (re-)fetching. In other words, 
  the application will refetch data only if someone clicks a confirmation 
  button.

   Task Explicit Data Fetching: 
       The server-side search executes every time a user types into 
   the input field. The new implementation should only execute a search 
   when a user clicks a confirmation button. As long as the button is 
   not clicked, the search term can change but isn't executed as 
   API request.

   Previous Task: (from prev section memoizing) Kept it here so that I wont forget.
     We will refactor the code upfront to use a memoized 
   function and provide the explanations afterward. The refactoring 
   consists of moving all the data fetching logic from the 
   side-effect into a arrow function expression (A), wrapping this 
   new function into React's useCallback hook (B), and invoking 
   it in the useEffect hook (C):

  Optional Hints Explicit Data Fetching:
    - 
    - (AA) Add a button element to confirm the search request.
      But first of all, create a new button element which confirms 
      the search and executes the data request eventually (AA)

    - (BB) rename handler 'handleSearch' to handleSearchInput. 
     
      (CC)Create a a handler for the button which sets the new 
      state value. The button's event handler sets confirmed search as 
      state by using the current search term.  
         
    - Only when the new confirmed search is set as state, 
      execute the side-effect to perform a server-side search.
 
    - (DD) after creating a handler for the button, create a state 
      called 'url' using the API and concatenated with the value of the 
      search input box
           const [url, setUrl] = React.useState(
              `${API_ENDPOINT}${searchTerm}`);

     - (EE) Instead of running the data fetching side-effect on 
      every searchTerm change (which happens each time the 
      input field's value changes like we have seen before), 
      the new stateful url is used whenever a user changes it 
      by confirming a search request when clicking the button:

      TO TEST: enter search criteria and click Submit button
     
  Review what is useState?
      - https://www.robinwieruch.de/react-usestate-hook/

      - When a state gets mutated, the component with the state 
      and all child components will re-render.

      - Use the browser's native fetch API to perform the request.

      - Note: A successful or erroneous request uses the same 
      implementation logic that we already have in place.
      
  Review what is useEffect?
    - https://www.robinwieruch.de/react-useeffect-hook/
    
    - What does useEffect do? by using this hook you tell React that 
     your component needs to do something after render.

  Review what is a React.Reducer
    - https://www.robinwieruch.de/javascript-reducer/

=============================================*/
import * as React from 'react';
import './App.css'
import Header from "./header";
import List from './house/List';
import Search from './house/search';
import axios from 'axios'; //(AAA)

const storiesReducer = (state, action) => {
  switch (action.type) {
    case 'STORIES_FETCH_INIT': //distinct type and payload 
                               //received by dispatchStories 
                               //dispatch function
                               //so we need to add it here
      return {
        ...state,              //return new state object with KV pairs
                               //via spread operator from current state object
        isLoading: true,
        isError: false,
      };
    case 'STORIES_FETCH_SUCCESS': //distinct type and payload 
                                  //received by dispatchStories 
                                  //dispatch function
                                  //so we need to add it here
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: action.payload,
      };
    case 'STORIES_FETCH_FAILURE':   //another distinct type and payload 
                                    //received by dispatchStories 
                                    //dispatch function 
                                    //so we need to add it here
      return {
        ...state,
        isLoading: false,
        isError: true,
      };
    case 'REMOVE_STORY':              //another distinct type and payload 
                                      //received by dispatchStories 
                                      //dispatch function
                                      //so we need to add it here
                                  //Observe how the REMOVE_STORY action 
                                  //changed as well. It operates on the 
                                  //state.data, and no longer just on the
                                  // plain "state".
      return {
        ...state,
        data: state.data.filter(  //now operate on state.data not just "state"
          (story) => action.payload.objectID !== story.objectID
        ),
      };
    default:
      throw new Error();
  }
};

const useStorageState = (key, initialState) => {
  const [value, setValue] = React.useState(
    localStorage.getItem(key) || initialState
  );

  React.useEffect(() => {
    localStorage.setItem(key, value);
  }, [value, key]);

  return [value, setValue];
};

const API_ENDPOINT = 'https://hn.algolia.com/api/v1/search?query=';

const App = () => {
  const welcome = {
    subject: 'List of ',
    title: 'Houses for Sale',
  };

  const [searchTerm, setSearchTerm] = useStorageState(
    'search',
    'React'
  );

  const [url, setUrl] = React.useState(
    `${API_ENDPOINT}${searchTerm}`
  );
   
  const [stories, dispatchStories] = React.useReducer( //A
    storiesReducer,
    { data: [], isLoading: false, isError: false } //We want an empty list data [] 
                                                   //for the initial state, set isloading=false
                                                   //is error=false
  );

  /*==================================================
  You can use axios instead of fetch. Its usage looks 
  almost identical to the native fetch API: It takes 
  the URL as an argument and returns a promise. 
  
  You don't have to transform the returned response to 
  JSON anymore, since axios wraps the result into a 
  data object in JavaScript for you. Just make sure 
  to adapt your code to the returned data structure:
  =====================================================*/
 
  const handleFetchStories = React.useCallback(async() => { 

    dispatchStories({ type: 'STORIES_FETCH_INIT' });
    
    /*Using axios with async/await*/
    try {
      const result = await axios.get(url); //actions after the await keyword
                                      //are not executed until the promises
                                      //are resolved. To include error handling 
                                      //as before, the try and catch blocks 
                                      //are there to help.
      dispatchStories({
          type: 'STORIES_FETCH_SUCCESS',
          payload: result.data.hits,
        });

    } catch {
        dispatchStories({ type: 'STORIES_FETCH_FAILURE' })
    }
  }, [url]);

  /* Using axios without async/await
    const handleFetchStories = React.useCallback(() => { //AAA
    dispatchStories({ type: 'STORIES_FETCH_INIT' });
 
    axios
      .get(url) //call axios axios.get() 
      .then((result) => {  //.then((result)) is the promise
        dispatchStories({
          type: 'STORIES_FETCH_SUCCESS',
          payload: result.data.hits,
        });
      })
      .catch(() =>
        dispatchStories({ type: 'STORIES_FETCH_FAILURE' })
      );
  }, [url]);*/
  

 /* Using native fetch (not recomended)
    const handleFetchStories = React.useCallback(() => {  
 
    dispatchStories({ type: 'STORIES_FETCH_INIT' });
 
    fetch(url) //DD use the stateful 'url'
      .then((response) => response.json())
      .then((result) => {
        dispatchStories({
          type: 'STORIES_FETCH_SUCCESS',
          payload: result.hits,
        });
      })
      .catch(() =>
        dispatchStories({ type: 'STORIES_FETCH_FAILURE' })
      );
      
  }, [url])  */



  //useEffect executes every time [searchTerm] dependency array (E) changes.
  //As a result it runs again the memoized function (C) because it depends
  //on the new function "handleFetchStories" (D)
  React.useEffect(() => { 
    handleFetchStories(); // C
  }, [handleFetchStories]); // D   (EOF)

  
  const handleRemoveStory = (item) => {
    dispatchStories({
      type: 'REMOVE_STORY',
      payload: item,
    });
  };  //EOF handleRemoveStory

  const handleSearchInput = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = () => {  //CC
    setUrl(`${API_ENDPOINT}${searchTerm}`);
  };

  return (
    <div>
      <Header  headerText={welcome} /> 

      {/* <InputWithLabel
        id="search"
        value={searchTerm}
        isFocused
        onInputChange={handleSearchInput} //BB
      >
        <strong>Search:</strong>
      </InputWithLabel> */}
      <Search 
       id="search"
       value={searchTerm}
       isFocused //pass imperatively a dedicated  prop. isFocused as an attribute is equivalent to isFocused={true}
       onInputChange={handleSearchInput}  
       onClick={handleSearchSubmit} 
      >
      <strong>Search:</strong>
      </Search>

     <hr />

      {stories.isError && <p>Something went wrong ...</p>}

      {stories.isLoading ? (
        <p>Loading ...</p>
      ) : (
        <List
          list={stories.data}
          onRemoveItem={handleRemoveStory}
        />
      )}
    </div>
  );
};



export default App;

//========================================================== 
 //Note on Map:
 //Within the map() method, we have access to each object and its properties.
 
 //useState
 //By using useState, we are telling React that we want to have a 
 //stateful value which changes over time. And whenever this stateful value 
 //changes, the affected components (here: Search component) 
 //will re-render to use it (here: to display the recent value).

 /* 
     The filter() method takes a function 
        as an argument, which accesses each item in the array and returns /
        true or false. If the function returns true, meaning the condition is 
        met, the item stays in the newly created array; if the function 
        returns false, it's removed from the filtered array.

  
 */
 
 /*Note on Map:
   Within the map() method, we have access to each object and its properties.

 // concatenating variables into a string
    var fullName = `${firstName} ${lastName}`
    console.log(fullName);


 //useState
    By using useState, we are telling React that we want to have a 
 stateful value which changes over time. And whenever this stateful value 
 changes, the affected components (here: Search component) 
 will re-render to use it (here: to display the recent value).

  //Work flow of a useState:
       When the user types into the input field, the input field's change event 
      runs into the event handler. The handler's logic uses the event's value 
      of the target and the state updater function to set the updated state. 
      Afterward, the component re-renders (read: the component function runs). 
      The updated state becomes the current state (here: searchTerm) and is 
      displayed in the component's JSX.

  //Arrow Function
    function getTitle(title) { - convert to arrow function see below
    
    const getTitle =(title) => 
       (
        title
       );

    Eliminate bracket and "return" statement if no business logic before 
    the function - concise
   

  //Arrow function - 
   If there is a business business logic. Otherwise retain the {} and
   put a "return" statement 
     const App = () => {
       ...
       return xyz;
     } 
 
  //How to use a React.Reducer hook 
  To use Reducer (1) first define a reducer function.
     1. A reducer action is always associated with a type. As best 
        practice with a payload.
        Example:
          const storiesReducer = (state, action) =>{
          if (action.type === 'SET_STORIES'){
            //If the type matches a condition in the reducer. Return a new
            //state based on the incoming state and action
            return action.payload;
          }
          else{
          //throw an error if isn't covered by the reducer to remind yourself
          //that the implementation is not covered
            throw new Error();
          }
        }
      2. The second thing to do is to replaceReact.useState to use a reducer hook
         like this: 

          const [stories, dispatchStories] = React.useReducer(storiesReducer,[]);

          1. receives a reducer function called "storiesReducer"
          2. receives an initial state of empty array []
          3. returns an array with 2 item: 
            - The first item is "stories" which is the current state
            - The second item is the updater function named "dispatchStories"
            Unlike useState, the updater function of Reducer sets the state
            "implicitly" by dispatching an "action". Example:
               dispatchStories({
                 type: 'SET_STORIES',   <== this is the action
               payload: result.data.stories,
             });
       
 */