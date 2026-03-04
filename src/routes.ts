import { Router, Request, Response } from 'express';
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProductById,
  deleteProductById,
} from './controllers/productController';
import { loginUser, registerUser, verifyToken } from './controllers/authController';
import { startCron } from './controllers/devController';

const router: Router = Router();

/**
 * @swagger
 * /:
 *   get:
 *     tags:
 *       - App Routes
 *     summary: Health check
 *     description: Basic route to check if the API is running
 *     responses:
 *       200:
 *         description: Server up and running.
 */
router.get('/', (req: Request, res: Response) => {
  res.status(200).send({ message: 'Welcome to the Gym Shop REST API' });
});

/**
 * @swagger
 * /start-cron/{duration}:
 *   get:
 *     tags:
 *       - Start Cron Jobs
 *     summary: Starts the cron job that keeps the server alive
 *     description: Pings the remote server at a regular interval to prevent it from sleeping
 *     parameters:
 *       - in: path
 *         name: duration
 *         required: true
 *         description: Total duration to keep the server alive in minutes
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Cron job started successfully
 */
router.get('/start-cron/:duration', startCron);

/**
 * @swagger
 * /user/register:
 *   post:
 *     tags:
 *       - User Routes
 *     summary: Register a new user
 *     description: Takes a user object in the body and registers them in the database
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/User"
 *           example:
 *             name: "Jan Novak"
 *             email: "jan@gymshop.com"
 *             password: "securepassword123"
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                 _id:
 *                   type: string
 */
router.post('/user/register', registerUser);

/**
 * @swagger
 * /user/login:
 *   post:
 *     tags:
 *       - User Routes
 *     summary: Login an existing user
 *     description: Authenticates an existing user and returns a JWT token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *           example:
 *             email: "admin@gymshop.com"
 *             password: "12345678"
 *     responses:
 *       200:
 *         description: User logged in successfully, returns JWT token
 */
router.post('/user/login', loginUser);

/**
 * @swagger
 * /products:
 *   post:
 *     tags:
 *       - Product Routes
 *     summary: Create a new gym product
 *     description: Creates a new product in the gym shop. Requires authentication.
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/Product"
 *           example:
 *             name: "Whey Protein Gold Standard"
 *             description: "Classic whey protein with 24g protein per serving. Great for post-workout recovery."
 *             imageUrl: "https://picsum.photos/500/500"
 *             price: 599
 *             stock: 50
 *             category: "Protein"
 *             brand: "Optimum Nutrition"
 *             weightKg: 2.27
 *             flavor: "Chocolate"
 *             servings: 74
 *             isOnDiscount: false
 *             discountPercentage: 0
 *             isHidden: false
 *             _createdBy: "6748771972ba527f3a17a313"
 *     responses:
 *       200:
 *         description: Product created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Product"
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized - invalid or missing token
 */
router.post('/products', verifyToken, createProduct);

/**
 * @swagger
 * /products:
 *   get:
 *     tags:
 *       - Product Routes
 *     summary: Get all products
 *     description: Retrieves a list of all gym products as JSON objects.
 *     parameters:
 *       - in: query
 *         name: category
 *         required: false
 *         description: Filter products by category
 *         schema:
 *           type: string
 *           enum: [Protein, Supplement, Equipment, Apparel]
 *     responses:
 *       200:
 *         description: A list of gym products.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/Product"
 */
router.get('/products', getAllProducts);

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     tags:
 *       - Product Routes
 *     summary: Get a specific product
 *     description: Retrieves a specific gym product by its MongoDB ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: MongoDB ID of the product
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A single product object.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Product"
 *       404:
 *         description: Product not found
 */
router.get('/products/:id', getProductById);

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     tags:
 *       - Product Routes
 *     summary: Update a specific product
 *     description: Updates a gym product by its MongoDB ID. Requires authentication.
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: MongoDB ID of the product
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/Product"
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Product not found
 *       401:
 *         description: Unauthorized - invalid or missing token
 */
router.put('/products/:id', verifyToken, updateProductById);

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     tags:
 *       - Product Routes
 *     summary: Delete a specific product
 *     description: Deletes a gym product by its MongoDB ID. Requires authentication.
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: MongoDB ID of the product
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       404:
 *         description: Product not found
 *       401:
 *         description: Unauthorized - invalid or missing token
 */
router.delete('/products/:id', verifyToken, deleteProductById);

export default router;