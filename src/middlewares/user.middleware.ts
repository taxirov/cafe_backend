import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken'
import type { JwtPayload } from "jsonwebtoken";

export async function checkToken(req: Request, res: Response, next: NextFunction) {
    const token = req.header('access-token')
    if (!token) {
        return res.status(403).json({
            message: "Token not provided"
        })
    }
    try {
        const payload = jwt.verify(token, process.env.SECRET_KEY!)
        res.locals.payload = payload
        next()
    }
    catch (err: any) {
        res.status(401).json({
            message: "Token invalid or expired"
        })
    }
}

export async function checkAdmin(req: Request, res: Response, next: NextFunction) {
    const admin_key = req.header('admin-key')
    const token = req.header('access-token')
    if (!token) {
        return res.status(403).json({
            message: "Token not provided"
        })
    } else {
        if (!admin_key) {
            return res.status(403).json({
                message: "Admin key not provided"
            })
        } else {
            const payload = jwt.verify(token, process.env.SECRET_KEY!)
            if (typeof(payload) !== 'string' && payload.role === "admin") {
                if (admin_key === process.env.ADMIN_KEY) {
                    next()
                } else {
                    res.status(401).json({
                        message: "Admin key wrong"
                    })
                }
            } else {
                res.status(403).json({
                    message: "Your are not admin"
                })
            }
        }
    }
}


