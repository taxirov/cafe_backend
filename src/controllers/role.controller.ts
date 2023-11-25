import { Request, Response } from 'express';
import { RoleService } from '../services/role.service';

const roleService = new RoleService();

export class RoleController {
  // done
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
        res.status(201).json({
          message: "Role success created",
          role
        });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error creating role' });
    }
  }
  // done
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
        res.status(200).json({
          message: "Role data success updated",
          role
        })
      }
    } catch (error) {
      res.status(500).json({ error: 'Error updating role' });
    }
  }
  // done
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
        res.status(200).json({
          message: "Role already deleted",
          role
        })
      }
    } catch (error) {
      res.status(500).json({
        message: "Error deleting role"
      })
    }
  }
  // done
  async get(req: Request, res: Response) {
    try {
      const roles = await roleService.findAll();
      if (roles.length == 0) {
        res.status(200).json({
          message: "Roles not created yet"
        })
      } else {
        res.status(200).json({
          message: "All roles",
          roles
        })
      }
      res.status
    } catch (error) {
      res.status(500).json({ error: 'Error fetching role' });
    }
  }
}