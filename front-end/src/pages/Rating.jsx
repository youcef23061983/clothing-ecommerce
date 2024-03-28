import React from "react";
import { IoMdStarOutline, IoMdStarHalf } from "react-icons/io";
import { IoStar } from "react-icons/io5";

const Rating = ({ rating }) => {
  return (
    <div>
      {rating >= 2 ? (
        <IoStar className="star" />
      ) : rating >= 1.5 ? (
        <IoMdStarHalf className="star" />
      ) : (
        <IoMdStarOutline className="star" />
      )}
      {rating >= 3 ? (
        <IoStar className="star" />
      ) : rating >= 2.5 ? (
        <IoMdStarHalf className="star" />
      ) : (
        <IoMdStarOutline className="star" />
      )}{" "}
      {rating >= 4 ? (
        <IoStar className="star" />
      ) : rating >= 3.5 ? (
        <IoMdStarHalf className="star" />
      ) : (
        <IoMdStarOutline className="star" />
      )}{" "}
      {rating >= 5 ? (
        <IoStar className="star" />
      ) : rating >= 4.5 ? (
        <IoMdStarHalf className="star" />
      ) : (
        <IoMdStarOutline className="star" />
      )}
    </div>
  );
};

export default Rating;
