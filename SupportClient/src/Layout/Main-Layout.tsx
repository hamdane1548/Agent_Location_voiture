import { Outlet } from "react-router";
import Header from "../Components/ui/Header";
import Footer from "../Components/ui/Footer";

const Main_Layout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      
      <header>
        <Header />
      </header>

      <main className="flex-1 flex items-center justify-center">
        <Outlet />
      </main>

      <footer>
        <Footer />
      </footer>

    </div>
  );
};

export default Main_Layout;