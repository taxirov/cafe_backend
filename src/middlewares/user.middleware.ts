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
            message: "Admin-Key is not provided"
        })
    } else {
        if (admin_key === process.env.ADMIN_KEY) {
            next()
        } else {
            res.status(401).json({
                message: "Admin-Key is incorrect"
            })
        }
    }

}

export async function createRoleAdminWaiter() {
    const role_admin = await roleService.findByName('admin')
    const role_waiter = await roleService.findByName('waiter')
    if (role_admin === null && role_waiter === null) {
        await roleService.create('waiter')
        await roleService.create('admin')
    }
}


export async function addHeaders(req: Request, res: Response, next: NextFunction) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'https://madatota.vercel.app');
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS, PATCH, DELETE');
    next();
}