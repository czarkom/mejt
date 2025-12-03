-- Create the logs table for boat trip entries
-- Run this SQL in your Supabase SQL editor

CREATE TABLE logs (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  date DATE NOT NULL,
  location VARCHAR(255),
  weather VARCHAR(255)
);

-- Create the inventory table for boat supplies
CREATE TABLE inventory (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  name VARCHAR(255) NOT NULL,
  quantity DECIMAL(10,2) NOT NULL DEFAULT 0,
  unit VARCHAR(50) NOT NULL,
  category VARCHAR(100),
  notes TEXT,
  to_buy BOOLEAN DEFAULT FALSE
);

-- Create the bookings table for boat reservations
CREATE TABLE bookings (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  person VARCHAR(50) NOT NULL CHECK (person IN ('Mama', 'Tata', 'Matiz', 'Mroziak', 'Pela')),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  comment TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'pending', 'cancelled')),
  CONSTRAINT valid_date_range CHECK (end_date >= start_date)
);

-- Enable Row Level Security (RLS) on all tables
ALTER TABLE logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Create policies that allow all operations for now
-- You can make these more restrictive later based on your authentication needs
CREATE POLICY "Allow all operations on logs" ON logs
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on inventory" ON inventory
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on bookings" ON bookings
  FOR ALL USING (true) WITH CHECK (true);

-- Create indexes for better query performance
CREATE INDEX idx_logs_date ON logs(date DESC);
CREATE INDEX idx_inventory_name ON inventory(name);
CREATE INDEX idx_inventory_category ON inventory(category);
CREATE INDEX idx_inventory_to_buy ON inventory(to_buy);
CREATE INDEX idx_bookings_date_range ON bookings(start_date, end_date);
CREATE INDEX idx_bookings_person ON bookings(person);
CREATE INDEX idx_bookings_status ON bookings(status);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to auto-update updated_at on inventory changes
CREATE TRIGGER update_inventory_updated_at BEFORE UPDATE ON inventory
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();