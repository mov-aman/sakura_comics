import './App.css';
import Navbar from './Components/Navbar/Navbar';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Product from './Pages/Product';
import ProductCategory from './Pages/ProductCategory';
import Cart from './Pages/Cart';
import LoginSignup from './Pages/LoginSignup';
import Home from './Pages/Home';

function App() {
  return (
    <div>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/newReleases" element={<ProductCategory category = "newRelease" />} />
          <Route path="/bestSellers" element={<ProductCategory category = "bestSeller" />} />
          <Route path="/classicTitles" element={<ProductCategory category = "classicTitle" />} />
          <Route path="/products" element={<Product/>}>
            <Route path=':productId' element={<Product/>} />
          </Route>
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<LoginSignup />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
