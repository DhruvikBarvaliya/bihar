const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const config = require("./config/config");
const logger = require("./middlewares/logger");
const indexRouter = require("./routes/index");
const swaggerSetup = require("./config/swagger");
const { sequelize, User } = require("./config/sequelize");

const app = express();
app.use(express.json());
app.use(cors());

const { port, env } = config;

// Swagger setup
swaggerSetup(app);

app.get("/", function (req, res) {
  const { protocol, hostname, originalUrl } = req;
  const port = process.env.PORT;
  const fullUrl =
    env === "development"
      ? `${protocol}://${hostname}:${port}${originalUrl}`
      : `${protocol}://${hostname}:${originalUrl}`;
  const message = `Welcome To ${env} Mode Of Bihar Management System`;
  const swaggerUrl = `${fullUrl}api-docs`;
  logger.info({ Message: message, Swagger: swaggerUrl });
  res.json({ Message: message, Swagger: swaggerUrl });
});

app.use("/api", indexRouter);

const createDefaultUser = async (userData) => {
  const salt = await bcrypt.genSalt(10);
  const password = await bcrypt.hash(userData.password, salt);
  try {
    await User.create({
      ...userData,
      password: password,
    });
    setTimeout(function () {
      logger.info(
        `>>> ROLE:- ${userData.role}, EMAIL:-${userData.email}, PASSWORD:-${userData.password} created successfully. <<<`
      );
    }, 2000);
  } catch (error) {
    logger.error("Failed to create a new record: ", error);
  }
};

sequelize
  .sync({ force: false, alter: true })
  .then(async () => {
    logger.info("Drop and re-sync db.");
    const superAdmin = {
      username: "superadmin",
      password: "superadmin",
      email: "superadmin@gmail.com",
      role: "SUPER_ADMIN",
      is_verified: true,
    };

    const superAdminUser = await User.findOne({
      where: {
        email: superAdmin.email,
      },
    });

    if (!superAdminUser) {
      await createDefaultUser(superAdmin);
    }

    const admin = {
      username: "admin",
      password: "admin",
      email: "admin@gmail.com",
      role: "ADMIN",
      is_verified: true,
    };

    const adminUser = await User.findOne({
      where: {
        email: admin.email,
      },
    });

    if (!adminUser) {
      await createDefaultUser(admin);
    }
  })
  .catch((error) => {
    logger.error("Unable to create table: ", error);
  });

const serverUrl =
  env === "production"
    ? `https://bihar-diop.onrender.com`
    : `http://localhost:${port}`;

app.listen(
  port,
  logger.info(
    `Server is Running on ${serverUrl} and Swagger is Running on ${serverUrl}/api-docs/`
  )
);
