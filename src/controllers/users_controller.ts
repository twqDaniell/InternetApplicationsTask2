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
  }

  async updateUser(req: Request, res: Response) {
    const userId = req.params.id;
    const updateData = req.body;

    try {
      const updatedUser = await this.user.findByIdAndUpdate(
        userId,
        updateData,
        { new: true }
      );
      res.status(200).send(updatedUser);
    } catch (error) {
      res.status(400).send(error);
    }
  }

  async deleteUser(req: Request, res: Response) {
    const userId = req.params.id;

    try {
      await this.user.findByIdAndDelete(userId);
      res.status(200).send();
    } catch (error) {
      res.status(400).send(error);
    }
  }

  async getUserById(req: Request, res: Response) {
    const userId = req.params.id;

    try {
      const user = await this.user.findById(userId);

      if (user === null) {
        res.status(404).send("not found");
      } else {
        res.status(200).send(user);
      }
    } catch (error) {
      res.status(400).send(error);
    }
  }
}

export default new UsersController(userModel);
