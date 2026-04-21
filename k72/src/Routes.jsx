import {createBrowserRouter} from 'react-router'
import Home from './pages/Home'
import Work from './pages/Work'
import Agency from './pages/Agency'


export const routes = createBrowserRouter([
    {
        path : "/",
        element : <Home/>
    },
    {
        path : "/work",
        element : <Work/>
    },
    {
        path : "/agency",
        element : <Agency/>
    }
])