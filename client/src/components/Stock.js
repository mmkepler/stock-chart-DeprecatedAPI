import React from 'react';

const Stock = (item) => {
  return(
    <div className='row'>
      <div className='col-xs'>
        <p>Symbol: {item.quote.symbol}</p>
      </div>
      <div className='col-xs'>
        Company Name: {item.quote.companyName}
      </div>
      <div className='col-xs'>
        Sector: {item.quote.sector}
      </div>
    </div>
  );
}

export default Stock;