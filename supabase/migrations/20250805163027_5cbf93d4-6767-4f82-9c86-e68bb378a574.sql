-- Add trip assignment fields to email_messages table
ALTER TABLE email_messages 
ADD COLUMN booking_id uuid,
ADD COLUMN itinerary_id uuid,
ADD COLUMN trip_reference text;

-- Add indexes for better performance
CREATE INDEX idx_email_messages_booking_id ON email_messages(booking_id);
CREATE INDEX idx_email_messages_itinerary_id ON email_messages(itinerary_id);
CREATE INDEX idx_email_messages_trip_reference ON email_messages(trip_reference);