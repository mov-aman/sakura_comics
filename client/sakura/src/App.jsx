import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import Home from './Home';
// Import other components (Product, Checkout, Payment)

function App() {
  return (
    <Router>
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        {/* Add routes for Product, Checkout, Payment components */}
      </Routes>

      <Footer />
    </Router>
  );
}

export default App;
