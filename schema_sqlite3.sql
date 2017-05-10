CREATE TABLE articles(id_article INTEGER PRIMARY KEY ASC, id_author INTEGER, art_signature TEXT, art_datetime TEXT, art_lang TEXT, art_writing BLOB);
CREATE INDEX articles_author ON articles(id_author);
CREATE INDEX articles_signature ON articles(art_signature);
CREATE INDEX articles_datetime ON articles(art_datetime);
CREATE INDEX articles_lang ON articles(art_lang);

CREATE TABLE authors(id_author INTEGER PRIMARY KEY ASC, ath_name TEXT, ath_pubkey TEXT);
CREATE INDEX authors_name ON authors(ath_name);
CREATE INDEX authors_pubkey ON authors(ath_pubkey);

CREATE TABLE arttags(id_article INTEGER, art_tag TEXT);
CREATE INDEX arttags_tag ON arttags(art_tag);
