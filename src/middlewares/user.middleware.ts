import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';
import { RoleService } from "../services/role.service";
const roleService = new RoleService()

export async function checkToken(req: Request, res: Response, next: NextFunction) {
    try {
        const token = req.header('access-token')
        if (!token) {
            res.status(403).json({
                message: "Token not provided"
            })
        } else {
            const payload = jwt.verify(token, process.env.SECRET_KEY!)
            res.locals.payload = payload
            next()
        }
    }
    catch (err: any) {
        res.status(401).json({
            message: "Token invalid or expired"
        })
    }
}

export async function checkAdmin(req: Request, res: Response, next: NextFunction) {
    const admin_key = req.header('admin-key')
    if (!admin_key) {
        return res.status(403).json({
            message: "Admin key not provided"
        })
    } else {
            if (admin_key === process.env.ADMIN_KEY) {
                next()
            } else {
                res.status(401).json({
                    message: "Admin key wrong"
                })
            }
        }
    
}

export async function createRoleAdmin() {
    const role_exsist = await roleService.findByName('admin')
    if(role_exsist === null) {
        return await roleService.create('admin')          
    }
}


