import React, { createContext } from 'react'
import all_product from '../Components/Assets/all_product';
import { useState } from 'react';
// import Product from '../Pages/Product';


export const EcomContext = createContext(null);
const getDefaultCart = () => {
    let cart = {};
    for (let i = 0; i < all_product.length + 1; i++) {
        cart[i] = 0;
    }
    return cart;
}

const EcomContextProvider = (props) => {
    const [cartItems, setCartItems] = useState(getDefaultCart());

    const addToCart = (itemid) => {
        setCartItems((prevState) => {
            return {
                ...prevState,
                [itemid]: prevState[itemid] + 1
            }
        })
        // console.log(cartItems);
    }

    const removeFromCart = (itemid) => {
        setCartItems((prevState) => {
            return {
                ...prevState,
                [itemid]: prevState[itemid] - 1
            }
        })
    }
    const getTotalCartAmount = () => {
        let totalAmount = 0;
        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                let itemInfo = all_product.find((product) => product.id === Number(item))
                totalAmount += itemInfo.new_price * cartItems[item]
            }
        }
        return totalAmount;
    }

    const getTotalCartItems = () => {
        let totalItems = 0;
        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                totalItems += cartItems[item]
            }
        }
        return totalItems;
    }
    const contextValue = { getTotalCartItems, getTotalCartAmount, all_product, cartItems, addToCart, removeFromCart };
    return (
        <EcomContext.Provider value={contextValue}>
            {props.children}
        </EcomContext.Provider>
    )
}

export default EcomContextProvider;