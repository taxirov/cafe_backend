import { Request, Response } from 'express';
import { UserService } from '../services/user.service';
import jwt from 'jsonwebtoken';

const userService = new UserService();

export class UserController {
  register = async (req: Request, res: Response) => {
    try {
      const { name, username, password, salary, role, phone } = req.body;
      const user_exsist = await userService.findByUsername(username)
      if(user_exsist){
        res.status(403).json({ message: "User already exsist with username: " + username})
      } else {
        const user = await userService.create({ name, username, password, salary, role, phone });
        const payload = {
            id: user.id,
            name: user.name,
            username: user.username,
            phone: user.phone,
            role: user.role,
            salary: user.salary,
            image: user.image
        }
        const token = jwt.sign(payload, process.env.SECRET_KEY!, { expiresIn: "7d"})
        res.status(200).json({
            message: "Register success",
            payload,
            token
        })
      }
    } catch (error) {
      res.status(500).json({ error: 'Error creating user' });
    }
  };

  login = async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;
      const user_exsist = await userService.findByUsername(username);
      if(!user_exsist) {
        res.status(404).json({
          message: "User not found"
        })
      } else {
        if(password === user_exsist.password) {
          const payload = {
            id: user_exsist.id,
            name: user_exsist.name,
            username: user_exsist.username,
            phone: user_exsist.phone,
            role: user_exsist.role,
            salary: user_exsist.salary,
            image: user_exsist.image
        }
        const token = jwt.sign(payload, process.env.SECRET_KEY!, { expiresIn: "7d"})
        res.status(200).json({
            message: "Login success",
            payload,
            token
        })
        } else {
          res.status(401).json({
            message: "Password or username wrong"
          })
        }
      }
    } catch (error) {
      res.status(500).json({
        message: "Error login user"
      })
    }
  }
  
  getVerify = async (req: Request, res: Response) => {
      res.status(200).json({
          message: "All good"
      })
  }
 
  getAll = async (req: Request, res: Response) => {
    try {
      const users = await userService.findAll()
      res.status(200).json({
          message: "All users",
          users
        })
    } catch(error) {
      res.status(500).json({ error: 'Error getting users'})
    }
  }

  getById = async (req: Request, res: Response) => {
    
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
