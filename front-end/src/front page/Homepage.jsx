import React, { useState, useRef } from "react";
import img from "../images/men/banner/Homepage3.jpg";
import Product from "../pages/Product";
import UseFetch from "../data managment/UseFetch";
import { motion, useScroll, useTransform } from "framer-motion";

const Homepage = ({ key1 }) => {
  const url = "http://localhost:3000/products";
  const { data, isPending, error } = UseFetch(url, key1);

  const [user, setUser] = useState({
    type: "all",
    price: 0,
    rating: 1,
    sortOption: "",
    onSale: false,
    bestSeller: false,
    newArrival: false,
  });
  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setUser({ ...user, [name]: type === "checkbox" ? checked : value });
  };
  let types = ["all", ...new Set(data?.map((product) => product.type))];
  types = types.map((type, index) => {
    return (
      <option value={type} key={index}>
        {type}
      </option>
    );
  });
  let ratings = [2, 3, 4];
  ratings = ratings.map((rating, index) => {
    return (
      <option value={rating} key={index}>
        {rating} <h3>stars and up</h3>
      </option>
    );
  });
  let minPrice = data ? Math.min(...data.map((product) => product.price)) : 0;
  let maxPrice = data ? Math.max(...data.map((product) => product.price)) : 0;

  const productsFilter = data
    ?.filter((product) => {
      const productsType = user.type === "all" || product.type === user.type;
      const productsPrice = user.price === 0 || product.price >= user.price;
      const productsRating = user.rating === 1 || product.rating >= user.rating;
      const productsArrivals = !user.newArrival || product.newArrival;
      const productsSale = !user.onSale || product.onSale;
      const productsBest = !user.bestSeller || product.bestSeller;
      return (
        productsType &&
        productsPrice &&
        productsRating &&
        productsArrivals &&
        productsSale &&
        productsBest
      );
    })
    ?.sort((a, b) => {
      if (user.sortOption === "priceLowToHigh") {
        return a.price - b.price;
      } else if (user.sortOption === "priceHighToLow") {
        return b.price - a.price;
      } else {
        return 0;
      }
    });
  const ref = useRef();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["0 1", "1 1"],
  });
  const scrollScall = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const scrollOpacity = useTransform(scrollYProgress, [0, 1], [0.6, 1]);
  const scrollX = useTransform(scrollYProgress, [0, 1], ["100vw", "0vw"]);

  if (isPending) return <h2>...is loading</h2>;
  if (error) return <h2>{error.message}</h2>;
  return (
    <div>
      <div className="headerimages">
        <img src={img} alt="" className="detailImg" />
      </div>

      <motion.form
        ref={ref}
        style={{
          scale: scrollScall,
          opacity: scrollOpacity,
          x: scrollX,
        }}
        className="searchContainer"
      >
        <div className="searchElement">
          <label htmlFor="type">Products Type</label>
          <select
            name="type"
            id="type"
            value={user.type}
            onChange={handleChange}
            className="formSelect"
          >
            {types}
          </select>
        </div>
        <div className="searchElement">
          <label htmlFor="price">price:{user.price} $</label>
          <input
            type="range"
            name="price"
            id="price"
            value={user.price}
            min={minPrice}
            max={maxPrice}
            onChange={handleChange}
            className="formSelect"
          />
        </div>
        <div className="searchElement">
          <label htmlFor="type">Products Rating</label>
          <select
            name="rating"
            id="rating"
            value={user.rating}
            onChange={handleChange}
            className="formSelect"
          >
            {ratings}
          </select>
        </div>
        <div className="searchElement">
          <div className="elementCheck">
            <input
              type="checkbox"
              name="onSale"
              id="onSale"
              checked={user.onSale}
              onChange={handleChange}
            />
            <label htmlFor="onSale">onSale:</label>
          </div>
          <div className="elementCheck">
            <input
              type="checkbox"
              name="bestSeller"
              id="bestSeller"
              checked={user.bestSeller}
              onChange={handleChange}
            />
            <label htmlFor="bestSeller">bestSeller:</label>
          </div>
          <div className="elementCheck">
            <input
              type="checkbox"
              name="newArrival"
              id="newArrival"
              checked={user.newArrival}
              onChange={handleChange}
            />
            <label htmlFor="newArrival">newArrival:</label>
          </div>
        </div>
        <div className="searchElement">
          <label htmlFor="sortPrice">Sort By:</label>
          <select
            name="sortOption"
            id="sortPrice"
            value={user.sortOption}
            onChange={handleChange}
            className="formSelect"
          >
            <option value="">-- Select --</option>
            <option value="priceLowToHigh">Price Low to High</option>
            <option value="priceHighToLow">Price High to Low</option>
          </select>
        </div>
      </motion.form>

      <motion.div layout className="productsDiv">
        {productsFilter?.map((product) => {
          return <Product key={product.id} product={product} />;
        })}
      </motion.div>
    </div>
  );
};

export default Homepage;
