import { Request, Response } from "express";
import { Model } from "mongoose";
import userModel, { IUser } from "../models/users_model";

class UsersController<IUser> {
    user: Model<IUser>;
  constructor(user: Model<IUser>) {
    this.user = user;
  }

  async createUser(req: Request, res: Response) {
    const user = req.body;

    try {
      const newUser = await this.user.create(user);
      res.status(201).send(newUser);
    } catch (error) {
      res.status(400).send(error);
    }
  };
};

export default new UsersController(userModel);
