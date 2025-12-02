-- Fix routes to be created by Michael (admin, user_id = 1)
-- These are the 15 routes we just added

-- First, let's see what route IDs we're working with
-- SELECT id, name, created_by FROM routes ORDER BY id DESC LIMIT 15;

-- Update the last 15 routes to be created by Michael (user_id = 1)
-- Adjust the ID range based on your actual route IDs
-- If your routes start at ID 16, this will update routes 16-30

UPDATE routes 
SET created_by = 1 
WHERE name IN (
    'Waterfront Trail',
    'Bayfront Park Loop',
    'Dundurn Castle Grounds',
    'Confederation Beach Park',
    'Princess Point Loop',
    'McMaster Campus Loop',
    'Chedoke Radial Trail',
    'Red Hill Valley Trail',
    'Escarpment Rail Trail',
    'Bruce Trail - Dundas Peak',
    'Devil\'s Punchbowl Trail',
    'Chedoke Stairs Challenge',
    'Confederation to Burlington Pier',
    'Albion Falls Loop',
    'Sam Lawrence Park to Concession Street'
);

-- Verify the update
SELECT id, name, created_by, is_public FROM routes WHERE created_by = 1 ORDER BY id;
