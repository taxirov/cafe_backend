import { Request, Response } from 'express';
import { UserService } from '../services/user.service';
import { RoleService } from '../services/role.service';
import { OrderService } from '../services/order.service';
import jwt from 'jsonwebtoken';

type UserResponse = {
  id: number,
  name: string,
  username: string,
  image: null | string,
  phone: string,
  email: string,
  salary: number,
  role: string | undefined,
  orders: number,
  create_date: Date,
  update_date: Date
}

const userService = new UserService();
const roleService = new RoleService();
const orderService = new OrderService();

export class UserController {
  // done
  async register(req: Request, res: Response) {
    try {
      const { name, username, password, salary, role_id, phone, email } = req.body;
      const user_exsist = await userService.findByUsername(username)
      if (user_exsist) {
        res.status(403).json({ message: "User already exsist with username: " + username })
      } else {
        const user = await userService.create({ name, username, password, salary, role_id, phone, email });
        const role = await roleService.findById(role_id)
        const payload = {
          id: user.id,
          name: user.name,
          username: user.username,
          phone: user.phone
        }
        const token = jwt.sign(payload, process.env.SECRET_KEY!, { expiresIn: "7d" })
        const user_res = {
          id: user.id,
          name: user.name,
          username: user.username,
          phone: user.phone,
          email: user.email,
          salary: user.salary,
          orders: 0,
          image: user.image,
          role: role?.name,
          create_date: user.create_date
        }
        res.status(200).json({
          message: "Register success",
          user: user_res,
          token
        })
      }
    } catch (error) {
      res.status(500).json({ error: 'Error creating user' });
    }
  };
  // done
  async login(req: Request, res: Response) {
    try {
      const { username, password } = req.body;
      const user_exsist = await userService.findByUsername(username);
      if (!user_exsist) {
        res.status(404).json({
          message: "User not found"
        })
      } else {
        if (password === user_exsist.password) {
          const role = await roleService.findById(user_exsist.role_id)
          const payload = {
            id: user_exsist.id,
            name: user_exsist.name,
            username: user_exsist.username,
            phone: user_exsist.phone
          }
          const token = jwt.sign(payload, process.env.SECRET_KEY!, { expiresIn: "7d" })
          const user_orders = await orderService.findByUser(user_exsist.id)
          const user_res = {
            id: user_exsist.id,
            name: user_exsist.name,
            username: user_exsist.username,
            phone: user_exsist.phone,
            email: user_exsist.email,
            salary: user_exsist.salary,
            orders: user_orders.length,
            image: user_exsist.image,
            role: role?.name,
            create_date: user_exsist.create_date
          }
          res.status(200).json({
            message: "Login success",
            user: user_res,
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
  // done
  async getTokenVerify(req: Request, res: Response) {
    res.status(200).json({
      message: "Verify success"
    })
  }
  // done
  async getAdminVerify(req: Request, res: Response) {
    res.status(200).json({
      message: "Verify success"
    })
  }
  // done
  async getAll(req: Request, res: Response) {
    try {
      const user = await userService.findById(res.locals.payload.id)
      if (user) {
        const role = await roleService.findById(user.role_id)
        if (role) {
          if (role.name === "admin") {
            const users = await userService.findAll()
            let users_res: UserResponse[] = []
            for (let i = 0; i < users.length; i++) {
              const role = await roleService.findById(users[i].role_id)
              const user_orders = await orderService.findByUser(users[i].id)
              users_res.push({
                id: users[i].id,
                name: users[i].name,
                username: users[i].username,
                image: users[i].image,
                phone: users[i].phone,
                email: users[i].email,
                salary: users[i].salary,
                role: role?.name,
                orders: user_orders.length,
                create_date: user_orders[i].create_date,
                update_date: users[i].update_date
              })
            }
            res.status(200).json({
              message: "All users",
              users: users_res
            })
          } else {
            res.status(401).json({ message: "You are not admin"})
          }
        }
      }
    } catch (error) {
      res.status(500).json({ error: 'Error getting users' })
    }
  }
  // done
  async delete(req: Request, res: Response) {
    const { id } = req.params
    try {
      const user = await userService.findById(+id)
      if (!user) {
        res.status(404).json({
          message: "User not found by id: " + id
        })
      } else {
        const user_deleted = await userService.delete(+id)
        const role = await roleService.findById(user.role_id)
        const user_orders = await orderService.findByUser(user_deleted.id)
        const user_res: UserResponse = {
          id: user_deleted.id,
          name: user_deleted.name,
          username: user_deleted.username,
          phone: user_deleted.phone,
          email: user_deleted.email,
          role: role?.name,
          salary: user_deleted.salary,
          image: user_deleted.image,
          orders: user_orders.length,
          create_date: user_deleted.create_date,
          update_date: user_deleted.update_date
        }
        res.status(200).json({
          message: "User already deleted by id: " + id,
          user: user_res
        })
      }
    } catch (error) {
      res.status(500).json({
        message: "Error deleting user"
      })
    }
  }
  // done
  async put(req: Request, res: Response) {
    try {
      const { id } = req.params
      const { name, username, salary, role_id, phone, email } = req.body
      const user_exsist = await userService.findById(+id)
      if (!user_exsist) {
        res.status(404).json({
          message: "User not found by id: " + id
        })
      } else {
        const user = await userService.updateData(+id, name, username, phone, salary, email, role_id)
        const role = await roleService.findById(user.role_id)
        const user_orders = await orderService.findByUser(user.id)
        const user_res = {
          id: user.id,
          name: user.name,
          username: user.username,
          phone: user.phone,
          email: user.email,
          salary: user.salary,
          orders: user_orders.length,
          image: user.image,
          role: role?.name,
          create_date: user.create_date
        }
        res.status(200).json({
          message: "User data success update",
          user: user_res
        })
      }
    } catch (error) {
      res.status(500).json({
        message: "Error updating user data"
      })
    }
  }
}