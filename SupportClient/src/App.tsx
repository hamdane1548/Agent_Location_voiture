import { RouterProvider } from "react-router";
import { router_index } from "./Router/router";

function App() {

  return (
    <>
     <RouterProvider  router={router_index}/>
    </>
  )
}

export default App
