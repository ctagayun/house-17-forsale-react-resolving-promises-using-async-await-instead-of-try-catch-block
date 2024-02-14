
import * as React from 'react';

  const Item = ({house, onRemoveItem }) => (
    <tr>
      <td align="left">
          <a href={house.url}>{house.title}</a>
      </td>
     <td>{house.author}</td>
     <td>{house.num_comments}</td>
     <td>{house.points} </td>
     <td>
     <span>
      <button className="btn btn-primary" type="button" onClick={() => onRemoveItem(house)}>
        Delete
      </button>
    </span>
     </td>
    </tr>
  
);

  


export default Item;
 