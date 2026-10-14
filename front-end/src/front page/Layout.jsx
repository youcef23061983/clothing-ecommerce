// import Navbar from "./Navbar";
// import Footer from "./Footer";
// import { Outlet } from "react-router-dom";

// const Layout = () => {
//   return (
//     <div className="site-wrapper">
//       <Navbar />
//       <main>
//         <Outlet  />
//       </main>
//       <Footer />
//     </div>
//   );
// };

// export default Layout;
import { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

const Layout = () => {
  const [productsData, setProductsData] = useState(null);

  return (
    <div className="site-wrapper">
      <Navbar onSearch={setProductsData} />

      <main>
        <Outlet context={{ productsData, setProductsData }} />
      </main>

      <Footer />
    </div>
  );
};

export default Layout;
