import express from "express";
import mysql from "mysql2/promise";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import createError from "http-errors";
import cookieParser from "cookie-parser";
import logger from "morgan";
import { Server } from "socket.io";
import { createServer } from "http";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuración de la conexión a la base de datos
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "123456",
  database: "prueba_tecnica",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

const app = express();

// view engine setup
app.set("views", join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(join(__dirname, "public")));

const httpServer = createServer(app);
const io = new Server(httpServer);

io.on("connection", (socket) => {
  console.log("Cliente conectado");
});

// Rutas
app.get("/", async (req, res) => {
  try {
    const [usuarios] = await pool.query("SELECT * FROM usuarios");
    const [empresas] = await pool.query("SELECT * FROM empresas");
    const [puntosVenta] = await pool.query("SELECT * FROM puntos_venta");
    res.render("index", { usuarios, empresas, puntosVenta });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al obtener los datos");
  }
});

// Rutas para Usuarios
app.post("/usuarios", async (req, res) => {
  try {
    const { nombre, email } = req.body;
    
    // Verificar si existe un usuario con el mismo nombre
    const [existingUsers] = await pool.query(
      "SELECT * FROM usuarios WHERE LOWER(nombre) = LOWER(?)",
      [nombre]
    );
    
    if (existingUsers.length > 0) {
      return res.status(400).json({ 
        error: "Ya existe un usuario con este nombre" 
      });
    }

    // Verificar si existe un usuario con el mismo email
    const [existingEmails] = await pool.query(
      "SELECT * FROM usuarios WHERE email = ?",
      [email]
    );
    
    if (existingEmails.length > 0) {
      return res.status(400).json({ 
        error: "Ya existe un usuario con este email" 
      });
    }

    const [result] = await pool.query(
      "INSERT INTO usuarios (nombre, email) VALUES (?, ?)",
      [nombre, email]
    );
    const nuevoUsuario = { id: result.insertId, nombre, email };
    io.emit("nuevoUsuario", nuevoUsuario);
    res.status(201).json(nuevoUsuario);
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      error: "Error al crear el usuario" 
    });
  }
});

// Rutas para Empresas
app.post("/empresas", async (req, res) => {
  try {
    const { nombre, nit } = req.body;
    
    // Verificar si existe una empresa con el mismo nombre
    const [existingCompanies] = await pool.query(
      "SELECT * FROM empresas WHERE LOWER(nombre) = LOWER(?)",
      [nombre]
    );
    
    if (existingCompanies.length > 0) {
      return res.status(400).json({ 
        error: "Ya existe una empresa con este nombre" 
      });
    }

    // Verificar si existe una empresa con el mismo NIT
    const [existingNits] = await pool.query(
      "SELECT * FROM empresas WHERE nit = ?",
      [nit]
    );
    
    if (existingNits.length > 0) {
      return res.status(400).json({ 
        error: "Ya existe una empresa con este NIT" 
      });
    }

    const [result] = await pool.query(
      "INSERT INTO empresas (nombre, nit) VALUES (?, ?)",
      [nombre, nit]
    );
    const nuevaEmpresa = { id: result.insertId, nombre, nit };
    io.emit("nuevaEmpresa", nuevaEmpresa);
    res.status(201).json(nuevaEmpresa);
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      error: "Error al crear la empresa" 
    });
  }
});

// Rutas para Puntos de Venta
app.post("/puntos-venta", async (req, res) => {
  try {
    const { nombre, direccion } = req.body;
    
    // Verificar si existe un punto de venta con el mismo nombre
    const [existingPoints] = await pool.query(
      "SELECT * FROM puntos_venta WHERE LOWER(nombre) = LOWER(?)",
      [nombre]
    );
    
    if (existingPoints.length > 0) {
      return res.status(400).json({ 
        error: "Ya existe un punto de venta con este nombre" 
      });
    }

    const [result] = await pool.query(
      "INSERT INTO puntos_venta (nombre, direccion) VALUES (?, ?)",
      [nombre, direccion]
    );
    const nuevoPunto = { id: result.insertId, nombre, direccion };
    io.emit("nuevoPuntoVenta", nuevoPunto);
    res.status(201).json(nuevoPunto);
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      error: "Error al crear el punto de venta" 
    });
  }
});

// Ruta para asociar un usuario a una empresa con un rol
app.post("/usuarios-empresas", async (req, res) => {
  try {
    const { usuario_id, empresa_id, rol } = req.body;
    await pool.query(
      "INSERT INTO usuarios_empresas (usuario_id, empresa_id, rol) VALUES (?, ?, ?)",
      [usuario_id, empresa_id, rol]
    );
    res.status(201).json({ mensaje: "Asociación creada exitosamente" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al crear la asociación usuario-empresa");
  }
});

// Ruta para asociar una empresa a un punto de venta
app.post("/empresas-puntos-venta", async (req, res) => {
  try {
    const { empresa_id, punto_venta_id } = req.body;
    await pool.query(
      "INSERT INTO empresas_puntos_venta (empresa_id, punto_venta_id) VALUES (?, ?)",
      [empresa_id, punto_venta_id]
    );
    res.status(201).json({ mensaje: "Asociación creada exitosamente" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al crear la asociación empresa-punto de venta");
  }
});

// Ruta para obtener usuarios por empresa
app.get("/empresas/:id/usuarios", async (req, res) => {
  try {
    const [usuarios] = await pool.query(
      `SELECT u.*, ue.rol 
       FROM usuarios u 
       JOIN usuarios_empresas ue ON u.id = ue.usuario_id 
       WHERE ue.empresa_id = ?`,
      [req.params.id]
    );
    res.json(usuarios);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al obtener los usuarios de la empresa");
  }
});

// Ruta para obtener puntos de venta por empresa
app.get("/empresas/:id/puntos-venta", async (req, res) => {
  try {
    const [puntosVenta] = await pool.query(
      `SELECT pv.* 
       FROM puntos_venta pv 
       JOIN empresas_puntos_venta epv ON pv.id = epv.punto_venta_id 
       WHERE epv.empresa_id = ?`,
      [req.params.id]
    );
    res.json(puntosVenta);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al obtener los puntos de venta de la empresa");
  }
});

// Ruta para obtener detalles de empresa con usuarios y puntos de venta
app.get("/empresas/:id/detalles", async (req, res) => {
  try {
    const [[empresa]] = await pool.query(
      "SELECT * FROM empresas WHERE id = ?",
      [req.params.id]
    );
    
    const [usuarios] = await pool.query(
      `SELECT u.*, ue.rol 
       FROM usuarios u 
       JOIN usuarios_empresas ue ON u.id = ue.usuario_id 
       WHERE ue.empresa_id = ?`,
      [req.params.id]
    );
    
    const [puntosVenta] = await pool.query(
      `SELECT pv.* 
       FROM puntos_venta pv 
       JOIN empresas_puntos_venta epv ON pv.id = epv.punto_venta_id 
       WHERE epv.empresa_id = ?`,
      [req.params.id]
    );
    
    res.json({
      empresa,
      usuarios,
      puntosVenta
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al obtener los detalles de la empresa");
  }
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

export { httpServer };
export default app;
