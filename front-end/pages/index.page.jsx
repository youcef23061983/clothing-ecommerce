export default function Page() {
  return (
    <div>
      <h1>Home Page</h1>
    </div>
  );
}

export function getDocumentProps() {
  return {
    title: "Home Page",
    description: "Welcome to the home page.",
    ogTitle: "Home Page",
    ogDescription: "Welcome to the home page.",
    ogImage: "/images/home-og-image.jpg",
    ogUrl: "https://example.com/home",
  };
}
