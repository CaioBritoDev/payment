CREATE DATABASE payments;

CREATE TABLE management(
    payment_id SERIAL PRIMARY KEY,
    _id VARCHAR(36),
    payment_status VARCHAR(20),
    month INTEGER,
    year INTEGER
);