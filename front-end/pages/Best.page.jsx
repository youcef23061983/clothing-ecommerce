import React from "react";
import Best from "../src/pages/Best";

export default function Bestpage() {
  return (
    <div>
      <Best />
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
s;
