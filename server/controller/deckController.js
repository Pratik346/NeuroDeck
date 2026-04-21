const Deck=require("../models/deck.js");
const Card=require("../models/card.js");
//get all decks
const getDecks=async(req,res)=>{
    try {
        const decks=await Deck.find({user:req.user._id}).sort({createdAt:-1});
        res.json(decks);
    } catch (error) {
        res.status(500).json({message:error.message});
    }
}
//get a single deck
const getDeckById=async(req,res)=>{
    try{
    const deck=await Deck.findById(req.params.id);
    if(!deck){
        return res.status(404).json({message:"Deck not found"});
    }
    if(deck.user.toString()!==req.user._id.toString()){
        return res.status(401).json({message:"Not Authorized"});
    }
    res.json(deck);
}catch(error){
    res.status(500).json({message:error.message});
}
}
//create deck
const createDeck=async(req,res)=>{
    try {
        const {title,description}=req.body;
        if(!title){
            return res.status(400).json({message:"Title is required"});
        }
        const deck=await Deck.create({
            user:req.user._id,
            title,
            description:description || "",

        });
        res.status(201).json(deck);
    } catch (error) {
        res.status(500).json({message:error.message});
    }
}
//update deck
const updateDeck=async(req,res)=>{
    try {
        const deck=await Deck.findById(req.params.id);
        if(!deck){
            return res.status(404).json({message:"Deck not found"});
        }
        if(deck.user.toString()!==req.user._id.toString()){
            return res.status(401).json({message:"Not Authorized"});
        }
        const {title,description}=req.body;
        deck.title=title || deck.title;
        deck.description=description??deck.description;
        const updatedDeck=await deck.save();
        res.json(updatedDeck);
    } catch (error) {
        res.status(500).json({message:error.message});
    }
}
//delete the deck
const deleteDeck=async(req,res)=>{
    try {
        const deck=await Deck.findById(req.params.id);
        if(!deck){
            return res.status(404).json({message:"Deck not found"});
        }
        if(deck.user.toString()!==req.user._id.toString()){
            return res.status(401).json({message:"Not Authorized"});
        }
        await Card.deleteMany({deck:req.params.id});
        await deck.deleteOne();
        res.json({message:"Deck Deleted!"});
    } catch (error) {
        res.status(500).json({message:error.message});
    }
}
module.exports = { getDecks, getDeckById, createDeck, updateDeck, deleteDeck };