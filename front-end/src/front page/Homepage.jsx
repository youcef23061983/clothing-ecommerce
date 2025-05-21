import React, { useState, useEffect, Suspense, lazy } from "react";
import img from "/images/men/banner/homepage3.jpg";
import UseFetch from "../data managment/UseFetch";
import { motion } from "framer-motion";
import { useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ReactLenis, useLenis } from "@studio-freight/react-lenis";

const HeavyComponent = lazy(() => import("./Products"));

const Homepage = () => {
  const url = `${import.meta.env.VITE_PUBLIC_PRODUCTS_URL}/products`;
  const key1 = "products";
  const { data, isPending, error } = UseFetch(url, key1);

  const initialUserState = {
    type: "all",
    price: 0,
    rating: 1,
    sortOption: "",
    on_sale: false,
    best_seller: false,
    new_arrival: false,
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
      on_sale: searchParams.get("on_sale") === "true",
      best_seller: searchParams.get("best_seller") === "true",
      new_arrival: searchParams.get("new_arrival") === "true",
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
        {rating} stars and up
      </option>
    );
  });

  let minPrice = data ? Math.min(...data.map((product) => product.price)) : 0;
  let maxPrice = data ? Math.max(...data.map((product) => product.price)) : 0;

  const productsFilter = data
    ?.filter((product) => {
      // const productsNew = product.new_arrival === true;
      const productsType = user.type === "all" || product.type === user.type;
      const productsPrice = user.price === 0 || product.price >= user.price;
      const productsRating = user.rating === 1 || product.rating >= user.rating;
      const productsArrivals = !user.new_arrival || product.new_arrival;
      const productsSale = !user.on_sale || product.on_sale;
      const productsBest = !user.best_seller || product.best_seller;
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
        return (a.new_price || a.price) - (b.new_price || b.price);
      } else if (user.sortOption === "priceHighToLow") {
        return (b.new_price || b.price) - (a.new_price || a.price);
      } else {
        return "";
      }
    });

  useLenis((lenis) => {
    lenis.on("scroll", ({ scroll }) => {});
  });

  const Filter = {
    hidden: { opacity: 0 },
    visible: {
      x: [0, 10, -10, 0],
      opacity: 1,
      transition: { delay: 0.7, duration: 1 },
    },
  };
  const pageTitle = `Shop Products - ${productsFilter?.length || 0} items`;

  if (isPending) return <h2>...is loading</h2>;
  if (error) return <h2>{error.message}</h2>;

  return (
    <ReactLenis root={true}>
      <Helmet>
        <title>{pageTitle}</title>
        <meta
          name="description"
          content={`Discover our shop products${
            user.type !== "all" ? ` in ${user.type}` : ""
          }. Filter by price, rating, and find your favorite men's clothing. Shop now for the latest trends and exclusive discounts!`}
        />
        <meta
          property="og:title"
          content={`Shop Products - ${productsFilter?.length || 0} items`}
        />
        <meta
          property="og:description"
          content={`Explore our shop products${
            user.type !== "all" ? ` in ${user.type}` : ""
          }. Filter by price, rating, and discover your favorite men's clothing. Shop now for exclusive deals and styles!`}
        />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta
          property="og:image"
          content="https://clothing-ecommerce-phi.vercel.app/images/men/banner/homepage3.jpg"
        />
        <meta
          property="og:url"
          content="https://clothing-ecommerce-phi.vercel.app"
        />

        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content={`Shop Products - ${productsFilter?.length || 0} items`}
        />
        <meta
          name="twitter:description"
          content={`Browse our shop products${
            user.type !== "all" ? ` in ${user.type}` : ""
          }. Filter by price, rating, and find your favorite men's clothing. Shop now for exclusive deals!`}
        />
        <meta
          name="twitter:image"
          content="https://clothing-ecommerce-phi.vercel.app/images/men/banner/homepage3.jpg"
        />
        <meta
          property="twitter:url"
          content="https://clothing-ecommerce-phi.vercel.app"
        />

        <meta name="robots" content="index, follow" />
        <meta
          name="keywords"
          content="shop, products, discounts, buy, offers, shopping, men's clothing, fashion, trends"
        />
        <meta name="author" content="Desire" />
        <meta property="og:type" content="website" />

        <meta property="og:site_name" content="Clothing E-commerce" />
      </Helmet>
      <div className="headerimages">
        <img src={img} alt="Product" loading="lazy" className="detailImg" />
      </div>
      <motion.form
        variants={Filter}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
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
              name="on_sale"
              id="on_sale"
              checked={user.on_sale}
              onChange={handleChange}
            />
            <label htmlFor="on_sale">onSale:</label>
          </div>
          <div className="elementCheck">
            <input
              type="checkbox"
              name="best_seller"
              id="best_seller"
              checked={user.best_seller}
              onChange={handleChange}
            />
            <label htmlFor="best_seller">bestSeller:</label>
          </div>
          <div className="elementCheck">
            <input
              type="checkbox"
              name="new_arrival"
              id="new_arrival"
              checked={user.new_arrival}
              onChange={handleChange}
            />
            <label htmlFor="new_arrival">newArrival:</label>
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
      <Suspense fallback={<h2>...is loading</h2>}>
        <HeavyComponent
          productsFilter={productsFilter}
          searchParams={searchParams}
        />
      </Suspense>
    </ReactLenis>
  );
};

export default Homepage;
