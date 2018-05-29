import React from 'react';

const Stock = (props) => {
  let key = this.props.key
  return(
    <div className='col-lg-4 col-md-6 col-sm-12' >
      <div className='row'>
        <div className='col-xs'>
          <p>Symbol: {data[key][symbol]}</p>
        </div>
        <div className='col-xs'>
          Company Name: {item.quote.companyName}
        </div>
        <div className='col-xs'>
          Sector: {data[key][companyName]}
        </div>
      </div>
    </div>
  );
}
         
export default Stock;