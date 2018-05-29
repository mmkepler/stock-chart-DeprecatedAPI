import React from 'react';

const Stock = (props) => {
  //console.log(props);
  const name = props.name;
  const data = props.data;
  const index = props.place;
  return(
    <div className='col-lg-4 col-md-6 col-sm-12 section'>
      <div className="card bg-light mb-3" >
        <div className="modal-header">
        <h5 className="modal-title">{name}</h5>
        <button   className="close" aria-label="Close" onClick={() => props.onClick(props.item)} data-toggle="close">
          <span aria-hidden="true" >&times;</span>
        </button>
      </div>
        <div className="card-body">
          <p className="card-title">{data}</p>
        </div>
      </div>
    </div>
  );
}
         
export default Stock;