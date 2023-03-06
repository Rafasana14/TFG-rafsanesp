-- One admin user, named admin1 with passwor 4dm1n and authority admin
INSERT INTO authorities(id,authority) VALUES (1,'ADMIN');
INSERT INTO users(id,username,password,authority) VALUES (1,'admin1','4dm1n',1);
-- Ten owner user, named owner1 with passwor 0wn3r
/*INSERT INTO users(username,password,enabled) VALUES ('owner1','0wn3r',TRUE);
INSERT INTO authorities(id,username,authority) VALUES (2,'owner1','owner');
INSERT INTO users(username,password,enabled) VALUES ('owner2','0wn3r',TRUE);
INSERT INTO authorities(id,username,authority) VALUES (3,'owner2','owner');
INSERT INTO users(username,password,enabled) VALUES ('owner3','0wn3r',TRUE);
INSERT INTO authorities(id,username,authority) VALUES (4,'owner3','owner');
INSERT INTO users(username,password,enabled) VALUES ('owner4','0wn3r',TRUE);
INSERT INTO authorities(id,username,authority) VALUES (5,'owner4','owner');
INSERT INTO users(username,password,enabled) VALUES ('owner5','0wn3r',TRUE);
INSERT INTO authorities(id,username,authority) VALUES (6,'owner5','owner');
INSERT INTO users(username,password,enabled) VALUES ('owner6','0wn3r',TRUE);
INSERT INTO authorities(id,username,authority) VALUES (7,'owner6','owner');
INSERT INTO users(username,password,enabled) VALUES ('owner7','0wn3r',TRUE);
INSERT INTO authorities(id,username,authority) VALUES (8,'owner7','owner');
INSERT INTO users(username,password,enabled) VALUES ('owner8','0wn3r',TRUE);
INSERT INTO authorities(id,username,authority) VALUES (9,'owner8','owner');
INSERT INTO users(username,password,enabled) VALUES ('owner9','0wn3r',TRUE);
INSERT INTO authorities(id,username,authority) VALUES (10,'owner9','owner');
INSERT INTO users(username,password,enabled) VALUES ('owner10','0wn3r',TRUE);
INSERT INTO authorities(id,username,authority) VALUES (11,'owner10','owner');*/
INSERT INTO authorities(id,authority) VALUES (2,'OWNER');
INSERT INTO users(id,username,password,authority) VALUES (2,'owner1','0wn3r',2);
INSERT INTO users(id,username,password,authority) VALUES (3,'owner2','0wn3r',2);
INSERT INTO users(id,username,password,authority) VALUES (4,'owner3','0wn3r',2);
INSERT INTO users(id,username,password,authority) VALUES (5,'owner4','0wn3r',2);
INSERT INTO users(id,username,password,authority) VALUES (6,'owner5','0wn3r',2);
INSERT INTO users(id,username,password,authority) VALUES (7,'owner6','0wn3r',2);
INSERT INTO users(id,username,password,authority) VALUES (8,'owner7','0wn3r',2);
INSERT INTO users(id,username,password,authority) VALUES (9,'owner8','0wn3r',2);
INSERT INTO users(id,username,password,authority) VALUES (10,'owner9','0wn3r',2);
INSERT INTO users(id,username,password,authority) VALUES (11,'owner10','0wn3r',2);
-- One vet user, named vet1 with passwor v3t
/*INSERT INTO users(username,password,enabled) VALUES ('vet1','v3t',TRUE);
INSERT INTO authorities(id,username,authority) VALUES (12,'vet1','veterinarian');*/
INSERT INTO authorities(id,authority) VALUES (3,'VET');
INSERT INTO users(id,username,password,authority) VALUES (12,'vet1','v3t',3);
INSERT INTO users(id,username,password,authority) VALUES (13,'vet2','v3t',3);
INSERT INTO users(id,username,password,authority) VALUES (14,'vet3','v3t',3);
INSERT INTO users(id,username,password,authority) VALUES (15,'vet4','v3t',3);
INSERT INTO users(id,username,password,authority) VALUES (16,'vet5','v3t',3);
INSERT INTO users(id,username,password,authority) VALUES (17,'vet6','v3t',3);

