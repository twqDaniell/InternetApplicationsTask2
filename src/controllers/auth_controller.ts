import { Request, Response } from 'express';
import userModel from '../models/users_model';
import bcrypt from 'bcrypt';

const register = async (req: Request, res: Response) => {
    try {
        const password = req.body.password;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await userModel.create({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword
        });
        res.status(200).send(user);
    } catch (err) {
        res.status(400).send("error registering user");
    }
};

export default { register };