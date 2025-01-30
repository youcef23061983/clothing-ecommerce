import React, { useContext, useEffect } from "react";
import { AppContext } from "../data managment/AppProvider";
import img from "/images/men/banner/cart.jpg";
import CartItem from "./CartItem";
import { Link } from "react-router-dom";

const Cart = () => {
  const { cart, clearCart, total, amount } = useContext(AppContext);
  const tax = parseFloat((total * 0.1).toFixed(2));
  const totalAll = parseFloat((total + tax).toFixed(2));

  useEffect(() => {
    document.title = "Cart";
  }, [cart]);

  return (
    <div>
      <div className="headerimages">
        <img src={img} alt="cart" loading="lazy" className="detailImg" />
      </div>
      <h2 className="cartTitle">your bag</h2>

      <div>
        {cart.length === 0 && (
          <h4 className="emptyCart">your cart is currently empty</h4>
        )}
      </div>
      <div className="cartContainer">
        {cart.map((item) => {
          return <CartItem item={item} key={item.id} />;
        })}
      </div>

      <div className="cartResult">
        <h3>amount: {amount} </h3>
        <h3>SUBTOTAL: {total} $</h3>
        <h3>TAX: {tax} $</h3>
        <h3>TOTAL: {totalAll} $</h3>
        <div className="cartCheck">
          <Link onClick={clearCart} className="addCart">
            clear all
          </Link>
          <Link className="addCart" to="/shipping">
            proceed to checkout{" "}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;
