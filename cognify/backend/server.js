import app from "./src/app.js"
import { connecttoDb } from "./src/config/db.js"
import { testAi } from "./src/services/ai.services.js"

connecttoDb()
testAi()
app.listen(3000,()=>{
    console.log("server running on port 3000")
})