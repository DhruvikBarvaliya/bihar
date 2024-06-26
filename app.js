const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const config = require("./config/config");
const logger = require("./middlewares/logger");
const indexRouter = require("./routes/index");
const swaggerSetup = require("./config/swagger");
const { sequelize, User, Store } = require("./config/sequelize");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(express.json());
app.use(cors());

const { port, env } = config;

// Define the log directory and log file
const logDir = path.join(__dirname, "logs"); // Adjust the path as needed
const combinedlogFile = path.join(logDir, "combined.log");
const errorlogFile = path.join(logDir, "error.log");
console.log("Log Directory:", logDir);

// Function to delete the log file
const deleteLogFile = () => {
  [combinedlogFile, errorlogFile].forEach((file) => {
    if (fs.existsSync(file)) {
      fs.unlinkSync(file);
      console.log("Old log file deleted. file: ", file);
    }
  });
};

// Call the function before starting the server
deleteLogFile();

// Swagger setup
swaggerSetup(app);

app.get("/", function (req, res) {
  const { protocol, hostname, originalUrl } = req;
  const port = process.env.PORT;
  const fullUrl =
    env === "development"
      ? `${protocol}://${hostname}:${port}${originalUrl}`
      : `${protocol}://${hostname}${originalUrl}`;
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
    let storeData;
    const store = {
      name: "Zero",
      code: "0",
      location: "Delhi",
      description: "Capital Of India",
    };

    const storeZero = await Store.findOne({
      where: {
        name: store.name,
      },
    });

    if (!storeZero) {
      storeData = await Store.create(store);
      const store_data_id = storeData.dataValues.id;

      const superAdmin = {
        username: "superadmin",
        password: "superadmin",
        email: "superadmin@gmail.com",
        role: "Super Admin",
        is_active: true,
        is_verified: true,
        store_id: store_data_id, // Store foreign key field
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
        role: "Admin",
        is_active: true,
        is_verified: true,
        store_id: store_data_id, // Store foreign key field
      };

      const adminUser = await User.findOne({
        where: {
          email: admin.email,
        },
      });

      if (!adminUser) {
        await createDefaultUser(admin);
      }
    }
  })
  .catch((error) => {
    logger.error("Unable to create table: ", error);
  });

const serverUrl =
  env === "production"
    ? `https://bihar-diop.onrender.com`
    : `http://localhost:${port}`;

app.listen(port, () =>
  logger.info(
    `Server is Running on ${serverUrl} and Swagger is Running on ${serverUrl}/api-docs/`
  )
);
