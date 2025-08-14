import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import driverRoutes from "./Routers/driversRouters.js";
import orderRoutes from "./Routers/ordersRouters.js";
import routeRoutes from "./Routers/routerRouters.js";
import authRoutes from "./Routers/authRouters.js";
import connect_DB from "./config/db.js";
import cookieParser from "cookie-parser";
import simulationRouter from "./Routers/simulateRouters.js";

dotenv.config();

const app = express();
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174","https://green-cart-logistics-frontend-xzql-x9kgvq8k7.vercel.app"],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

connect_DB();

app.use("/api/drivers", driverRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/routes", routeRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/simulation", simulationRouter);

const PORT = process.env.PORT || 7000;

app.listen(PORT, () => {
  console.log(`server is running ${PORT}`);
});
