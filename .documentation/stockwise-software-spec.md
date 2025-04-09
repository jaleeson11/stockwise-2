# OmniStock Software Requirements Specification

## System Design
- **Application Type**: Web-based SaaS with responsive design for desktop/tablet
- **Architecture**: Multi-tenant cloud-based service
- **Integration Model**: API-driven integration with eCommerce platforms
- **Data Synchronization**: Background job processing for platform syncing
- **Scalability**: Horizontally scalable microservices for core functions
- **Deployment**: Containerized application with CI/CD pipeline

## Architecture Pattern
- **Frontend**: Single Page Application (SPA) architecture
- **Backend**: Microservices architecture with the following services:
  - Authentication service
  - Product management service
  - Inventory management service
  - Integration service (platform connectors)
  - Notification service
  - Reporting service
- **Communication**: REST APIs with event-driven architecture for sync operations
- **Event Bus**: For asynchronous communication between services

## State Management
- **Frontend**: Centralized state management with Redux/Flux pattern
- **Data Caching**: Client-side caching for frequently accessed inventory data
- **Optimistic Updates**: For inventory adjustments to improve perceived performance
- **Synchronization**: Websocket connections for real-time inventory updates
- **Conflict Resolution**: Last-write-wins with version control for concurrent edits

## Data Flow
- **Platform Integration**: 
  - Scheduled pull operations from eCommerce platforms
  - Webhook listeners for real-time order events
  - Push operations for inventory updates
- **Inventory Updates**: 
  - User-initiated → API → Database → Platform sync jobs
  - Platform events → Webhook → Database → UI update
- **Order Processing**:
  - Platform order → Webhook → Inventory adjustment → Notification
- **Reporting**:
  - Database → Aggregation service → Cached report data → UI

## Technical Stack
- **Frontend**: 
  - React.js with TypeScript
  - Material UI or Tailwind CSS for UI components
  - Redux for state management
  - Chart.js for data visualization
- **Backend**:
  - Node.js with Express or NestJS
  - Alternatively: Python with FastAPI or Django REST Framework
- **Database**:
  - PostgreSQL for relational data
  - Redis for caching and real-time features
- **Infrastructure**:
  - Docker for containerization
  - Kubernetes for orchestration
  - AWS/Azure/GCP for cloud hosting
- **DevOps**:
  - GitHub Actions or Jenkins for CI/CD
  - ELK Stack for logging
  - Prometheus and Grafana for monitoring

## Authentication Process
- **User Authentication**:
  - JWT-based authentication
  - OAuth2 for social login options
  - Role-based access control (Admin, Manager, Staff)
- **Platform Authentication**:
  - Secure storage of API credentials
  - OAuth2 flows for platform connections
  - Refresh token management
  - Encrypted credential storage
- **Session Management**:
  - Short-lived access tokens (1 hour)
  - Longer refresh tokens (2 weeks)
  - Device fingerprinting for suspicious activity detection

## Route Design
- **/dashboard** - Main dashboard view
- **/inventory** - Inventory management
  - **/inventory/:productId** - Product detail view
  - **/inventory/bulk** - Bulk operations
- **/integrations** - Platform connection management
  - **/integrations/connect/:platformId** - Connection wizard
  - **/integrations/settings/:platformId** - Platform settings
- **/orders** - Order management and history
- **/reports** - Reporting center
  - **/reports/:reportId** - Specific report view
- **/settings** - Application settings
  - **/settings/users** - User management
  - **/settings/notifications** - Notification preferences
- **/account** - User account management

## API Design
- **Authentication Endpoints**:
  - `POST /api/auth/login` - User login
  - `POST /api/auth/refresh` - Refresh token
  - `POST /api/auth/logout` - Logout
  
- **Product Endpoints**:
  - `GET /api/products` - List products
  - `GET /api/products/:id` - Get product details
  - `POST /api/products` - Create product
  - `PUT /api/products/:id` - Update product
  - `POST /api/products/import` - Bulk import
  
- **Inventory Endpoints**:
  - `GET /api/inventory` - Current inventory levels
  - `POST /api/inventory/adjust` - Adjust inventory
  - `GET /api/inventory/history/:productId` - Stock history
  
- **Integration Endpoints**:
  - `GET /api/integrations` - List integrations
  - `POST /api/integrations/:platform/connect` - Connect platform
  - `GET /api/integrations/:platform/status` - Connection status
  - `POST /api/integrations/:platform/sync` - Manual sync
  
- **Order Endpoints**:
  - `GET /api/orders` - List orders
  - `GET /api/orders/:id` - Order details
  
- **Report Endpoints**:
  - `GET /api/reports/inventory` - Inventory report
  - `GET /api/reports/sales` - Sales report
  - `GET /api/reports/export/:reportId` - Export report
  
- **Notification Endpoints**:
  - `GET /api/notifications` - Get notifications
  - `PUT /api/notifications/:id/read` - Mark as read
  - `PUT /api/notifications/settings` - Update preferences

## Database Design ERD
- **Users**
  - id (PK)
  - email
  - password_hash
  - name
  - role
  - created_at
  - last_login

- **Products**
  - id (PK)
  - sku
  - name
  - description
  - category_id (FK)
  - created_at
  - updated_at

- **ProductVariants**
  - id (PK)
  - product_id (FK)
  - sku
  - attributes (JSON)
  - created_at
  - updated_at

- **Categories**
  - id (PK)
  - name
  - parent_id (FK, self-referential)

- **Inventory**
  - id (PK)
  - variant_id (FK)
  - quantity
  - low_stock_threshold
  - updated_at

- **InventoryHistory**
  - id (PK)
  - variant_id (FK)
  - quantity_change
  - quantity_after
  - reason
  - user_id (FK)
  - created_at

- **PlatformConnections**
  - id (PK)
  - user_id (FK)
  - platform_type (enum)
  - credentials (encrypted JSON)
  - status
  - last_sync
  - created_at

- **PlatformInventory**
  - id (PK)
  - variant_id (FK)
  - platform_connection_id (FK)
  - external_id
  - quantity
  - last_updated

- **Orders**
  - id (PK)
  - platform_connection_id (FK)
  - external_order_id
  - order_date
  - status
  - total_amount
  - created_at

- **OrderItems**
  - id (PK)
  - order_id (FK)
  - variant_id (FK)
  - quantity
  - price

- **Notifications**
  - id (PK)
  - user_id (FK)
  - type
  - message
  - is_read
  - created_at

- **NotificationPreferences**
  - id (PK)
  - user_id (FK)
  - notification_type
  - email_enabled
  - in_app_enabled