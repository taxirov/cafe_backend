import { Request, Response } from 'express';
import { UserService } from '../services/user.service';
import jwt from 'jsonwebtoken';

const userService = new UserService();

export class UserController {
  register = async (req: Request, res: Response) => {
    try {
      const { name, username, password, salary, role_id, phone } = req.body;
      const user_exsist = await userService.findByUsername(username)
      if(user_exsist){
        res.status(403).json({ message: "User already exsist with username: " + username})
      } else {
        const user = await userService.create({ name, username, password, salary, role_id, phone });
        const payload = {
            id: user.id,
            name: user.name,
            username: user.username,
            phone: user.phone,
            role_id: user.role_id,
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
            role_id: user_exsist.role_id,
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

  delete = async (req: Request, res: Response) => {
    const { id } = req.params
    try {
      const user = await userService.findById(+id)
      if(!user) {
        res.status(404).json({
          message: "User not found by id: " + id
        })
      } else {
        const user_deleted = await userService.delete(+id)
        const payload = {
            id: user_deleted.id,
            name: user_deleted.name,
            username: user_deleted.username,
            phone: user_deleted.phone,
            role_id: user_deleted.role_id,
            salary: user_deleted.salary,
            image: user_deleted.image
        }
        res.status(200).json({
          message: "User already deleted by id: " + id,
          payload
        })
      }
    } catch(error) {
      res.status(500).json({
        message: "Error deleting user"
      })
    }
  }

  async put(req: Request, res: Response) {
    const { id } = req.params
    const { name, username, phone, salary } = req.body
    try {
      const user_exsist = await userService.findById(+id)
      if(!user_exsist) {
        res.status(404).json({
          message: "User not found by id: " + id
        })
      } else {
          const user = await userService.updateData(+id, name, username, phone, salary)
          const payload = {
            id: user.id,
            name: user.name,
            username: user.username,
            phone: user.phone,
            role_id: user.role_id,
            salary: user.salary,
            image: user.image
        }
      }
    } catch(error) {
      res.status(500).json({
        message: "Error updating user data"
      })
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
