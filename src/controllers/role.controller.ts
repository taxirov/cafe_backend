import { Request, Response } from 'express';
import { RoleService } from '../services/role.service';
import { UserService } from '../services/user.service';

const roleService = new RoleService();
const userService = new UserService();

export type RoleResponse = { 
  id: number,
  name: string,
  users: number,
  create_date: string,
  update_date: string
}

export class RoleController {
  async post(req: Request, res: Response) {
    try {
      const { name } = req.body;
      const role_exsist = await roleService.findByName(name)
      if (role_exsist) {
        res.status(403).json({
          message: "Role already exsist by name: " + name,
          role: role_exsist
        })
      } else {
        const role = await roleService.create(name);
        const users = await userService.findByRoleId(role.id)
          let role_response: RoleResponse = {
            id: role.id,
            name: role.name,
            users: users.length,
            create_date: role.create_date.toString(),
            update_date: role.updated_date.toString()
          }
        res.status(201).json({
          message: "Role success created",
          role: role_response
        });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error creating role' });
    }
  }
  async put(req: Request, res: Response) {
    const { id } = req.params;
    const { name } = req.body;
    try {
      const role_exsist = await roleService.findById(+id)
      if (!role_exsist) {
        res.status(404).json({
          message: "Role not found by id: " + id
        })
      } else {
        const role = await roleService.updateName(+id, name);
        const users = await userService.findByRoleId(role.id)
          let role_response: RoleResponse = {
            id: role.id,
            name: role.name,
            users: users.length,
            create_date: role.create_date.toString(),
            update_date: role.updated_date.toString()
          }
        res.status(200).json({
          message: "Role data success updated",
          role: role_response
        })
      }
    } catch (error) {
      res.status(500).json({ error: 'Error updating role' });
    }
  }
  async delete(req: Request, res: Response) {
    const { id } = req.params
    try {
      const role_exsist = await roleService.findById(+id)
      if (!role_exsist) {
        res.status(404).json({
          message: "Role not found by id: " + id
        })
      } else {
        const role = await roleService.delete(+id);
        const users = await userService.findByRoleId(role.id)
          let role_response: RoleResponse = {
            id: role.id,
            name: role.name,
            users: users.length,
            create_date: role.create_date.toString(),
            update_date: role.updated_date.toString()
          }
        res.status(200).json({
          message: "Role already deleted",
          role: role_response
        })
      }
    } catch (error) {
      res.status(500).json({
        message: "Error deleting role"
      })
    }
  }
  async get(req: Request, res: Response) {
    try {
      const roles = await roleService.findAll();
      if (roles.length == 0) {
        res.status(200).json({
          message: "Roles not created yet"
        })
      } else {
        let roles_response: RoleResponse[] = []
        for (let i = 0; i < roles.length; i++) {
          const users = await userService.findByRoleId(roles[i].id)
          let role_response: RoleResponse = {
            id: roles[i].id,
            name: roles[i].name,
            users: users.length,
            create_date: roles[i].create_date.toString(),
            update_date: roles[i].updated_date.toString()
          }
          roles_response.push(role_response)
        }
        res.status(200).json({
          message: "All roles",
          roles: roles_response
        })
      }
      res.status
    } catch (error) {
      res.status(500).json({ error: 'Error fetching role' });
    }
  }
}