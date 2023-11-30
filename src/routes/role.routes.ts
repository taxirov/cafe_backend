import express from 'express';
import { RoleController } from '../controllers/role.controller';
import { createValidator } from 'express-joi-validation';
import { roleBodySchema } from '../validations/role.validation';
import { checkAdmin } from '../middlewares/user.middleware';

const router = express.Router();
const validator = createValidator();
const roleController = new RoleController();

/**
 * @swagger
 * tags:
 *   name: Roles
 *   description: API for managing roles
 */

/**
 * @swagger
 * /api/role:
 *   post:
 *     summary: Create a new role
 *     tags: [Roles]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Role'
 *     responses:
 *       200:
 *         description: Role created successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Admin-Key is incorrect
 *       403:
 *          description: Admin-Key is not provided
 */
router.post('/', validator.body(roleBodySchema), checkAdmin, roleController.post);

/**
 * @swagger
 * /api/role:
 *   get:
 *     summary: Get all roles
 *     tags: [Roles]
 *     responses:
 *       200:
 *         description: Successful operation
 */
router.get('/', roleController.get);

/**
 * @swagger
 * /api/role/{id}:
 *   delete:
 *     summary: Delete a role by ID
 *     tags: [Roles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Role ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Role deleted successfully
 *       401:
 *         description: Admin-Key is incorrect
 *       403:
 *          description: Admin-Key is not provided
 *       404:
 *         description: Role not found
 */
router.delete('/:id', checkAdmin, roleController.delete);

/**
 * @swagger
 * /api/role/{id}:
 *   put:
 *     summary: Update a role by ID
 *     tags: [Roles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Role ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Role'
 *     responses:
 *       200:
 *         description: Role updated successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Admin-Key is incorrect
 *       403:
 *          description: Admin-Key is not provided
 *       404:
 *         description: Role not found
 */
router.put('/:id', validator.body(roleBodySchema), checkAdmin, roleController.put);

export default router;
