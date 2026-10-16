import { body, validationResult } from "express-validator";


export function validate(req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array()
    });
  }

  next();
}


// CREATE VALIDATOR
export const createContactValidator = [

  body("name")
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be between 2 and 50 characters"),

  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email"),

  body("phone")
    .notEmpty()
    .withMessage("Phone is required")
    .isMobilePhone("any")
    .withMessage("Please provide a valid phone number"),

  body("company")
    .optional()
    .isLength({ max: 100 })
    .withMessage("Company name must not exceed 100 characters"),

  validate
];


// UPDATE VALIDATOR
export const updateContactValidator = [

  body("name")
    .optional()
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be between 2 and 50 characters"),

  body("email")
    .optional()
    .isEmail()
    .withMessage("Please provide a valid email"),

  body("phone")
    .optional()
    .isMobilePhone("any")
    .withMessage("Please provide a valid phone number"),

  body("company")
    .optional()
    .isLength({ max: 100 })
    .withMessage("Company name must not exceed 100 characters"),

  validate
];