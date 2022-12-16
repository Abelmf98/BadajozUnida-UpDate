INSERT INTO Categoria (nombre, descripcion)
VALUES ('deporte', 'acividades deportivas'),
('gastronomicos', 'relacionados con la gastronomia'),
('desarrollo web', 'relacionados con el desarrollo web')
;

INSERT INTO Subcategoria (nombre, descripcion, idCategoria)
VALUES ('fútbol', 'partido de fútbol',1),
('baloncesto', 'partido de fútbol',1),
('tenis', 'partido de tenis',1),
('comidas caseras', 'realizar comidas caseras',2),
('comidas francesas', 'realizar comidas típicas de Francia',2),
('front', 'curso basico de la parte front',3),
('back', 'curso basico de la parte back',3)
;

-- Administrador8*
-- Miguel1234)
INSERT INTO Usuario (nombre, apellidos, email, password, fechaNacimiento,tipo)
VALUES ('Administrador', 'rrrr','administrador@gmail.com','8ee59c44faf8bba1717f0ae5ba4a42bf','1997-06-26', 'a'),
 ('Miguel', 'Jaque Barbero','migueljb@gmail.com','097303547162c2876947dc4d191bb775','1968-01-01', 'u');


INSERT INTO Ubicacion (nombre, direccion)
VALUES ('La granadilla', 'calle Augusto Vázquez'),
('La granja del cruce', 'Corte de Pelea');


INSERT INTO Evento (titulo, imagen, descripcion, fechaHora, idUbicacion,idUsuario, idSubcategoria)
VALUES ('Graduacion', 'asqwertyifgshdfghghj','Graduacion de 2daw','2022-06-22 20:00','1', '1','1'),
       ('Graduacion', 'asqwertyifgshdfghghj','Graduacion de 2daw','2022-06-22 20:00','2', '1','2');

INSERT INTO Participante (idUsuario, idEvento)
VALUES ('1', '1'),
       ('1', '2');
