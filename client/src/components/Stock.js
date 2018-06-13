import React from 'react';

const Stock = (props) => {
  const name = props.name;
  const data = props.data;
  return(
    <div className='col-lg-4 col-md-6 col-sm-12 section'>
      <div className='card bg-light mb-3'>
        <div className='modal-header'>
        <p className='modal-title card-symbol'>{name}</p>
        <button  aria-label={`Delete ${data}`} className='close' onClick={() => props.onClick(props.name)} data-toggle='close'>
          <span aria-hidden='true'>&times;</span>
        </button>
      </div>
        <div className='card-body'>
          <p className='card-title'>{data}</p>
        </div>
      </div>
    </div>
  );
}
         
export default Stock;