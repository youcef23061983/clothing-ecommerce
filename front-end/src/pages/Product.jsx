import React, { useContext, useRef } from "react";
import Rating from "./Rating";
import { Link, useLocation } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { AppContext } from "../data managment/AppProvider";

const Product = ({ product, searchParams }) => {
  const { addToCart } = useContext(AppContext);
  const location = useLocation();

  const {
    id,
    product_name,
    price,
    images,
    new_price,
    new_arrival,
    on_sale,
    best_seller,
    rating,
    preview,
  } = product;

  const ref = useRef();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["0 1", "0.4 1"],
  });
  const scrollScall = useTransform(scrollYProgress, [0, 1], [0.8, 1]);
  const scrollOpacity = useTransform(scrollYProgress, [0, 1], [0.6, 1]);
  const getPath = () => {
    if (location?.pathname === "/new" || "/rating" || "/best" || "/sale") {
      return `../${id}`;
    } else {
      return `${id}`;
    }
  };

  return (
    <motion.div
      layout
      className="productDiv"
      ref={ref}
      style={{
        scale: scrollScall,
        opacity: scrollOpacity,
      }}
    >
      <Link
        to={getPath()}
        className="linkTitle"
        state={{ search: `?${searchParams.toString()}` }}
      >
        <div className="imgDiv">
          <img src={images[0]} alt="product" loading="lazy" className="img" />
        </div>
      </Link>

      <div className="productInfo">
        <Link
          to={getPath()}
          className="linkTitle"
          state={{ search: `?${searchParams.toString()}` }}
        >
          {product_name}
        </Link>
        <div className="rating">
          <div>
            <Rating rating={rating} />
          </div>
          <p>{preview} previews</p>
        </div>

        <div className="price">
          <h3 className={`${on_sale ? "through" : ""}`}>{price} $</h3>
          {on_sale && <h3>{new_price} $</h3>}
        </div>

        <Link className="addCart" to="/cart" onClick={() => addToCart(id)}>
          add to cart
        </Link>

        {on_sale && <p className="saleTag">On Sale</p>}
        {best_seller && <p className="newTag">Best Seller</p>}
        {new_arrival && (
          <p className="newTag" style={{ top: best_seller ? "6rem" : "3rem" }}>
            New Arrival
          </p>
        )}
      </div>
    </motion.div>
  );
};

export default Product;
