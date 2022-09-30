
CREATE TABLE parqueadero (
                idparqueadero BIGINT AUTO_INCREMENT NOT NULL,
                nombre VARCHAR(255) NOT NULL,
                cantidad_maxima INT NOT NULL,
                estado TINYINT NOT NULL,
                PRIMARY KEY (idparqueadero)
);

CREATE TABLE rol (
                idrol BIGINT AUTO_INCREMENT NOT NULL,
                nombre ENUM('ADMIN','SOCIO','CLIENTE') NOT NULL, 
                estado TINYINT NOT NULL,
                PRIMARY KEY (idrol)
);

INSERT INTO `rol` (`idrol`, `nombre`, `estado`) VALUES
(1, 'ADMIN', 1),
(2, 'SOCIO', 1),
(3, 'CLIENTE', 1);

CREATE TABLE usuario (
                idusuario BIGINT AUTO_INCREMENT NOT NULL,
                nombre VARCHAR(255) NOT NULL,
                apellido VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL,
                clave VARCHAR(255) NOT NULL,
                estado TINYINT NOT NULL,
                clave_email VARCHAR(255),
                idrol BIGINT NOT NULL,
                PRIMARY KEY (idusuario)
);

INSERT INTO `usuario` (`idusuario`, `nombre`, `apellido`, `email`, `clave`, `estado`, `clave_email`, `idrol`) VALUES
(1, 'Administrador', 'Administrador', 'admin@mail.com', 'admin', 1, 'admin', 1);



CREATE TABLE vehiculo (
                idvehiculo BIGINT AUTO_INCREMENT NOT NULL,
                placa VARCHAR(6) NOT NULL,
                modelo INT NOT NULL,
                propietario BIGINT NOT NULL,
                PRIMARY KEY (idvehiculo)
);


CREATE TABLE vehiculo_parqueadero (
                idvehiculo_parqueadero BIGINT AUTO_INCREMENT NOT NULL,
                idparqueadero BIGINT NOT NULL,
                idvehiculo BIGINT NOT NULL,
                fecha_ingreso DATETIME NOT NULL,
                fecha_salida DATETIME,
                PRIMARY KEY (idvehiculo_parqueadero)
);


CREATE TABLE parqueadero_socio (
                idparqueadero_socio BIGINT AUTO_INCREMENT NOT NULL,
                idparqueadero BIGINT NOT NULL,
                idusuariosocio BIGINT NOT NULL,
                estado TINYINT NOT NULL,
                PRIMARY KEY (idparqueadero_socio)
);


CREATE TABLE cliente_socio_parqueadero (
                idcliente_socio_parqueadero BIGINT AUTO_INCREMENT NOT NULL,
                idusuariocliente BIGINT NOT NULL,
                idparqueadero_socio BIGINT NOT NULL,
                estado TINYINT NOT NULL,
                PRIMARY KEY (idcliente_socio_parqueadero)
);

ALTER TABLE `usuario`
  ADD UNIQUE KEY `email` (`email`);

ALTER TABLE `vehiculo`
  ADD UNIQUE KEY `placa` (`placa`);

ALTER TABLE parqueadero_socio ADD CONSTRAINT parqueadero_parqueadero_socio_fk
FOREIGN KEY (idparqueadero)
REFERENCES parqueadero (idparqueadero)
ON DELETE NO ACTION
ON UPDATE NO ACTION;

ALTER TABLE vehiculo_parqueadero ADD CONSTRAINT parqueadero_vehiculo_parqueadero_fk
FOREIGN KEY (idparqueadero)
REFERENCES parqueadero (idparqueadero)
ON DELETE NO ACTION
ON UPDATE NO ACTION;

ALTER TABLE usuario ADD CONSTRAINT rol_usuario_fk
FOREIGN KEY (idrol)
REFERENCES rol (idrol)
ON DELETE NO ACTION
ON UPDATE NO ACTION;

ALTER TABLE parqueadero_socio ADD CONSTRAINT usuario_parqueadero_socio_fk
FOREIGN KEY (idusuariosocio)
REFERENCES usuario (idusuario)
ON DELETE NO ACTION
ON UPDATE NO ACTION;

ALTER TABLE vehiculo ADD CONSTRAINT usuario_vehiculo_fk
FOREIGN KEY (propietario)
REFERENCES usuario (idusuario)
ON DELETE NO ACTION
ON UPDATE NO ACTION;

ALTER TABLE cliente_socio_parqueadero ADD CONSTRAINT usuario_cliente_socio_parqueadero_fk
FOREIGN KEY (idusuariocliente)
REFERENCES usuario (idusuario)
ON DELETE NO ACTION
ON UPDATE NO ACTION;

ALTER TABLE vehiculo_parqueadero ADD CONSTRAINT vehiculo_vehiculo_parqueadero_fk
FOREIGN KEY (idvehiculo)
REFERENCES vehiculo (idvehiculo)
ON DELETE NO ACTION
ON UPDATE NO ACTION;

ALTER TABLE cliente_socio_parqueadero ADD CONSTRAINT parqueadero_socio_cliente_socio_parqueadero_fk
FOREIGN KEY (idparqueadero_socio)
REFERENCES parqueadero_socio (idparqueadero_socio)
ON DELETE NO ACTION
ON UPDATE NO ACTION;
