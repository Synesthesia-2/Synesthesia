CREATE DATABASE kinetech;

USE kineTech;

CREATE TABLE cast (id int(11) NOT NULL auto_increment, name varchar(255), portrait varchar(255), role varchar(255), bio text, PRIMARY KEY(id));

CREATE TABLE shows (id int(11) NOT NULL auto_increment, link varchar(255), title varchar(255), description text, location varchar(255), showdate varchar(255), PRIMARY KEY(id));

CREATE TABLE cast_shows (id int(11) NOT NULL auto_increment, cast_id int(11), show_id int(11), PRIMARY KEY(id));

/*  Execute this file from the command line by typing:
 *    mysql -uroot < schema.sql
 *  to create the database and the tables.*/
