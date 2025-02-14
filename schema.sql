CREATE DATABASE IF NOT EXISTS prueba_tecnica;
USE prueba_tecnica;

CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE empresas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    nit VARCHAR(20) UNIQUE NOT NULL
);

CREATE TABLE puntos_venta (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    direccion VARCHAR(255) NOT NULL
);

CREATE TABLE usuarios_empresas (
    usuario_id INT,
    empresa_id INT,
    rol VARCHAR(50) NOT NULL,
    PRIMARY KEY (usuario_id, empresa_id),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    FOREIGN KEY (empresa_id) REFERENCES empresas(id)
);

CREATE TABLE empresas_puntos_venta (
    empresa_id INT,
    punto_venta_id INT,
    PRIMARY KEY (empresa_id, punto_venta_id),
    FOREIGN KEY (empresa_id) REFERENCES empresas(id),
    FOREIGN KEY (punto_venta_id) REFERENCES puntos_venta(id)
);