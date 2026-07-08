import { moduleMiddleware } from "../middlewares/moduleMiddleware";
import { Router } from "express";
import { prisma } from "../lib/prisma";

import { UserController } from "../controllers/userController";
import { AuthController } from "../controllers/authController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { roleMiddleware } from "../middlewares/roleMiddleware";

/* COUPONS */
import { CreateCouponController } from "../controllers/createCouponController";
import { UpdateCouponController } from "../controllers/updateCouponController";
import { FindAllCouponController } from "../controllers/findAllCouponController";
import { FindByIdCouponController } from "../controllers/findByIdCouponController";
import { DeleteCouponController } from "../controllers/deleteCouponController";

/* TICKETS */
import { CreateTicketController } from "../controllers/createTicketController";
import { FindAllTicketController } from "../controllers/findAllTicketController";
import { FindByIdTicketController } from "../controllers/findByIdTicketController";
import { UpdateTicketController } from "../controllers/updateTicketController";
import { DeleteTicketController } from "../controllers/deleteTicketController";
import { CreateTicketSaleController } from "../controllers/createTicketSaleController";

/* CATEGORIES */
import { CreateCategoryController } from "../controllers/createCategoryController";
import { FindAllCategoryController } from "../controllers/findAllCategoryController";
import { UpdateCategoryController } from "../controllers/updateCategoryController";
import { DeleteCategoryController } from "../controllers/deleteCategoryController";

/* BRANDS */
import { CreateBrandController } from "../controllers/createBrandController";
import { FindAllBrandController } from "../controllers/findAllBrandController";
import { FindByIdBrandController } from "../controllers/findByIdBrandController";
import { UpdateBrandController } from "../controllers/updateBrandController";
import { DeleteBrandController } from "../controllers/deleteBrandController";

/* PRODUCTS */
import { CreateProductController } from "../controllers/createProductController";
import { FindAllProductController } from "../controllers/findAllProductController";
import { FindByIdProductController } from "../controllers/findByIdProductController";
import { UpdateProductController } from "../controllers/updateProductController";
import { DeleteProductController } from "../controllers/deleteProductController";

/* RESTAURANT */
import { CreateRestaurantSaleController } from "../controllers/createRestaurantSaleController";

/* KITCHEN */
import { FindKitchenOrdersController } from "../controllers/findKitchenOrdersController";
import { UpdateKitchenStatusController } from "../controllers/updateKitchenStatusController";

/* STOCK */
import { RestockProductController } from "../controllers/restockProductController";
import { FindLowStockProductsController } from "../controllers/findLowStockProductsController";
import { FindOutStockProductsController } from "../controllers/findOutStockProductsController";
import { FindStockHistoryController } from "../controllers/findStockHistoryController";

/* DASHBOARD */
import { DashboardEntryController } from "../controllers/dashboardEntryController";
import { DashboardRestaurantController } from "../controllers/dashboardRestaurantController";

const router = Router();

/* CONTROLLERS */
const userController = new UserController();
const authController = new AuthController();

const createCoupon = new CreateCouponController();
const updateCoupon = new UpdateCouponController();
const findAllCoupon = new FindAllCouponController();
const findByIdCoupon = new FindByIdCouponController();
const deleteCoupon = new DeleteCouponController();

const createTicket = new CreateTicketController();
const findAllTicket = new FindAllTicketController();
const findByIdTicket = new FindByIdTicketController();
const updateTicket = new UpdateTicketController();
const deleteTicket = new DeleteTicketController();
const createTicketSale = new CreateTicketSaleController();

const createCategory = new CreateCategoryController();
const findAllCategory = new FindAllCategoryController();
const updateCategory = new UpdateCategoryController();
const deleteCategory = new DeleteCategoryController();

const createBrand = new CreateBrandController();
const findAllBrand = new FindAllBrandController();
const findByIdBrand = new FindByIdBrandController();
const updateBrand = new UpdateBrandController();
const deleteBrand = new DeleteBrandController();

const createProduct = new CreateProductController();
const findAllProduct = new FindAllProductController();
const findByIdProduct = new FindByIdProductController();
const updateProduct = new UpdateProductController();
const deleteProduct = new DeleteProductController();

const createRestaurantSale = new CreateRestaurantSaleController();

const findKitchen = new FindKitchenOrdersController();
const updateKitchen = new UpdateKitchenStatusController();

const restockProduct = new RestockProductController();
const lowStock = new FindLowStockProductsController();
const outStock = new FindOutStockProductsController();
const stockHistory = new FindStockHistoryController();

const dashboardEntry = new DashboardEntryController();
const dashboardRestaurant = new DashboardRestaurantController();

/* ===========================
   AUTH
=========================== */

router.post(
  "/usuarios",
  authMiddleware,
  roleMiddleware("ADMIN"),
  userController.create
);

router.post("/login", authController.login);

/* GET USER LOGADO */
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await prisma.usuario.findUnique({
      where: { id: req.user?.id },
      include: { role: true }
    });

    if (!user) {
      return res.status(404).json({
        error: "Usuário não encontrado"
      });
    }

    return res.json({
      user: {
        id: String(user.id),
        name: user.nome,
        email: user.email,
        role: user.role.nome,
        module: user.role.modulo
      }
    });
  } catch (error: any) {
    return res.status(500).json({
      error: error.message
    });
  }
});

