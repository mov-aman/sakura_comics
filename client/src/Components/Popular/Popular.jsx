import React from 'react'
import './Popular.css'
import data_product from '../Assets/data'
import Items from '../Items/Items'

export const Popular = () => {
  return (
    <div className='popular'>
        <h1>POPULAR FOR ADVANTURE</h1>
        <hr />
        <div className="popular-item">
            {data_product.map((item,i)=>{
                return <Items key={i} id={item.id} name={item.name} image={item.image} new_price={item.new_price} old_price={item.old_price}/>
            })}
        </div>
    </div>
  )
}

export default Popular;
