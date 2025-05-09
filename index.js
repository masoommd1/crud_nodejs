const express=require("express");
const mongoose=require("mongoose");
const app=express();


// middleware

// middleware for handling json data coming from httpie or postman
app.use(express.json());



// database connection functions
async function dbconnect(){
    try{
        await mongoose.connect("mongodb://localhost:27017/node_crud");
        console.log("db connnected");
    }catch(err){
        console.error(err);
    }
}

// creating a producst models
const ProductSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true, // Added 'required' to make it consistent
    },
    quantity: {
        type: Number,
        default: 1,
        required: true,
    },
    description: {
        type: String,
    }
}, { timestamps: true }); // Fixed 'timestamps' to be used correctly

const Product = mongoose.model('Product', ProductSchema); // Fixed capitalization of 'model'


// creating useer model 

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    }
    
},{
    timestamps:true
})

const Users = mongoose.model('Users',userSchema); 


// routing

// app.get('/',(req,res)=>{
//     res.send("hello from node server");
// })

// app.get('/givemdinfo',(req,res)=>{
//     res.send("md is a bad boy");
// })

// const products=[
//     {id:1,name:"laptops"},
//     {id:2,name:"macbooks"}
// ]


// app.get('/product',(req,res)=>{
//     res.status(200).json(products);
// })


// products create

app.post('/product/create',async  (req,res)=>{


    // object destucture 
    // const {title,price,quantity,description}  = req.body;

    try{

        // we use products variable because it will return those value which we have give from postman/httpie
        const proudcts=await Product.create(req.body);


        res.status(200).json({msg:"sucessfully product created",proudcts});


    }catch(err){
        res.status(500).json({msg:"product creation failed.."});
    }

    // data come from postman or httpie 
    // console.log(req.body);


})

// creating inpoint for userschema 

app.post("/user/create", async (req,res)=>{

    const {username,email,password} = req.body;

    try {
        //check is email is duplicate
        const checkUser = await Users.findOne({ email });
        if (checkUser) {
            return res.status(409).json({ msg: "Email already exists" }); // Use 409 Conflict
        }


        const user_data = await Users.create(req.body);

        res.status(201).json({msg:"user created succesfully",user_data});
    } catch (error) {
        res.status(500).json({msg:"user creation failed"})   
    }
})

// selecting products from product schema

app.get('/products',async (req,res)=>{
    try{

        const products= await Product.find();
        res.status(200).json(products);

    }catch(err){
        res.status(500).json({msg:"error while selecting products.."})
    }
    
})

// seleting users  from read 

app.get("/users", async(req,res)=>{
    try {
        const user = await Users.find();
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({msg:"error while selecting users"});
    }
})

app.listen(8080,()=>{
    dbconnect();
    console.log("server is started");
})