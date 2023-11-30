import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';
import { RoleService } from "../services/role.service";
const roleService = new RoleService()

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     token:
 *       type: string
 *       in: header
 *       name: Access-Token
 * 
 *   security:
 *     - token
 */

/**
 * Middleware to check the validity of the provided access token.
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next middleware function
 * @returns {void}
 * @throws {403} If access token is not provided.
 * @throws {401} If access token is invalid or expired.
 */

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

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     adminKey:
 *       type: string
 *       in: header
 *       name: Admin-Key
 * 
 *   security:
 *     - adminKey
 */

/**
 * Middleware to check if the provided Admin-Key is valid.
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next middleware function
 * @returns {void}
 * @throws {403} If Admin-Key is not provided.
 * @throws {401} If Admin-Key is incorrect.
 */

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

export async function createRoleAdmin() {
    const role_exsist = await roleService.findByName('admin')
    if(role_exsist === null) {
        return await roleService.create('admin')          
    }
}


