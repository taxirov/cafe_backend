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
  status: number,
  create_date: Date,
  update_date: Date
}

export type Payload = {
  id: number,
  name: string,
  username: string,
  phone: string
}

const userService = new UserService();
const roleService = new RoleService();
const orderService = new OrderService();

export class UserController {
  async register(req: Request, res: Response) {
    try {
      const { name, username, password, salary, role_id, phone, email } = req.body;
      const user_exsist = await userService.findByUsername(username)
      if (user_exsist) {
        res.status(409).json({ message: "User already exsist with username: " + username })
      } else {
        const user = await userService.create({ name, username, password, salary, role_id, phone, email });
        const role = await roleService.findById(role_id)
        const payload: Payload = {
          id: user.id,
          name: user.name,
          username: user.username,
          phone: user.phone
        }
        const token = jwt.sign(payload, process.env.SECRET_KEY!, { expiresIn: "7d" })
        const user_res: UserResponse = {
          id: user.id,
          name: user.name,
          username: user.username,
          phone: user.phone,
          email: user.email,
          salary: user.salary,
          orders: 0,
          image: user.image,
          role: role?.name,
          status: user.status,
          create_date: user.create_date,
          update_date: user.update_date
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
  }
  async login(req: Request, res: Response) {
    try {
      const { username, password } = req.body;
      const user_exsist = await userService.findByUsername(username);
      if (!user_exsist) {
        res.status(404).json({
          message: "User not found"
        })
      } else {
        if (user_exsist.status == 0) {
          res.status(403).json({
            message: "You are not active site. Please contact admin."
          })
        } else {
          if (password === user_exsist.password) {
            const role = await roleService.findById(user_exsist.role_id)
            const payload: Payload = {
              id: user_exsist.id,
              name: user_exsist.name,
              username: user_exsist.username,
              phone: user_exsist.phone
            }
            const token = jwt.sign(payload, process.env.SECRET_KEY!, { expiresIn: "7d" })
            const user_orders = await orderService.findByUserCount(user_exsist.id)
            const user_res: UserResponse = {
              id: user_exsist.id,
              name: user_exsist.name,
              username: user_exsist.username,
              phone: user_exsist.phone,
              email: user_exsist.email,
              salary: user_exsist.salary,
              orders: user_orders,
              image: user_exsist.image,
              role: role?.name,
              status: user_exsist.status,
              create_date: user_exsist.create_date,
              update_date: user_exsist.update_date
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
          }}
      }
    } catch (error) {
      res.status(500).json({
        message: "Error login user"
      })
    }
  }
  async getTokenVerify(req: Request, res: Response) {
    try {
      const user_id = res.locals.payload.id
      const user_exsist = await userService.findById(+user_id);
      if (!user_exsist) {
        res.status(404).json({
          message: "User not found"
        })
      } else {
        const role = await roleService.findById(user_exsist.role_id)
        const user_orders = await orderService.findByUserCount(user_exsist.id)
        const user_res: UserResponse = {
          id: user_exsist.id,
          name: user_exsist.name,
          username: user_exsist.username,
          phone: user_exsist.phone,
          email: user_exsist.email,
          salary: user_exsist.salary,
          orders: user_orders,
          image: user_exsist.image,
          role: role?.name,
          status: user_exsist.status,
          create_date: user_exsist.create_date,
          update_date: user_exsist.update_date
        }
        res.status(200).json({
          message: "Verify success",
          user: user_res
        })
      }
    } catch (error) {
      res.status(500).json({ message: "Error verifing token" })
    }
  }
  async getAdminVerify(req: Request, res: Response) {
    try {
      res.status(200).json({
        message: "Verify success"
      })
    } catch (error) {
      res.status(500).json({ message: "Error verifing admin key" })
    }
  }
  async getAll(req: Request, res: Response) {
    try {
      const user_id: number = res.locals.payload.id
      const user = await userService.findById(user_id)
      if (!user) {
        res.status(404).json({ message: "User not found" })
      } else {
        const role = await roleService.findById(user.role_id)
        if (role) {
          if (role.name === "admin") {
            const users = await userService.findAll()
            let users_res: UserResponse[] = []
            for (let i = 0; i < users.length; i++) {
              const role = await roleService.findById(users[i].role_id)
              const user_orders = await orderService.findByUserCount(users[i].id)
              users_res.push({
                id: users[i].id,
                name: users[i].name,
                username: users[i].username,
                image: users[i].image,
                phone: users[i].phone,
                email: users[i].email,
                salary: users[i].salary,
                role: role?.name,
                status: users[i].status,
                orders: user_orders,
                create_date: users[i].create_date,
                update_date: users[i].update_date
              })
            }
            res.status(200).json({
              message: "All users",
              users: users_res
            })
          } else {
            res.status(401).json({ message: "You are not admin" })
          }
        } else {
          res.status(404).json({ message: "Role not found" })
        }
      }
    } catch (error) {
      res.status(500).json({ error: 'Error getting users' })
    }
  }
  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params
      const user = await userService.findById(+id)
      if (!user) {
        res.status(404).json({
          message: "User not found by id: " + id
        })
      } else {
        const user_deleted = await userService.delete(+id)
        const role = await roleService.findById(user.role_id)
        const user_orders = await orderService.findByUserCount(user_deleted.id)
        const user_res: UserResponse = {
          id: user_deleted.id,
          name: user_deleted.name,
          username: user_deleted.username,
          phone: user_deleted.phone,
          email: user_deleted.email,
          role: role?.name,
          salary: user_deleted.salary,
          image: user_deleted.image,
          status: user_deleted.status,
          orders: user_orders,
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
  async put(req: Request, res: Response) {
    try {
      const { id } = req.params
      const { name, username, salary, role_id, phone, email, status, password } = req.body
      const user_exsist = await userService.findById(+id)
      if (!user_exsist) {
        res.status(404).json({
          message: "User not found by id: " + id
        })
      } else {
        const user = await userService.updateData(+id, name, username, phone, salary, email, role_id, status, password)
        const role = await roleService.findById(user.role_id)
        const user_orders = await orderService.findByUserCount(user.id)
        const user_res: UserResponse = {
          id: user.id,
          name: user.name,
          username: user.username,
          phone: user.phone,
          email: user.email,
          salary: user.salary,
          orders: user_orders,
          image: user.image,
          status: user.status,
          role: role?.name,
          create_date: user.create_date,
          update_date: user.update_date
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
  async patchStatus(req: Request, res: Response) {
    try {
      const { id } = req.params
      const { status } = req.body
      const user = await userService.findById(+id)
      if (!user) {
        res.status(404).json({
          message: "User not found by id: " + id
        })
      } else {
        const user_updated = await userService.updateStatus(+id, +status)
        const role = await roleService.findById(user.role_id)
        const user_orders = await orderService.findByUserCount(user_updated.id)
        const user_res: UserResponse = {
          id: user_updated.id,
          name: user_updated.name,
          username: user_updated.username,
          phone: user_updated.phone,
          email: user_updated.email,
          role: role?.name,
          salary: user_updated.salary,
          image: user_updated.image,
          status: user_updated.status,
          orders: user_orders,
          create_date: user_updated.create_date,
          update_date: user_updated.update_date
        }
        res.status(200).json({
          message: "User already updated by id: " + id,
          user: user_res
        })
      }
    } catch (error) {
      res.status(500).json({
        message: "Error patching user status"
      })
    }
  }
}