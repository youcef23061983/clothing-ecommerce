import React, { useContext, useRef } from "react";
import Rating from "./Rating";
import { Link, useLocation } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { AppContext } from "../data managment/AppProvider";

const Product = ({ product, searchParams }) => {
  const { addToCart } = useContext(AppContext);
  const location = useLocation();
  // console.log(location.pathname);

  const {
    id,
    slug,
    price,
    images,
    newPrice,
    newArrival,
    onSale,
    bestSeller,
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
    if (location.pathname === "/new" || "/rating" || "/best" || "/sale") {
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
          <img src={images[0]} alt="" className="img" />
        </div>
      </Link>

      <div className="productInfo">
        <Link
          to={getPath()}
          className="linkTitle"
          state={{ search: `?${searchParams.toString()}` }}
        >
          {slug.substring(0, 70)}...
        </Link>
        <div className="rating">
          <div>
            <Rating rating={rating} />
          </div>
          <p>{preview} previews</p>
        </div>

        <div className="price">
          <h3 className={`${onSale ? "through" : ""}`}>{price} $</h3>
          {onSale && <h3>{newPrice} $</h3>}
        </div>

        <Link className="addCart" to="/cart" onClick={() => addToCart(id)}>
          add to cart
        </Link>

        {onSale && <p className="saleTag">On Sale</p>}
        {bestSeller && <p className="newTag">Best Seller</p>}
        {newArrival && <p className="newTag">New Arrival</p>}
      </div>
    </motion.div>
  );
};

export default Product;
