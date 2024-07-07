
// auth, isStudent,isAdmin

const jwt = require("jsonwebtoken");
require("dotenv").config();

// this is the syntax for the middle ware, hence it can call the next middlware
exports.auth = (req,res, next) => {
    try{
        //extract JWT token
        //PENDING : other ways to fetch token -> heades wala
        const token = req.body.token ;

        if(!token) {
            return res.status(401).json({
                success:false,
                message:'Token Missing',
            });
        }

        //verify the token
        
        try{
            //it is the syntax, see the document for more details
            const payload = jwt.verify(token, process.env.JWT_SECRET);
            console.log(payload);
            //why this ?
            // because aage jake chek karna hai , payload se, kaun sa role hai user ka, like Studens, or Admin
            req.user = payload;
        } catch(error) {
            return res.status(401).json({
                success:false,
                message:'token is invalid',
            });
        }
        next();
    } 
    catch(error) {
        return res.status(401).json({
            success:false,
            message:'Something went wrong, while verifying the token',
        });
    }
   
}

//dono role chek kar rahe hai, hence it is used for the authenticate
exports.isStudent = (req,res,next) => {
    try{
            if(req.user.role !== "Student") {
                return res.status(401).json({
                    success:false,
                    message:'THis is a protected route for students',
                });
            }
            next();
    }
    catch(error) {
        return res.status(500).json({
            success:false,
            message:'User Role is not matching',
        })
    }
}

exports.isAdmin = (req,res,next) => {
    try{
        if(req.user.role !== "Admin") {
            return res.status(401).json({
                success:false,
                message:'THis is a protected route for admin',
            });
        }
        next();
}
catch(error) {
    return res.status(500).json({
        success:false,
        message:'User Role is not matching',
    })
}
}