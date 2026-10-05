import { Outlet } from "react-router";
import Header from "../Components/ui/Header";

const Main_Layout = () => {
   return (
    <>
    <header>
      <Header></Header>
    </header>
    <main>
      <Outlet></Outlet>
    </main>
    <footer>
      
    </footer>
    </>

   )
}
export default Main_Layout