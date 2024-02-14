/*
   React State:
    React state introduces a mutable data structure (called: stateful values). 
  These stateful values get instantiated in a React component as so 
  called "state", can be passed with props as vehicle down to child components, 
  but can also get mutated by using a function to modify the state.

      "When a state gets mutated, the component 
       with the state and all child components will
       re-render.""

    Whenever the user clicks Add button in the HouseList you will 
  note that the added detail house record doesn't get added to the
  list of houses.
   
    To address this issue we will use useState. By using useState 
  we are telling react we want to have a stateful value which changes
  when we click the "Add" button. 
    The logic of handler function for the "Add" button adds a new record
  and the state update function set the updated state. (see HouseList)
     
 Note:
  Everything that we pass from a parent component to a child component 
  via the component element's HTML attribute (in this case "list" see instantiation  
  in line 69 of App component) can be accessed in the child component
*/

import * as React from 'react';
import HouseRow  from './houserow';
//import { HouseRowMemoized } from './houserow';

//We are not using selectedHouseSetter in HouseList. We just 
//want to pass it as props to HouseRow
const HouseList = ({list, onRemoveHouse, onAddHouse, selectedHouseSetter}) =>
    {
      const mySearchHouses = JSON.stringify(list);
      console.log("SearchedHouses = " + mySearchHouses );
      return (
          <>
            <div className="row mb-2">
              <h5 className="themeFontColor text-center">
                Houses currently on the market
              </h5>
            </div>
            <table className="table table-hover">
              <thead>
                <tr>
                  
                  <th>Address</th>
                  <th>Country</th>
                  <th>Asking Price</th>
                </tr>
              </thead>
              <tbody>
                {list.map((record) => ( 
                  //first time in list has already been populated by useState
                  //Instantiate the HouseRow component and pass each record
                  //to HouseRow component as props. Pass the delete record 
                  //handler "onRemoveItem" to HouseRow component.
                  //<HouseRow - by using the memoized version only the 
                  //added house will be rendered
                  //<HouseRowMemoized
                  <HouseRow
                      key={record.objectID}
                      objectID={record.objectID} 
                      house={record}
                      onRemoveItem = {onRemoveHouse} //contains the onRemoveItem handler
                      onAddHouse = {onAddHouse}
                      selectedHouseSetter = {selectedHouseSetter} //pass to HouseRow the selected record
                  />
                ))}
              </tbody>
            </table>
            <button className="btn btn-primary" onClick={onAddHouse}>
              Add
            </button>
          </>
        );
  };

export default HouseList;
