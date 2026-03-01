// imports
import {
  type Request,
  type Response,
  type NextFunction
} from "express";

import jwt from "jsonwebtoken";

import bcrypt from "bcrypt";
import Joi, { ValidationResult } from "joi";

// Project imports
import { UserModel } from "../models/userModel";
import { User } from "../interfaces/user";
import { connect, disconnect } from '../repository/database';

/**
 * Register a new user
 * @param req 
 * @param res 
 * @returns 
 */
export async function registerUser(req: Request, res: Response) {

  try {
    // validate the user and the password info
    const { error } = validateUserRegistrationInfo(req.body);
    if (error) {
        res.status(400).json({ error: error.details[0].message });
        return;
    }

    await connect();

    // check if the email is already in use
    const emailExists = await UserModel.findOne({ email: req.body.email });
    if (emailExists) {
        res.status(400).json({ error: "Email already exists" });
        return;
    }

    // hash the password
    const salt = await bcrypt.genSalt(10);
    const passwordHashed = await bcrypt.hash(req.body.password, salt);

    // create the user in the databases
    const userObject = new UserModel({
        name: req.body.name,
        email: req.body.email,
        password: passwordHashed,
    });

    const savedUser = await userObject.save();
    res.status(201).json({ error: null, data: savedUser._id });

  } catch (error) {
    res.status(500).send( "Error registering user: " + error);

  }
  finally {
    await disconnect();
  }

};


/**
 * login and existing user
 * @param req
 * @param res
 * @return JWT token if successful, error message otherwise
 */

export async function loginUser(req: Request, res: Response) {

  try{

    // validate the user login info
    const { error } = validateUserLoginInfo(req.body);
    if (error) {
        res.status(400).json({ error: error.details[0].message });
        return;
    }

    // find the user in the repostiry
    await connect();


    const user: User | null = await UserModel.findOne ( { email: req.body.email } );
    if (!user) {
        res.status(400).json({ error: "Email or password is wrong" });
        return;
    }
    else {
          // create auth token and sent it back
          const validPassword: boolean = await bcrypt.compare(req.body.password, user.password);
          if (!validPassword) {
              res.status(400).json({ error: "Email or password is wrong" });
              return;
          }

          const userId: string = user.id;
          const token: string = jwt.sign(
            {
              //payload
              name: user.name,
              email: user.email,
              id: userId
            },
            process.env.TOKEN_SECRET as string,
            {
              expiresIn: "2h"
            }
          );
          // attach the token and send it back to the client
          res.header(200).header("auth-token", token).json({ error: null, data: { userId, token }});
    }
  }
  catch (error) {
    res.status(500).send("Error logging in user: " + error);
  }
  finally{
    await disconnect();
  }
}


/**
 * Middleware logic to verify the client JWT token
 * @param req 
 * @param res 
 * @param next 
 */
export function verifyToken(req: Request, res: Response, next: NextFunction) {

  const token = req.header("auth-token");

  if (!token) {
    res.status(400).json({ error: "Access Denied." });
    return;
  }

  try {
    if (token)
      jwt.verify(token, process.env.TOKEN_SECRET as string);

    next();
  }
  catch {
    res.status(401).send("Invalid Token");
  }
}


/**
 * Validate user registration info (name, email, password)
 * @param data 
 */
export function validateUserRegistrationInfo(data: User): ValidationResult {
    const schema = Joi.object({
        name: Joi.string().min(3).max(255).required(),
        email: Joi.string().email().min(3).max(255).required(),
        password: Joi.string().min(6).max(255).required()
    });

    // Přidej { abortEarly: false }
    return schema.validate(data, { abortEarly: false });
}

/**
 * Validate user login info (email, password)
 * @param data 
 */
export function validateUserLoginInfo(data: User): ValidationResult {
    const schema = Joi.object({
        email: Joi.string().email().min(3).max(255).required(),
        password: Joi.string().min(6).max(255).required()
    });

    return schema.validate(data);
}