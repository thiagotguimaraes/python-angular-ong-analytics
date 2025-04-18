-- Enable TimescaleDB extension
CREATE EXTENSION IF NOT EXISTS timescaledb;

-- Create tables
CREATE TABLE IF NOT EXISTS well_1 (
    timestamp TIMESTAMPTZ NOT NULL,
    oil_rate DOUBLE PRECISION,
    pressure DOUBLE PRECISION,
    temperature DOUBLE PRECISION
);

CREATE TABLE IF NOT EXISTS well_2 (
    timestamp TIMESTAMPTZ NOT NULL,
    oil_rate DOUBLE PRECISION,
    pressure DOUBLE PRECISION,
    temperature DOUBLE PRECISION
);

CREATE TABLE IF NOT EXISTS well_3 (
    timestamp TIMESTAMPTZ NOT NULL,
    oil_rate DOUBLE PRECISION,
    pressure DOUBLE PRECISION,
    temperature DOUBLE PRECISION
);

-- Convert to hypertables
SELECT create_hypertable('well_1', 'timestamp', if_not_exists => TRUE);
SELECT create_hypertable('well_2', 'timestamp', if_not_exists => TRUE);
SELECT create_hypertable('well_3', 'timestamp', if_not_exists => TRUE);

-- Insert dummy data
DO $$
DECLARE
    ts TIMESTAMPTZ;
BEGIN
    FOR ts IN 
        SELECT generate_series(
            TO_TIMESTAMP(1735689600000 / 1000), -- Convert milliseconds to seconds
            TO_TIMESTAMP(1743465600000 / 1000), -- Convert milliseconds to seconds
            INTERVAL '1 day'
        )
    LOOP
        INSERT INTO well_1 (timestamp, oil_rate, pressure, temperature) 
        VALUES (ts, 100 + random() * 20, 2500 + random() * 100, 60 + random() * 5);
        
        INSERT INTO well_2 (timestamp, oil_rate, pressure, temperature) 
        VALUES (ts, 80 + random() * 15, 2400 + random() * 80, 58 + random() * 4);
        
        INSERT INTO well_3 (timestamp, oil_rate, pressure, temperature) 
        VALUES (ts, 90 + random() * 10, 2450 + random() * 120, 59 + random() * 3);
    END LOOP;
END$$;