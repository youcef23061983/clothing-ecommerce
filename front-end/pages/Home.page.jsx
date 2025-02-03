import React from "react";
import Homepage from "../src/front page/Homepage";

export default function Home() {
  return (
    <div>
      <Homepage />
    </div>
  );
}

export function getDocumentProps() {
  return {
    title: "Rooms Page",
    description: "Explore our luxurious rooms.",
    ogTitle: "Rooms Page",
    ogDescription: "Explore our luxurious rooms.",
    ogImage: "/images/rooms-og-image.jpg",
    ogUrl: "https://example.com/rooms",
  };
}
