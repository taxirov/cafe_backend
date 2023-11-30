import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUI from 'swagger-ui-express';
import { Express } from 'express';
import { Request, Response } from 'express';
import jwt from "jsonwebtoken"
import { RoleService } from './services/role.service';
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
export async function checkToken(req: Request, res: Response, next: any) {
    try {
        const token = req.header('Access-Token');
        if (!token) {
            res.status(403).json({
                message: 'Token not provided',
            });
        } else {
            const payload = jwt.verify(token, process.env.SECRET_KEY!);
            res.locals.payload = payload;
            next();
        }
    } catch (err: any) {
        res.status(401).json({
            message: 'Token invalid or expired',
        });
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
export async function checkAdmin(req: Request, res: Response, next: any) {
    const adminKey = req.header('Admin-Key');
    if (!adminKey) {
        return res.status(403).json({
            message: 'Admin-Key is not provided',
        });
    } else {
        if (adminKey === process.env.ADMIN_KEY) {
            next();
        } else {
            res.status(401).json({
                message: 'Admin-Key is incorrect',
            });
        }
    }
}

/**
 * Function to create the 'admin' role if it doesn't exist.
 * @returns {Promise<void>}
 */
export async function createRoleAdmin() {
    const roleExist = await roleService.findByName('admin');
    if (roleExist === null) {
        return await roleService.create('admin');
    }
}


/**
 * Middleware to extract and validate user information from the access token.
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next middleware function
 * @returns {void}
 * @throws {401} If user information cannot be extracted or is invalid.
 */
export async function extractUser(req: Request, res: Response, next: any) {
    // Extract user information from the access token and set it in res.locals.user
    // This middleware assumes that user information is stored in the payload of the access token
    try {
        const token = req.header('Access-Token');
        if (!token) {
            throw new Error('Token not provided');
        }

        const payload = jwt.verify(token, process.env.SECRET_KEY!);
        res.locals.user = payload;
        next();
    } catch (err: any) {
        res.status(401).json({
            message: 'User information extraction failed',
        });
    }
}

const swaggerOptions: swaggerJSDoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Your API Documentation',
            version: '1.0.0',
            description: 'Documentation for your API',
        },
        components: {
            schemas: {
                Role: {
                    type: "object",
                    properties: {
                        id: {
                            type: "number",
                            description: "default (autoincriment()"
                        },
                        name: {
                            type: "string",
                            description: "example: admin"
                        }, 
                        created_date: {
                            type: "Date"
                        },
                        update_date: {
                            type: "Date"
                        }
                    },
                    required: ["name"]
                },
                User: {
                    type: "object",
                    properties: {
                        id: {
                            type: "number",
                            description: "default autoincriment()"
                        },
                        name: {
                            type: "string",
                            description: "example: Akmal Alimov"
                        },
                        username: {
                            type: "string",
                            description: "example: akmalalimov"
                        }, 
                        created_date: {
                            type: "Date"
                        },
                        update_date: {
                            type: "Date"
                        }
                    }
                }
            },
            securitySchemes: {
                tokenAuth: {
                    type: 'http',
                    scheme: 'bearer'
                },
            }
        },
        security: {
            tokenAuth: "string",
        }
    },
    apis: ['./routes/role.routes.ts'],
}

/**
 * Function to configure and serve Swagger documentation.
 * @param {Express} app - Express application
 * @param {number} port - Port on which the server is running
 */

function swaggerDocs(app: Express, port: number): void {
    const swaggerSpec = swaggerJSDoc(swaggerOptions);
    // Serve Swagger UI at /api-docs
    app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));
    // Docs in JSON format
    app.get('/docs.json', (_, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(swaggerSpec);
    });
    console.log(`Docs available at http://localhost:${port}/api-docs`);
}

export default swaggerDocs;
