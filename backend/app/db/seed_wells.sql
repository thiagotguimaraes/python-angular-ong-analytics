-- Create the wells table if it doesn't exist
CREATE TABLE IF NOT EXISTS wells (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL
);

-- Check if the wells table is empty and insert data if it is
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM wells LIMIT 1) THEN
        INSERT INTO wells (name, latitude, longitude) VALUES
            ('Well 1', 24.466667, 54.366669), -- Abu Dhabi
            ('Well 2', 25.276987, 55.296249), -- Dubai
            ('Well 3', 25.405216, 55.513643); -- Sharjah
    END IF;
END$$;