INSERT INTO vets(id, first_name,last_name,city,user) VALUES (1, 'James', 'Carter','Sevilla',12);
INSERT INTO vets(id, first_name,last_name,city,user) VALUES (2, 'Helen', 'Leary','Sevilla',13);
INSERT INTO vets(id, first_name,last_name,city,user) VALUES (3, 'Linda', 'Douglas','Sevilla',14);
INSERT INTO vets(id, first_name,last_name,city,user) VALUES (4, 'Rafael', 'Ortega','Badajoz',15);
INSERT INTO vets(id, first_name,last_name,city,user) VALUES (5, 'Henry', 'Stevens','Badajoz',16);
INSERT INTO vets(id, first_name,last_name,city,user) VALUES (6, 'Sharon', 'Jenkins','Cádiz',17);

INSERT INTO specialties VALUES (1, 'radiology');
INSERT INTO specialties VALUES (2, 'surgery');
INSERT INTO specialties VALUES (3, 'dentistry');

INSERT INTO vet_specialties VALUES (2, 1);
INSERT INTO vet_specialties VALUES (3, 2);
INSERT INTO vet_specialties VALUES (3, 3);
INSERT INTO vet_specialties VALUES (4, 2);
INSERT INTO vet_specialties VALUES (5, 1);

INSERT INTO types VALUES (1, 'cat');
INSERT INTO types VALUES (2, 'dog');
INSERT INTO types VALUES (3, 'lizard');
INSERT INTO types VALUES (4, 'snake');
INSERT INTO types VALUES (5, 'bird');
INSERT INTO types VALUES (6, 'hamster');
INSERT INTO types VALUES (7, 'turtle');

INSERT INTO	owners VALUES (1, 'George', 'Franklin', '110 W. Liberty St.', 'Sevilla', 0, '6085551023', 2);
INSERT INTO owners VALUES (2, 'Betty', 'Davis', '638 Cardinal Ave.', 'Sevilla',0, '6085551749', 3);
INSERT INTO owners VALUES (3, 'Eduardo', 'Rodriquez', '2693 Commerce St.', 'Sevilla',0, '6085558763', 4);
INSERT INTO owners VALUES (4, 'Harold', 'Davis', '563 Friendly St.', 'Sevilla',0, '6085553198', 5);
INSERT INTO owners VALUES (5, 'Peter', 'McTavish', '2387 S. Fair Way', 'Sevilla',0, '6085552765', 6);
INSERT INTO owners VALUES (6, 'Jean', 'Coleman', '105 N. Lake St.', 'Badajoz',0, '6085552654', 7);
INSERT INTO owners VALUES (7, 'Jeff', 'Black', '1450 Oak Blvd.', 'Badajoz',1, '6085555387', 8);
INSERT INTO owners VALUES (8, 'Maria', 'Escobito', '345 Maple St.', 'Badajoz',2, '6085557683', 9);
INSERT INTO owners VALUES (9, 'David', 'Schroeder', '2749 Blackhawk Trail','Cádiz',1, '6085559435', 10);
INSERT INTO owners VALUES (10, 'Carlos', 'Estaban', '2335 Independence La.', 'Cádiz',1, '6085555487', 11);

INSERT INTO pets(id,name,birth_date,type_id,owner_id) VALUES (1, 'Leo', '2010-09-07', 1, 1);
INSERT INTO pets(id,name,birth_date,type_id,owner_id) VALUES (2, 'Basil', '2012-08-06', 6, 2);
INSERT INTO pets(id,name,birth_date,type_id,owner_id) VALUES (3, 'Rosy', '2011-04-17', 2, 3);
INSERT INTO pets(id,name,birth_date,type_id,owner_id) VALUES (4, 'Jewel', '2010-03-07', 2, 3);
INSERT INTO pets(id,name,birth_date,type_id,owner_id) VALUES (5, 'Iggy', '2010-11-30', 3, 4);
INSERT INTO pets(id,name,birth_date,type_id,owner_id) VALUES (6, 'George', '2010-01-20', 4, 5);
INSERT INTO pets(id,name,birth_date,type_id,owner_id) VALUES (7, 'Samantha', '2012-09-04', 1, 6);
INSERT INTO pets(id,name,birth_date,type_id,owner_id) VALUES (8, 'Max', '2012-09-04', 1, 6);
INSERT INTO pets(id,name,birth_date,type_id,owner_id) VALUES (9, 'Lucky', '2011-08-06', 5, 7);
INSERT INTO pets(id,name,birth_date,type_id,owner_id) VALUES (10, 'Mulligan', '2007-02-24', 2, 8);
INSERT INTO pets(id,name,birth_date,type_id,owner_id) VALUES (11, 'Freddy', '2010-03-09', 5, 9);
INSERT INTO pets(id,name,birth_date,type_id,owner_id) VALUES (12, 'Lucky', '2010-06-24', 2, 10);
INSERT INTO pets(id,name,birth_date,type_id,owner_id) VALUES (13, 'Sly', '2012-06-08', 1, 10);

