import React from 'react';
import {createRoot} from 'react-dom/client';
import './styles/index.css';
import {HomePage} from "./app/HomePage";
import {AboutPage} from './app/AboutPage';
import reportWebVitals from './app/reportWebVitals';
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import {AddContent} from "./app/AddContent";
import {AddGame} from "./app/AddGame";
import {AddModel} from "./app/AddModel";
import {AllGames} from "./app/AllGames";
import {GameView} from "./app/GameView";

import { EditAbout } from "./app/EditAbout";

import {AnimatePresence} from 'framer-motion'
import {DevSupport} from "@react-buddy/ide-toolbox";


const router = createBrowserRouter([
    {
        path: '',
        element: <HomePage/>
    },
    {
        path: "about",
        element: <AboutPage />,

    },
    {

        path: "edit_about",
        element: <EditAbout />

    },
    {
        path: "add_content",
        element: (
            <AddContent/>
        ),
    },
    {
        path: "add_game",
        element: <AddGame />
    },
    {
        path: "add_model",
        element: <AddModel />
    },
    {
        path: 'all_games/:game_slug',
        element: <GameView/>
    },
    {
        path: "all_games",
        element: <AllGames/>
    },
    {
        path: "add_game",
        element: <AddGame/>
    }
]);


createRoot(document.getElementById('root')).render(
    <AnimatePresence>
            <RouterProvider router={router}/>
    </AnimatePresence>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
