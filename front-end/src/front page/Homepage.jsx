import React, { useState, useEffect } from "react";
import img from "/images/men/banner/homepage3.jpg";
import UseFetch from "../data managment/UseFetch";
import { motion } from "framer-motion";
import { useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ReactLenis, useLenis } from "@studio-freight/react-lenis";
import Products from "./Products";

const Homepage = () => {
  const url = `${import.meta.env.VITE_PUBLIC_PRODUCTS_URL}/products`;
  const key1 = "products";
  const { data, isPending, error } = UseFetch(url, key1);
  console.log(data);

  const initialUserState = {
    type: "all",
    price: 0,
    rating: 1,
    sortOption: "",
    onSale: false,
    bestSeller: false,
    newArrival: false,
  };

  const [user, setUser] = useState(initialUserState);
  const [searchParams, setSearchParams] = useSearchParams();
  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    const newValue = type === "checkbox" ? checked : value;
    setUser((prevUser) => {
      const updatedUser = { ...prevUser, [name]: newValue };
      setSearchParams((prevParams) => {
        if (
          newValue === "" ||
          newValue === false ||
          newValue === "0" ||
          newValue === "all" ||
          newValue === "17.99" ||
          newValue === "1"
        ) {
          prevParams.delete(name);
        } else {
          prevParams.set(name, newValue);
        }

        return prevParams;
      });
      return updatedUser;
    });
  };

  useEffect(() => {
    const updatedUserState = {
      ...initialUserState,
      type: searchParams.get("type") || "all",
      price: searchParams.get("price") || 0,
      rating: searchParams.get("rating") || 1,
      sortOption: searchParams.get("sortOption") || "",
      onSale: searchParams.get("onSale") === "true",
      bestSeller: searchParams.get("bestSeller") === "true",
      newArrival: searchParams.get("newArrival") === "true",
    };
    setUser(updatedUserState);
  }, [searchParams]);

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
        return (a.newPrice || a.price) - (b.newPrice || b.price);
      } else if (user.sortOption === "priceHighToLow") {
        return (b.newPrice || b.price) - (a.newPrice || a.price);
      } else {
        return "";
      }
    });

  const filterVariant = {
    hidden: { opacity: 0 },
    visible: () => ({
      opacity: 1,
      transition: { delay: 0.3, ease: "easeInOut" },
    }),
  };

  useLenis((lenis) => {
    lenis.on("scroll", ({ scroll }) => {
      console.log("Scroll position:", scroll);
    });
  });

  if (isPending) return <h2>...is loading</h2>;
  if (error) return <h2>{error.message}</h2>;

  return (
    <ReactLenis root={true}>
      <Helmet>
        <title>Shop</title>
        <meta name="description" content="Buy our products." />
      </Helmet>
      <div className="headerimages">
        <img src={img} alt="" className="detailImg" />
      </div>

      <motion.div
        variants={filterVariant}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <form className="searchContainer">
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
            <label htmlFor="rating">Products Rating</label>
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
        </form>
      </motion.div>

      <Products productsFilter={productsFilter} searchParams={searchParams} />
    </ReactLenis>
  );
};

export default Homepage;