/* GET ROLES */
router.get("/roles", authMiddleware, roleMiddleware("ADMIN"), async (req, res) => {
  try {
    const roles = await prisma.role.findMany();
    return res.json(roles);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

/* ===========================
   COUPONS (ADMIN)
=========================== */

router.post(
  "/coupons",
  authMiddleware,
  roleMiddleware("ADMIN"),
  createCoupon.handle
);

router.get(
  "/coupons",
  authMiddleware,
  findAllCoupon.handle
);

router.get(
  "/coupons/:id",
  authMiddleware,
  findByIdCoupon.handle
);

router.patch(
  "/coupons/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  updateCoupon.handle
);

router.delete(
  "/coupons/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  deleteCoupon.handle
);

/* ===========================
   TICKETS
=========================== */

router.post(
  "/tickets",
  authMiddleware,
  roleMiddleware("ADMIN"),
  moduleMiddleware("ENTRADA"),
  createTicket.handle
);

router.get(
  "/tickets",
  authMiddleware,
  moduleMiddleware("ENTRADA"),
  findAllTicket.handle
);

router.get(
  "/tickets/:id",
  authMiddleware,
  moduleMiddleware("ENTRADA"),
  findByIdTicket.handle
);

router.patch(
  "/tickets/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  moduleMiddleware("ENTRADA"),
  updateTicket.handle
);

router.delete(
  "/tickets/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  moduleMiddleware("ENTRADA"),
  deleteTicket.handle
);

router.post(
  "/ticket-sales",
  authMiddleware,
  moduleMiddleware("ENTRADA"),
  createTicketSale.handle
);

/* ===========================
   CATEGORIES / BRANDS
=========================== */

router.post(
  "/categories",
  authMiddleware,
  roleMiddleware("ADMIN"),
  createCategory.handle
);

router.get(
  "/categories",
  authMiddleware,
  findAllCategory.handle
);

router.patch(
  "/categories/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  updateCategory.handle
);

router.delete(
  "/categories/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  deleteCategory.handle
);

router.post(
  "/brands",
  authMiddleware,
  roleMiddleware("ADMIN"),
  createBrand.handle
);

router.get(
  "/brands",
  authMiddleware,
  findAllBrand.handle
);

router.get(
  "/brands/:id",
  authMiddleware,
  findByIdBrand.handle
);

router.patch(
  "/brands/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  updateBrand.handle
);

router.delete(
  "/brands/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  deleteBrand.handle
);

/* ===========================
   PRODUCTS
=========================== */

router.post(
  "/products",
  authMiddleware,
  roleMiddleware("ADMIN"),
  moduleMiddleware("LANCHONETE"),
  createProduct.handle
);

router.get(
  "/products",
  authMiddleware,
  moduleMiddleware("LANCHONETE"),
  findAllProduct.handle
);

router.get(
  "/products/low-stock",
  authMiddleware,
  roleMiddleware("ADMIN"),
  moduleMiddleware("LANCHONETE"),
  lowStock.handle
);

router.get(
  "/products/out-stock",
  authMiddleware,
  roleMiddleware("ADMIN"),
  moduleMiddleware("LANCHONETE"),
  outStock.handle
);

router.get(
  "/products/:id",
  authMiddleware,
  moduleMiddleware("LANCHONETE"),
  findByIdProduct.handle
);

router.patch(
  "/products/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  moduleMiddleware("LANCHONETE"),
  updateProduct.handle
);

router.delete(
  "/products/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  moduleMiddleware("LANCHONETE"),
  deleteProduct.handle
);

/* ESTOQUE */

router.post(
  "/products/:id/restock",
  authMiddleware,
  roleMiddleware("ADMIN"),
  moduleMiddleware("LANCHONETE"),
  restockProduct.handle
);

router.get(
  "/stock/history",
  authMiddleware,
  roleMiddleware("ADMIN"),
  moduleMiddleware("LANCHONETE"),
  stockHistory.handle
);

/* ===========================
   RESTAURANT SALES
=========================== */

router.post(
  "/restaurant-sales",
  authMiddleware,
  moduleMiddleware("LANCHONETE"),
  createRestaurantSale.handle
);

/* ===========================
   KITCHEN
=========================== */

router.get(
  "/kitchen/orders",
  authMiddleware,
  moduleMiddleware("LANCHONETE"),
  findKitchen.handle
);

router.patch(
  "/kitchen/orders/:id/status",
  authMiddleware,
  moduleMiddleware("LANCHONETE"),
  updateKitchen.handle
);

/* ===========================
   DASHBOARD (ADMIN)
=========================== */

router.get(
  "/dashboard/entrada",
  authMiddleware,
  roleMiddleware("ADMIN"),
  moduleMiddleware("ENTRADA"),
  dashboardEntry.handle
);

router.get(
  "/dashboard/restaurant",
  authMiddleware,
  roleMiddleware("ADMIN"),
  moduleMiddleware("LANCHONETE"),
  dashboardRestaurant.handle
);

export default router;