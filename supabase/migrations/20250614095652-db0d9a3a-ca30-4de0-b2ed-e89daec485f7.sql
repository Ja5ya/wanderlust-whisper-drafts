
ALTER TABLE public.customers
ADD COLUMN number_of_people INTEGER NULL,
ADD COLUMN traveler_details JSONB NULL,
ADD COLUMN notes_id UUID NULL,
ADD COLUMN guide_id UUID NULL,
ADD COLUMN start_date DATE NULL,
ADD COLUMN end_date DATE NULL,
ADD COLUMN nationality TEXT NULL;

-- Add a comment to the traveler_details column for clarity on its expected structure
COMMENT ON COLUMN public.customers.traveler_details IS 'JSONB array to store traveler details, e.g., [{"name": "Jane Doe", "passport": "P12345"}, {"name": "Child Doe", "passport": "C67890"}]';
