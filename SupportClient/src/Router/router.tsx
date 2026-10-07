import { createBrowserRouter } from "react-router";
import Main_Layout from "../Layout/Main-Layout";
import Agent from "../pages/Agent";

export const router_index = createBrowserRouter([
    {
        path:"",
        element : <Main_Layout></Main_Layout>,
        children : [
            {
                path :"",
                element : <Agent></Agent>
            }
        ]
    }
])