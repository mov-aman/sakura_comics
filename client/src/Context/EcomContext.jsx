import React, { createContext } from 'react'
import all_product from '../Components/Assets/all_product';


export const EcomContext = createContext(null);

const EcomContextProvider = (props)=>{
    const contextValue = {all_product};

    return (
        <EcomContext.Provider value={contextValue}>
            {props.children}
        </EcomContext.Provider>
    )
}

export default EcomContextProvider;