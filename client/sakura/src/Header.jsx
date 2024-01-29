import React from 'react';

function Header() {
  return (
    <header>
      <h1>Sakura Comics</h1>
      <nav>
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/product">Product</a></li>
          <li><a href="/checkout">Checkout</a></li>
          <li><a href="/payment">Payment</a></li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