/*INSERT INTO pets(id,name,birth_date,type_id) VALUES (1, 'Leo', '2010-09-07', 1);
INSERT INTO pets(id,name,birth_date,type_id) VALUES (2, 'Basil', '2012-08-06', 6);
INSERT INTO pets(id,name,birth_date,type_id) VALUES (3, 'Rosy', '2011-04-17', 2);
INSERT INTO pets(id,name,birth_date,type_id) VALUES (4, 'Jewel', '2010-03-07', 2);
INSERT INTO pets(id,name,birth_date,type_id) VALUES (5, 'Iggy', '2010-11-30', 3);
INSERT INTO pets(id,name,birth_date,type_id) VALUES (6, 'George', '2010-01-20', 4);
INSERT INTO pets(id,name,birth_date,type_id) VALUES (7, 'Samantha', '2012-09-04', 1);
INSERT INTO pets(id,name,birth_date,type_id) VALUES (8, 'Max', '2012-09-04', 1);
INSERT INTO pets(id,name,birth_date,type_id) VALUES (9, 'Lucky', '2011-08-06', 5);
INSERT INTO pets(id,name,birth_date,type_id) VALUES (10, 'Mulligan', '2007-02-24', 2);
INSERT INTO pets(id,name,birth_date,type_id) VALUES (11, 'Freddy', '2010-03-09', 5);
INSERT INTO pets(id,name,birth_date,type_id) VALUES (12, 'Lucky', '2010-06-24', 2);
INSERT INTO pets(id,name,birth_date,type_id) VALUES (13, 'Sly', '2012-06-08', 1);

INSERT INTO owners_pets(owner_id,pets_id) VALUES (1,1);
INSERT INTO owners_pets(owner_id,pets_id) VALUES (2,2);
INSERT INTO owners_pets(owner_id,pets_id) VALUES (3,3);
INSERT INTO owners_pets(owner_id,pets_id) VALUES (3,4);
INSERT INTO owners_pets(owner_id,pets_id) VALUES (4,5);
INSERT INTO owners_pets(owner_id,pets_id) VALUES (5,6);
INSERT INTO owners_pets(owner_id,pets_id) VALUES (6,7);
INSERT INTO owners_pets(owner_id,pets_id) VALUES (6,8);
INSERT INTO owners_pets(owner_id,pets_id) VALUES (7,9);
INSERT INTO owners_pets(owner_id,pets_id) VALUES (8,10);
INSERT INTO owners_pets(owner_id,pets_id) VALUES (9,11);
INSERT INTO owners_pets(owner_id,pets_id) VALUES (10,12);
INSERT INTO owners_pets(owner_id,pets_id) VALUES (10,13);*/

INSERT INTO visits(id,pet_id,visit_date,description,vet_id) VALUES (1, 7, '2013-01-01', 'rabies shot',4);
INSERT INTO visits(id,pet_id,visit_date,description,vet_id) VALUES (2, 8, '2013-01-02', 'rabies shot',5);
INSERT INTO visits(id,pet_id,visit_date,description,vet_id) VALUES (3, 8, '2013-01-03', 'neutered',5);
INSERT INTO visits(id,pet_id,visit_date,description,vet_id) VALUES (4, 7, '2013-01-04', 'spayed',4);

