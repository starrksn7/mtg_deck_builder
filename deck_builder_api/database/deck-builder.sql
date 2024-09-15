DROP TABLE IF EXISTS users, decks, cards, deck_cards, users_decks CASCADE;

DROP SEQUENCE IF EXISTS seq_user_id, seq_deck_id, seq_card_id CASCADE;

CREATE SEQUENCE seq_user_id
	INCREMENT BY 1
	START WITH 1
	NO MAXVALUE;

CREATE SEQUENCE seq_deck_id
	INCREMENT BY 1
	START WITH 1
	NO MAXVALUE;
		
CREATE TABLE users (
	user_id int NOT NULL DEFAULT nextval('seq_user_id'),
	username varchar(50) NOT NULL,
	password_hash varchar(200) NOT NULL,
	email varchar (200) NOT NULL,
	activated boolean NOT NULL,
	CONSTRAINT PK_user PRIMARY KEY (user_id),
	CONSTRAINT UQ_username UNIQUE (username)
);

CREATE TABLE decks (
	deck_id int NOT NULL DEFAULT nextval('seq_deck_id'),
	deck_name varchar(200) NOT NULL,
	commander varchar(50) NOT NULL,
	CONSTRAINT PK_decks PRIMARY KEY (deck_id)
);

CREATE TABLE cards (
	card_id int NOT NULL,
	card_name varchar(50) NOT NULL,
	scryfall_link varchar(100) NOT NULL,
	image_link varchar(100) NOT NULL,
	mana_cost varchar(20),
	card_type varchar(30),
	oracle_text varchar(200),
	colors varchar(15),
	color_identity varchar(15),
	keywords varchar(100),
	CONSTRAINT PK_cards PRIMARY KEY (card_id)
);

CREATE TABLE deck_cards (
	deck_id int NOT NULL,
	card_id int NOT NULL,
	CONSTRAINT FK_deck_cards_decks FOREIGN KEY (deck_id) REFERENCES decks (deck_id),
	CONSTRAINT FK_deck_cards_card FOREIGN KEY (card_id) REFERENCES cards (card_id)
);

CREATE TABLE users_decks (
	deck_id int NOT NULL,
	user_id int NOT NULL,
	CONSTRAINT FK_users_decks_users FOREIGN KEY (user_id) REFERENCES users (user_id),
	CONSTRAINT FK_users_decks_decks FOREIGN KEY (deck_id) REFERENCES decks (deck_id)											
);