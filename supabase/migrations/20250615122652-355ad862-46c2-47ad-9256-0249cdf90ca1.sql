
-- Insert a test user with email "test@test.com" and password "test"
-- Fixed version without the generated email column

INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  recovery_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'test@test.com',
  crypt('test', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{}',
  NOW(),
  NOW(),
  '',
  '',
  '',
  ''
);

-- Insert corresponding identity record without the generated email column
INSERT INTO auth.identities (
  id,
  user_id,
  provider_id,
  identity_data,
  provider,
  last_sign_in_at,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  (SELECT id FROM auth.users WHERE email = 'test@test.com'),
  (SELECT id FROM auth.users WHERE email = 'test@test.com')::text,
  format('{"sub":"%s","email":"%s"}', (SELECT id FROM auth.users WHERE email = 'test@test.com'), 'test@test.com')::jsonb,
  'email',
  NOW(),
  NOW(),
  NOW()
);
