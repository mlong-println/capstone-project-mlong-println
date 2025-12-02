-- Hamilton Running Routes Setup
-- Run this SQL directly in your database client (phpMyAdmin, TablePlus, etc.)
-- Or use: mysql -u your_user -p your_database < routes_only.sql

-- Clear existing routes (OPTIONAL - uncomment if you want to start fresh)
-- DELETE FROM routes;
-- ALTER TABLE routes AUTO_INCREMENT = 1;

-- Insert routes (using user_id = 2 for Sarah)
-- If Sarah has a different ID, change the created_by value

INSERT INTO routes (name, description, distance, difficulty, is_public, created_by, created_at) VALUES
('Waterfront Trail', 'Scenic lakefront path along Hamilton Harbour with beautiful water views', 5.0, 'easy', 1, 2, NOW()),
('Bayfront Park Loop', 'Flat, paved loop around Bayfront Park with harbor views', 3.0, 'easy', 1, 2, NOW()),
('Dundurn Castle Grounds', 'Historic route through Dundurn Castle grounds and surrounding park', 2.0, 'easy', 1, 2, NOW()),
('Confederation Beach Park', 'Beachfront path with playground and picnic areas', 4.0, 'easy', 1, 2, NOW()),
('Princess Point Loop', 'Nature trail through Cootes Paradise with wildlife viewing', 6.0, 'moderate', 1, 2, NOW()),
('McMaster Campus Loop', 'Campus route with some hills through university grounds', 5.0, 'moderate', 1, 2, NOW()),
('Chedoke Radial Trail', 'Historic rail trail with moderate elevation changes', 7.0, 'moderate', 1, 2, NOW()),
('Red Hill Valley Trail', 'Paved trail through valley with creek crossings', 8.0, 'moderate', 1, 2, NOW()),
('Escarpment Rail Trail', 'Long rail trail along the base of the escarpment', 10.0, 'moderate', 1, 2, NOW()),
('Bruce Trail - Dundas Peak', 'Challenging trail with steep climbs to scenic overlook', 8.0, 'hard', 1, 2, NOW()),
('Devil\'s Punchbowl Trail', 'Steep escarpment trail to waterfall viewpoint', 6.0, 'hard', 1, 2, NOW()),
('Chedoke Stairs Challenge', 'Intense workout route featuring the famous Chedoke stairs', 4.0, 'hard', 1, 2, NOW()),
('Confederation to Burlington Pier', 'Long lakefront route connecting Hamilton to Burlington', 12.0, 'moderate', 1, 2, NOW()),
('Albion Falls Loop', 'Challenging trail with waterfall views and steep sections', 7.0, 'hard', 1, 2, NOW()),
('Sam Lawrence Park to Concession Street', 'Urban route with escarpment views and city scenery', 5.0, 'moderate', 1, 2, NOW());

-- Verify insertion
SELECT id, name, distance, difficulty FROM routes ORDER BY id;
