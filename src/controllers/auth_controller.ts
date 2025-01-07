import { Request, Response } from "express";
import userModel, { IUser } from "../models/users_model";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { Document } from "mongoose";

type UserDocument = Document<unknown, {}, IUser> &
  IUser &
  Required<{
    _id: string;
  }> & {
    __v: number;
  };

const generateTokens = (
  user: IUser
): { accessToken: string; refreshToken: string } | null => {
  if (!process.env.TOKEN_SECRET) {
    return null;
  }

  const random = Math.random().toString();
  const accessToken = jwt.sign(
    { _id: user._id, random: random },
    process.env.TOKEN_SECRET,
    { expiresIn: process.env.TOKEN_EXPIRE }
  );
  const refreshToken = jwt.sign(
    { _id: user._id, random: random },
    process.env.TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRE }
  );

  if (user.refreshToken == null) {
    user.refreshToken = [];
  }

  user.refreshToken.push(refreshToken);

  return { accessToken: accessToken, refreshToken: refreshToken };
};

const verifyAccessToken = (refreshToken: string | undefined) => {
  return new Promise<UserDocument>((resolve, reject) => {
    if (!refreshToken) {
      reject("Access denied");
      return;
    }

    if (!process.env.TOKEN_SECRET) {
      reject("Access denied");
      return;
    }

    jwt.verify(
      refreshToken,
      process.env.TOKEN_SECRET,
      async (err: any, payload: any) => {
        if (err) {
          reject("Access denied");
          return;
        }

        const userId = payload._id;

        try {
          const user = await userModel.findById(userId);

          if (!user) {
            return false;
          }

          if (!user.refreshToken || !user.refreshToken.includes(refreshToken)) {
            user.refreshToken = [];
            await user.save();
            reject("Access Denied");
            return;
          }

          user.refreshToken = user.refreshToken.filter(
            (token) => token !== refreshToken
          );
          resolve(user);
        } catch {
          reject("Access Denied");
          return;
        }
      }
    );
  });
};

const register = async (req: Request, res: Response) => {
  try {
    const password = req.body.password;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await userModel.create({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });
    res.status(200).send(user);
  } catch (err) {
    res.status(400).send("error registering user");
  }
};

const login = async (req: Request, res: Response) => {
  try {
    const user = await userModel.findOne({ email: req.body.email });

    if (!user) {
      res.status(400).send("wrong email or password");
      return;
    }

    const valid = await bcrypt.compare(req.body.password, user.password);

    if (!valid) {
      res.status(400).send("wrong email or password");
      return;
    }

    const tokens = generateTokens(user);

    if (!tokens) {
      res.status(400).send("Access denied");
      return;
    }

    await user.save();

    res.status(200).send({
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      _id: user._id,
    });
  } catch (err) {
    res.status(400).send("wrong email or password");
  }
};

const logout = async (req: Request, res: Response) => {
  const refreshToken = req.body.refreshToken;

  try {
    const user = await verifyAccessToken(refreshToken);
    await user.save();

    res.status(200).send("Logged out");
  } catch (err) {
    res.status(400).send("Access Denied");
  }
};

export default { register, login, logout };
