
const { decrypt } = require("dotenv");
const User=require("../models/User")
const bcrypt=require("bcrypt")
const jwt =require("jsonwebtoken")

//register conltoller

const registerUser = async(req,res)=>{
    try{
        //extract user information from frontend/requist body
        // console.log("Request Body Received:", req.body);//for debugging if thr req.ody is recieved or not
        const {username, email, password, role}= req.body;
        //check if the user is already exists in our database
        const checkExistingUser = await User.findOne({$or : [{username}, {email}]}); 
        if(checkExistingUser)
        {
            return res.status(400).json({
                success : false,
                message : "User already exist either with same username or email"
            })
        }
        
        //hash the user
        const salt=await bcrypt.genSalt(10);
        const hashedPassword=await bcrypt.hash(password,salt);

        //now create a new user and save it in your database

        const newlyCreatedUser = new User({
            username,
            email,
            password : hashedPassword,
            role : role || "user", 
        })

        await newlyCreatedUser.save();
         
        if(newlyCreatedUser){
            res.status(201).json({
                success : true,
                message : "User registration successful  🥳🥳"
            })
        }
        else{
            res.status(400).json({
                success : false,
                message : "Unable to register user. Please try again 🥳🥳"
            })
        }
    }
    catch(error){
        console.error(error);
        res.status(500).json({
            success : false,
            message : "some error occured ! please try again"
        })
    }
}

//login controller

const loginUser = async(req,res)=>{
    try{
        const {username, password} = req.body;
        
        //find if the current user exists in database or not

        const user = await User.findOne({username});   //user.password will be used to check password
         
        if(!user){
            return res.status(400).json({
                succss : false,
                message : "User doesn't exists !!!",
            })
        }
        //if password is correct or not

        const isPosswardMatch = await bcrypt.compare(password, user.password);

        if(!isPosswardMatch)
        {
            return res.status(400).json({
                succss : false,
                message : "Invalide credentials!!!",
            })
        }

        //create user token

        const accessToken = jwt.sign({
            userId : user._id,
            username : user.username,
            role : user.role
        },process.env.JWT_SECRET_KEY,{
            expiresIn : "15m"
        })

        res.status(200).json({
            success : true,
            message : "Logged in successfully !",
            accessToken
        })
    }
    catch(error){
        console.error(error);
        res.status(500).json({
            success : false,
            message : "some error occured ! please try again"
        })
    }
};

const changePassword = async(req,res) => {
    try{
        const userId = req.userInfo.userId;

        //extract the new and old password

        const {oldPassword, newPassword} = req.body;

        //find the current logged user

        const user = await User.findById(userId);

        if(!user){
            return res.status(400).json({
                success : false,
                message : "User not found"
            })
        }

        //check if old password is correct

        const isPasswordMatch = await bcrypt.compare(oldPassword, user.password);

        if(!isPasswordMatch){
            return res.status(400).json({
            success : false,
            message : "Old password is not correct! Please try again"
            });
        }

        //hast the new password

        const salt = await bcrypt.genSalt(10);
        const newHashedPassword = await bcrypt.hash(newPassword,salt); 

        //update user password

        user.password = newHashedPassword;
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Password changed successfully!"
        });

    }
    catch(error){
        console.error(error);
        res.status(500).json({
            success : false,
            message : "some error occured ! please try again"
        }) 
    }
}


module.exports = {registerUser, loginUser, changePassword};