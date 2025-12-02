-- Hamilton Running Routes Setup
-- After inserting these, visit each route's edit page to add waypoints/coordinates

-- Clear existing routes (optional - comment out if you want to keep existing routes)
-- DELETE FROM routes WHERE id >= 1;

-- 1. Waterfront Trail - Easy 5km
INSERT INTO routes (name, description, distance, difficulty, is_public, created_by, created_at, updated_at) VALUES
('Waterfront Trail', 'Scenic lakefront path along Hamilton Harbour with beautiful water views', 5.0, 'easy', 1, 2, NOW(), NOW());

-- 2. Bayfront Park Loop - Easy 3km
INSERT INTO routes (name, description, distance, difficulty, is_public, created_by, created_at, updated_at) VALUES
('Bayfront Park Loop', 'Flat, paved loop around Bayfront Park with harbor views', 3.0, 'easy', 1, 2, NOW(), NOW());

-- 3. Dundurn Castle Grounds - Easy 2km
INSERT INTO routes (name, description, distance, difficulty, is_public, created_by, created_at, updated_at) VALUES
('Dundurn Castle Grounds', 'Historic route through Dundurn Castle grounds and surrounding park', 2.0, 'easy', 1, 2, NOW(), NOW());

-- 4. Confederation Beach Park - Easy 4km
INSERT INTO routes (name, description, distance, difficulty, is_public, created_by, created_at, updated_at) VALUES
('Confederation Beach Park', 'Beachfront path with playground and picnic areas', 4.0, 'easy', 1, 2, NOW(), NOW());

-- 5. Princess Point Loop - Moderate 6km
INSERT INTO routes (name, description, distance, difficulty, is_public, created_by, created_at, updated_at) VALUES
('Princess Point Loop', 'Nature trail through Cootes Paradise with wildlife viewing', 6.0, 'moderate', 1, 2, NOW(), NOW());

-- 6. McMaster Campus Loop - Moderate 5km
INSERT INTO routes (name, description, distance, difficulty, is_public, created_by, created_at, updated_at) VALUES
('McMaster Campus Loop', 'Campus route with some hills through university grounds', 5.0, 'moderate', 1, 2, NOW(), NOW());

-- 7. Chedoke Radial Trail - Moderate 7km
INSERT INTO routes (name, description, distance, difficulty, is_public, created_by, created_at, updated_at) VALUES
('Chedoke Radial Trail', 'Historic rail trail with moderate elevation changes', 7.0, 'moderate', 1, 2, NOW(), NOW());

-- 8. Red Hill Valley Trail - Moderate 8km
INSERT INTO routes (name, description, distance, difficulty, is_public, created_by, created_at, updated_at) VALUES
('Red Hill Valley Trail', 'Paved trail through valley with creek crossings', 8.0, 'moderate', 1, 2, NOW(), NOW());

-- 9. Escarpment Rail Trail - Moderate 10km
INSERT INTO routes (name, description, distance, difficulty, is_public, created_by, created_at, updated_at) VALUES
('Escarpment Rail Trail', 'Long rail trail along the base of the escarpment', 10.0, 'moderate', 1, 2, NOW(), NOW());

-- 10. Bruce Trail - Dundas Peak - Hard 8km
INSERT INTO routes (name, description, distance, difficulty, is_public, created_by, created_at, updated_at) VALUES
('Bruce Trail - Dundas Peak', 'Challenging trail with steep climbs to scenic overlook', 8.0, 'hard', 1, 2, NOW(), NOW());

-- 11. Devil\'s Punchbowl Trail - Hard 6km
INSERT INTO routes (name, description, distance, difficulty, is_public, created_by, created_at, updated_at) VALUES
('Devil\'s Punchbowl Trail', 'Steep escarpment trail to waterfall viewpoint', 6.0, 'hard', 1, 2, NOW(), NOW());

-- 12. Chedoke Stairs Challenge - Hard 4km
INSERT INTO routes (name, description, distance, difficulty, is_public, created_by, created_at, updated_at) VALUES
('Chedoke Stairs Challenge', 'Intense workout route featuring the famous Chedoke stairs', 4.0, 'hard', 1, 2, NOW(), NOW());

-- 13. Confederation to Burlington Pier - Moderate 12km
INSERT INTO routes (name, description, distance, difficulty, is_public, created_by, created_at, updated_at) VALUES
('Confederation to Burlington Pier', 'Long lakefront route connecting Hamilton to Burlington', 12.0, 'moderate', 1, 2, NOW(), NOW());

-- 14. Albion Falls Loop - Hard 7km
INSERT INTO routes (name, description, distance, difficulty, is_public, created_by, created_at, updated_at) VALUES
('Albion Falls Loop', 'Challenging trail with waterfall views and steep sections', 7.0, 'hard', 1, 2, NOW(), NOW());

-- 15. Sam Lawrence Park to Concession Street - Moderate 5km
INSERT INTO routes (name, description, distance, difficulty, is_public, created_by, created_at, updated_at) VALUES
('Sam Lawrence Park to Concession Street', 'Urban route with escarpment views and city scenery', 5.0, 'moderate', 1, 2, NOW(), NOW());

-- After running this SQL, visit each route to add waypoints:
-- 1. Go to http://localhost:8000/routes
-- 2. Click on each route
-- 3. Click "Edit"
-- 4. Use the map to add waypoints that match the distance
-- 5. Save each route

-- Note: Replace 'created_by' value (2) with the actual user ID you want to use
