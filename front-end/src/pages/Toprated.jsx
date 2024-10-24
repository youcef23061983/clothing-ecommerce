import React, { useEffect, useRef, useState } from "react";
import img from "../images/men/banner/new.jpg";
import Product from "./Product";
import UseFetch from "../data managment/UseFetch";
import { useSearchParams } from "react-router-dom";
import { useScroll, useTransform, motion } from "framer-motion";
const Toprated = () => {
  const url = "http://localhost:3000/products";
  const key1 = "products";
  const { data, isPending, error } = UseFetch(url, key1);

  // const optionsX = {
  //   method: "GET",
  //   qs: {
  //     limit: "10",
  //     offset: "0",
  //   },
  //   headers: {
  //     "x-rapidapi-key": "fcc7ada39fmshe7e27571ff286cbp1fc7e8jsnae6feeef0387",
  //     "x-rapidapi-host": "exercisedb.p.rapidapi.com",
  //   },
  // };
  // const urll = "https://exercisedb.p.rapidapi.com/exercises";
  // const [x, setX] = useState(null);
  // useEffect(() => {
  //   const fetchData = async (urlll, options) => {
  //     try {
  //       const response = await fetch(urlll, options);
  //       if (!response.ok) {
  //         throw new Error("Network response was not ok");
  //       }
  //       const result = await response.json();
  //       setX(result);
  //     } catch (error) {
  //       console.error("Fetch error:", error);
  //     }
  //   };
  //   fetchData(urll, optionsX);
  // }, []);

  // console.log(x);

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
  // console.log(searchParams);
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
      return (b.newPrice || b.price) - (a.newPrice || a.price);
    });
  const useMediaQuery = (query) => {
    const [matches, setMatches] = useState(false);

    useEffect(() => {
      const media = window.matchMedia(query);
      if (media.matches !== matches) {
        setMatches(media.matches);
      }

      const listener = () => {
        setMatches(media.matches);
      };

      if (typeof media.addEventListener === "function") {
        media.addEventListener("change", listener);
      } else {
        media.addListener(listener);
      }

      return () => {
        if (typeof media.removeEventListener === "function") {
          media.removeEventListener("change", listener);
        } else {
          media.removeListener(listenerList);
        }
      };
    }, [matches, query]);

    return matches;
  };
  const isMediumScreen = useMediaQuery("(min-width: 768px)");
  const ref = useRef();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["0 1", isMediumScreen ? "0.15 1" : "0.06 1"],
  });
  const scrollScall = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const scrollOpacity = useTransform(scrollYProgress, [0, 1], [0.6, 1]);
  const scrollX = useTransform(scrollYProgress, [0, 1], ["40vw", "0vw"]);

  if (isPending) return <h2>...is loading</h2>;
  if (error) return <h2>{error.message}</h2>;

  return (
    <div>
      <div className="headerimages">
        <img src={img} alt="" className="detailImg" />
      </div>
      <div>
        <h2 className="orderTitle">Your Top Rated</h2>
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
        </motion.form>
        <motion.div layout className="productsDiv">
          {productsFilter?.map((product) => {
            return (
              <Product
                key={product.id}
                product={product}
                searchParams={searchParams}
              />
            );
          })}
        </motion.div>
      </div>
    </div>
  );
};

export default Toprated;
