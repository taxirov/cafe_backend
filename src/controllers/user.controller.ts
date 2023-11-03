import { Request, Response } from 'express';
import { UserService } from '../services/user.service';

const userService = new UserService();

export class UserController {
  public post = async (req: Request, res: Response) => {
    try {
      const { name, username, password, salary, role, phone } = req.body;
      const user_exsist = await userService.findByUsername(username)
      if(user_exsist){
        res.status(403).json({ message: "User already exsist with username: " + username})
      } else {
        const user = await userService.create({ name, username, password, salary, role, phone });
        res.status(201).json(user);
      }
    } catch (error) {
      res.status(500).json({ error: 'Error creating user' });
    }
  };
 
  public get = async (req: Request, res: Response) => {
    try {
      const users = await userService.findAll()
      if(users){
        res.status(200).json({
          message: "All users",
          users
        })
      } else {
        res.status(404).json({
          message: "Users not found"
        })
      }
    } catch(error) {
      res.status(500).json({ error: 'Error getting users'})
    }
  }
}


// export const updateUser = async (req: Request, res: Response) => {
//   const userId = parseInt(req.params.id);
//   const { name, username, password, image, salary, role } = req.body;

//   try {
//     const user = await userService.updateUser(userId, { name, username, password, image, salary, role });
//     if (user) {
//       res.json(user);
//     } else {
//       res.status(404).json({ error: 'User not found' });
//     }
//   } catch (error) {
//     res.status(500).json({ error: 'Error updating user' });
//   }
// };

// export const deleteUser = async (req: Request, res: Response) => {
//   const userId = parseInt(req.params.id);

//   try {
//     const user = await userService.deleteUser(userId);
//     if (user) {
//       res.json(user);
//     } else {
//       res.status(404).json({ error: 'User not found' });
//     }
//   } catch (error) {
//     res.status(500).json({ error: 'Error deleting user' });
//   }
// };

// export const getUser = async (req: Request, res: Response) => {
//   const userId = parseInt(req.params.id);

//   try {
//     const user = await userService.getUser(userId);
//     if (user) {
//       res.json(user);
//     } else {
//       res.status(404).json({ error: 'User not found' });
//     }
//   } catch (error) {
//     res.status(500).json({ error: 'Error fetching user' });
//   }
// };
