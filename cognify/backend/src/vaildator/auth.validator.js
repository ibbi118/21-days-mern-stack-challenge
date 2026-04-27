import { body, validationResult  } from "express-validator";


 const validate = (req, res, next) => {
    const errors = validationResult(req);
    

    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array()
        });
    }

    next();
};


export const registerValidator = [
    
    // ✅ Username validation
    body("username")
        .notEmpty().withMessage("Username is required")
        .isString().withMessage("username must be string")
        .isLength({ min: 3 }).withMessage("Username must be at least 3 characters"),

    // ✅ Email validation
    body("email")
        .notEmpty().withMessage("Email is required")
        .isEmail().withMessage("Invalid email format"),

    // ✅ Password validation
    body("password")
        .notEmpty().withMessage("Password is required")
        .isLength({ min: 8 }).withMessage("Password must be at least 8 characters")
        .matches(/[A-Z]/).withMessage("Password must contain at least one uppercase letter")
        .matches(/[!@#$%^&*(),.?":{}|<>]/).withMessage("Password must contain at least one special character"),

        validate
];


export const loginValidator = [
    
    // ✅ Email validation
    body("email")
        .notEmpty().withMessage("Email is required")
        .isEmail().withMessage("Invalid email format"),

    // ✅ Password validation
    body("password")
        .notEmpty().withMessage("Password is required")
        .isLength({ min: 8 }).withMessage("Password must be at least 8 characters")
        .matches(/[A-Z]/).withMessage("Password must contain at least one uppercase letter")
        .matches(/[!@#$%^&*(),.?":{}|<>]/).withMessage("Password must contain at least one special character"),

        validate
];