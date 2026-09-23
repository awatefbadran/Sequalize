import userModel from "../../DB/models/user.model.js"
/////// 1.Create a new user (using build and save) (make sure that the email does not exist before) (Don’t forget to Handlevalidation errors).////
export const createUser = async (req, res, next) => {
    try {
        const { name, email, password, role } = req.body;
        const existingUser = await userModel.findOne(
            { where: { email } }
        );
        if (existingUser) {
            return res.status(409).json(
                {
                    message: "Email already exists"
                });
        }

        const user = userModel.build({ name, email, password, role })
        await user.save()
        res.status(200).json({
            message: "signUp successfully",
            data: user
        })
    } catch (error) {
        if (error.name === "SequelizeValidationError") {
            return res.status(400).json({
                message: "Validation failed",
                errors: error.errors.map((err) => err.message
                )
            });
        }
    }
}
/////////////2. Create or update based on PK and use skip validation option.///////
export const updateUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, email, password, role } = req.body;

        const user = await userModel.findByPk(id)

        if (user) {
            user.name = name || user.name
            user.email = email || user.email
            user.password = password || user.password
            user.role = role || user.role
            await user.save({ validate: false });

            return res.status(200).json({
                message: "signUp successfully",
                data: user
            })
        } else {

            const newUser = userModel.build({ id, name, email, password, role });
            await newUser.save({ validate: false });
            return res.status(201).json({
                message: "User created successfully",
                data: newUser
            });
        }

    } catch (error) {
        if (error.name === "SequelizeValidationError") {
            return res.status(400).json({
                message: "Validation failed",
                errors: error.errors.map((err) => err.message
                )
            });
        }
        next(error);

    }
}
////////3.Write an API endpoint to find a user by their email address/////
export const getUserByEmail = async (req, res, next) => {
    try {

        const { email } = req.query;
        const user = await userModel.findOne({
             where: { email } 
            }); 
            if (!user) {
                 return res.status(404).json({
                     message: "User Email NOT found" 
                    });  
                }
        return res.status(200).json({
            message: "User Email Founded",
            data: user
        })



    } catch (error) {
        if (error.name === "SequelizeValidationError") {
            return res.status(400).json({
                message: "NO USER FOUND",
                errors: error.errors.map((err) => err.message
                )
            });
        }
        next(error);

    }
}
////////////4.Retrieve a user by their PK, excluding the “role” field from the response//////
export const getUserById = async (req, res, next) => {
    try {

        const { id } = req.params;
        const user = await userModel.findByPk(id,{attributes:{exclude:['role']}}); 
         if (!user) {
             return res.status(404).json({ 
                message: "User not found"
             });
             }
        return res.status(200).json({
            message: "User Email Founded",
            data: user
        })

    } catch (error) {
        if (error.name === "SequelizeValidationError") {
            return res.status(400).json({
                message: "NO USER FOUND",
                errors: error.errors.map((err) => err.message
                )
            });
        }
        next(error);

    }
}