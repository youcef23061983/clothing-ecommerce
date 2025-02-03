export default function ErrorPage({ is404 }) {
  return (
    <div>
      <h1>{is404 ? "Page Not Found" : "Something went wrong"}</h1>
      <p>
        {is404
          ? "We couldn't find the page you're looking for."
          : "An unexpected error occurred."}
      </p>
    </div>
  );
}
