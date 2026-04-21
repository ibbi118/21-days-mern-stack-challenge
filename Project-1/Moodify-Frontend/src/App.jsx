
import { RouterProvider } from  "react-router"
import { routes } from './Routes'
import { AuthProvider } from './feature/auth/auth.context'




const App = () => {
  return (
   
     <AuthProvider>
      <RouterProvider router={routes}/>
     </AuthProvider>
   
  )
}

export default App
