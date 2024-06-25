import React, { useContext, useEffect, useRef } from "react";
import Rating from "./Rating";
import { Link, useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { AppContext } from "../data managment/AppProvider";

const Product = ({ product }) => {
  const { addToCart } = useContext(AppContext);

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

  const navigate = useNavigate();
  const ref = useRef();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["0 1", "0.7 1"],
  });
  const scrollScall = useTransform(scrollYProgress, [0, 1], [0.8, 1]);
  const scrollOpacity = useTransform(scrollYProgress, [0, 1], [0.6, 1]);

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
      <div className="imgDiv" onClick={() => navigate(`/${id}`)}>
        <img src={images[0]} alt="" className="img" />
      </div>
      <div className="productInfo">
        <Link to={id} className="linkTitle">
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

        {onSale && <p className="saleTag">on sale</p>}
        {bestSeller && <p className="newTag">best seller</p>}
        {newArrival && <p className="newTag">new seller</p>}
      </div>
    </motion.div>
  );
};

export default Product;
