import axios from 'axios';

const api = axios.create({
    baseURL : "http://localhost:3000/api/auth",
    withCredentials : true
})


export async function register({username,email,password}){
    try{
        const response = await api.post("/register",{
            username,
            email,
            password
        })
        return console.log(response.data);
    }catch(error){
        console.log("Error registering user:", error);
        
    }

}


export async function login({email,password}){
    try{
        const response = await api.post("/login",{
            email,
            password
        })
        return response.data;
    }
    catch(error){
        console.log("Error logging in user:", error);
        
}
}
export async function getMe(){
   
    try{
        const response = await api.get("/getMe")
        console.log(response.data)
        return response.data;

    } catch(error){
        console.log("Error fetching user data:", error);
      
    }
}

export async function resendVerification(){
    try{
        const response = await api.post("/resend-verfication")
        return response.data;   

    }
    catch(error){  
        console.log("Error resending verification email:", error);
       
    }
}
