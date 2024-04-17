import { useParams } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import img from "../images/men/banner/bestSeller.jpg";
import { NavLink } from "react-router-dom";
import { AppContext } from "./AppProvider";
import Rating from "./Rating";
import UseFetch from "./UseFetch";

const Detail = () => {
  const url = "http://localhost:3000/products";

  const { id } = useParams();
  const [selectedImage, setSelectedImage] = useState("");
  const { addToCart } = useContext(AppContext);

  const { data, isPending, error } = UseFetch(url, id);

  useEffect(() => {
    if (data) {
      document.title = `${data.slug}`;
      setSelectedImage(data.images[0]);
    }
  }, [data]);

  if (isPending) return <h2>...is loading</h2>;
  if (error) return <h2>{error.message}</h2>;

  const {
    slug,
    price,
    newPrice,
    newArrival,
    onSale,
    bestSeller,
    type,
    rating,
    preview,
    size,
    images,
  } = data;

  return (
    <div>
      <div className="headerimages">
        <img src={img} alt="" className="detailImg" />
      </div>
      <div className="productContainer">
        <div className="imagesContainer">
          <div className="imagesDiv" key={id}>
            {images.map((image, index) => (
              <div className="imgSelect" key={index}>
                <img
                  src={`/${image}`}
                  alt={`Image ${index + 1}`}
                  onClick={() => setSelectedImage(image)}
                  className="img"
                />
              </div>
            ))}
          </div>
          <div className="imgDiv">
            <img src={selectedImage} alt="Selected" className="img" />
          </div>
        </div>
        <div className="productDetail">
          <p className="linkTitle">
            <span className="productSpan">product name:</span> {slug}
          </p>
          <p className="linkTitle">
            <span className="productSpan">product type:</span> {type}
          </p>
          <div className="sizeContainer">
            <span className="productSpan">size:</span>
            <div>
              {size.map((x) => {
                return <button className="sizeBtn">{x}</button>;
              })}
            </div>
          </div>
          <div className="rating">
            <Rating rating={rating} />
            <p>{preview} previews</p>
          </div>
          <div className="price">
            <div style={{ display: "flex" }}>
              <span className="productSpan">old price:</span>
              <h3 className={`${onSale ? "through" : ""}`}>{price} $</h3>
            </div>
            {onSale && <h3>new price: {newPrice} $</h3>}
          </div>
          <NavLink className="addCart" to="/cart" onClick={() => addToCart(id)}>
            add to cart
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default Detail;
