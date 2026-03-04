import swaggerUi from 'swagger-ui-express';
import swaggerJSdoc from 'swagger-jsdoc';
import { Application } from 'express';

/**
 * Setup Swagger documentation for the Gym Shop API
 * @param app
 */
export function setupDocs(app: Application) {

    const swaggerDefinition = {
        openapi: '3.0.0',
        info: {
            title: 'Gym Shop REST API',
            version: '1.0.0',
            description: 'A REST API for managing gym products, supplements, and equipment.',
        },
        servers: [
            {
                url: 'http://localhost:4000/api/',
                description: 'Local development server',
            },
            {
                url: 'https://YOUR-DEPLOYED-URL.onrender.com/api/',
                description: 'Remote production server',
            },
        ],
        components: {
            securitySchemes: {
                ApiKeyAuth: {
                    type: 'apiKey',
                    in: 'header',
                    name: 'auth-token',
                },
            },
            schemas: {
                Product: {
                    type: 'object',
                    required: ['name', 'description', 'imageUrl', 'price', 'stock', 'category', 'brand', 'weightKg', '_createdBy'],
                    properties: {
                        name: { type: 'string', example: 'Whey Protein Gold Standard' },
                        description: { type: 'string', example: 'Classic whey protein with 24g protein per serving.' },
                        imageUrl: { type: 'string', example: 'https://picsum.photos/500/500' },
                        price: { type: 'number', example: 599 },
                        stock: { type: 'number', example: 50 },
                        category: {
                            type: 'string',
                            enum: ['Protein', 'Supplement', 'Equipment', 'Apparel'],
                            example: 'Protein'
                        },
                        brand: { type: 'string', example: 'Optimum Nutrition' },
                        weightKg: { type: 'number', example: 2.27 },
                        flavor: { type: 'string', example: 'Chocolate', nullable: true },
                        servings: { type: 'number', example: 74, nullable: true },
                        isOnDiscount: { type: 'boolean', example: false },
                        discountPercentage: { type: 'number', example: 0 },
                        isHidden: { type: 'boolean', example: false },
                        _createdBy: { type: 'string', example: '6748771972ba527f3a17a313' },
                    },
                },
                User: {
                    type: 'object',
                    required: ['name', 'email', 'password'],
                    properties: {
                        name: { type: 'string', example: 'Jan Novak' },
                        email: { type: 'string', example: 'jan@example.com' },
                        password: { type: 'string', example: 'securepassword123' },
                        registerDate: { type: 'string', format: 'date-time' },
                    },
                },
            },
        },
    };

    const options = {
        swaggerDefinition,
        apis: ['**/*.ts'],
    };

    const swaggerSpec = swaggerJSdoc(options);
    app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}