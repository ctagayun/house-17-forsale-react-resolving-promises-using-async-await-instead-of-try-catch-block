
import * as React from 'react';
import currencyFormatter from "../helpers/currencyFormatter";

//Create another component that will display list of houses.
//This component called "House" encapsulates the task of displaying 
//each 'house' record

/*
   Finally, the HouseRow component uses the incoming callback handler as a 
   function in a new handler. In this handler, we will pass the specific 
   item to it. Moreover, an additional button element is needed to trigger 
   the actual event:

   One popular solution is to use an inline arrow function, 
   which allows us to sneak in arguments like the item:
   <button type="button" onClick={() => onRemoveItem(item)}> 
        Dismiss
   </button>
 
  */
const HouseRow = ({house, onRemoveItem, selectedHouseSetter }) => (
    <tr onClick={() => selectedHouseSetter(house)}>
     <td>{house.objectID} </td>
     <td>{house.address}</td>
     <td>{house.country}</td>
    
     <td className={`${house.price >= 500000 ? "text-primary" : ""}`}>
       {currencyFormatter.format(house.price)}
     </td>
     <td>
     <span>
      <button className="btn btn-primary" type="button" onClick={() => onRemoveItem(house)}>
        Delete
      </button>
    </span>
     </td>
    </tr>
  
);

//Memoizing is way to cache the output of JSX component 
//so that it doesn't re-render. It is done by wrapping the 
//component with React.memo hook
const HouseRowMemoized = React.memo(HouseRow)

export default HouseRow;
//exporting the memoized version will let you use that 
//version in the HouseList
export {HouseRowMemoized}; 