const mongoose=require("mongoose");
const cardSchema=new mongoose.Schema({
    deck:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Deck",
        required:true,
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    question:{
        type:String,
        required:[true,"Question is required"],
        trim:true
    },
    answer:{
        type:String,
        required:[true,"Answer is required"],
        trim:true
    },
    difficulty:{
        type:String,
        enum:["again","hard","good","easy"],
        default:"good"
    },
    nextReview:{
        type:Date,
        default:Date.now,
    },
    reviewCount:{
        type:Number,
        default:0
    },
    //analytics
    isCorrect: {
        type: Boolean,
        default: null,
      },
      lastReviewed: {
        type: Date,
      },
},
{timestamps:true}
);
module.exports = mongoose.model("Card", cardSchema);