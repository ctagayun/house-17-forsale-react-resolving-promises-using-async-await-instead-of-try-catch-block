import * as React from 'react';
import HouseRow from './houserow';
  /*
     This component will use the stateful searchStateFulVar from the 
   search component to filter the houseArray by their "country"
   property in the App component before they are passed as 
   props to the HouseList component

     This component will store the value of "search text box"
   in a local storage by using side effect.
    
     We'll use React's useEffect Hook to trigger the desired 
   side-effect each time the searchTerm changes

  */

  //There is a callback function in the App component called "searchHandler". 
  //This handler is passed as prop to SearchComponent when it is instantiated
  //in App component. The useState for this component is defined in App as well.
  //It looks like this:
  // const [searchTerm, setSearchTerm] = React.useState('');
  const Search = ({
    id,
    value,          //this prop was assigned {stateOfSearchComponent}
    type = 'text',
    onInputChange, //this prop was assigned {handleSearchInput} the callback
    isFocused,
    children,
    onClick
   }) => { 

     const inputRef = React.useRef(); //Review useRef hook

     React.useEffect(() => {
      if (isFocused && inputRef.current) {
        inputRef.current.focus();
      }
    }, [isFocused]);

     return (
       <>
         <label htmlFor={id}>{children}</label>
         &nbsp;
         <input
           ref={inputRef}
           id={id}
           type={type}
           value={value}
           onChange={onInputChange} //points to HandleSearchInput
         />

        { <button        
            type="button"
            className="btn btn-primary" 
            disabled={!value}
            onClick={onClick} //points to handleSearchSubmit
         >
            Search
        </button> }
       </>
     );
 };


export default Search;