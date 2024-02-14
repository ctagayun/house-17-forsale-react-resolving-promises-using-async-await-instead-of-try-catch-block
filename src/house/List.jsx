
import * as React from 'react';
import Item from './item';

const List = ({ list, onRemoveItem }) => //onRemoveItem points to handleRemoveStory
 
  {
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
              <th>Article</th>
              <th>Author</th>
              <th>Total Comments</th>
              <th>Points</th>
            </tr>
          </thead>
          <tbody>
            {list.map((record) => ( 
              <Item
                  key={record.objectID}
                  objectID={record.objectID} 
                  house={record}
                  onRemoveItem = {onRemoveItem} //contains the onRemoveItem handler
              />
            ))}
          </tbody>
        </table>
         
      </>
    );

  }
  
 

export default List;
