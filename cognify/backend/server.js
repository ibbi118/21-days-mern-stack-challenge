import app from "./src/app.js"
import { connecttoDb } from "./src/config/db.js"
import http from "http"
import { testAi } from "./src/services/ai.services.js"
import { initSocket } from "./src/socket/server.socket.js"


const httpServer = http.createServer(app)
initSocket(httpServer)

connecttoDb()
testAi()
httpServer.listen(3000,()=>{
    console.log("server running on port 3000")
})