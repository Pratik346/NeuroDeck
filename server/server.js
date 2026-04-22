const express=require("express");
const dotenv=require("dotenv");
const cors=require("cors");
const connectDB=require("./config/db");
dotenv.config();
connectDB();
const app=express();
app.use(cors());
app.use(express.json());
app.use("/api/auth",require("./routes/authRoutes"));
app.use("/api/decks", require("./routes/deckRoutes")); 
app.use("/api/analytics", require("./routes/analyticsRoutes"));
app.use("/api/gamification", require("./routes/gamificationRoutes"));
app.use("/api/cards", require("./routes/cardRoutes"));  
app.use("/api/interview", require("./routes/interviewRoutes"));
app.get("/",(req,res)=>{
    res.send("FlashCard Server started")
});
const PORT=process.env.PORT || 5000;
app.listen(PORT,()=>console.log(`Server running on port ${PORT}`));