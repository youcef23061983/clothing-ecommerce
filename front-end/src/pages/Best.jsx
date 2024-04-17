import React from "react";
import img from "../images/men/banner/best.jpg";
import Product from "./Product";
import UseFetch from "../data managment/UseFetch";

const Best = () => {
  const url = "http://localhost:3000/products";

  const { data, isPending, error } = UseFetch(url);
  const productsFilter = data?.filter((product) => product.bestSeller === true);
  if (isPending) return <h2>...is loading</h2>;
  if (error) return <h2>{error.message}</h2>;
  return (
    <div>
      {data && (
        <div>
          <div className="headerimages">
            <img src={img} alt="" className="detailImg" />
          </div>
          <div>
            <h2 className="orderTitle">Your Best Sellers</h2>
            <div className="productsDiv">
              {productsFilter?.map((product) => {
                return <Product key={product.id} product={product} />;
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Best;
