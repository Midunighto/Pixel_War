/* -- SQLBook: Code
 CREATE DATABASE IF NOT EXISTS pixel_war; 
 */
USE pixel_war; 
/*  
CREATE TABLE "user" (
  "id" int PRIMARY KEY AUTO_INCREMENT NOT NULL,
  "pseudo" varchar(50) NOT NULL,
  "email" varchar(320) NOT NULL,
  "pwd" varchar(255) NOT NULL,
  "theme" INT(1) DEFAULT 1,
  UNIQUE KEY "pseudo" ("pseudo"),
  UNIQUE KEY "email" ("email")
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE "grid" (
  "id" int PRIMARY KEY AUTO_INCREMENT NOT NULL,
  "name" varchar(50),
  "dimensions" varchar(10) NOT NULL DEFAULT '40x40',
  "user_id" int NOT NULL,
  "creation_time" datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DELIMITER //
CREATE TRIGGER set_default_name BEFORE INSERT ON "grid"
FOR EACH ROW
BEGIN
  IF NEW.name IS NULL OR NEW.name = '' THEN
    SET NEW.name = CONCAT('Area', DATE_FORMAT(NOW(), '%Y%m%d%H%i%s'));
  END IF;
END;
//
DELIMITER ;

CREATE TABLE "pixel" (
  "id" int PRIMARY KEY AUTO_INCREMENT NOT NULL,
  "grid_id" int NOT NULL,
  "user_id" int NOT NULL,
  "color" varchar(10) NOT NULL,
  "x_coordinate" int NOT NULL,
  "y_coordinate" int NOT NULL,
  "created_at" datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("grid_id") REFERENCES "grid"("id") ON DELETE CASCADE,
  FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE "favorite_grids" (
  "user_id" int NOT NULL,
  "grid_id" int NOT NULL,
  PRIMARY KEY ("user_id", "grid_id"),
  FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE,
  FOREIGN KEY ("grid_id") REFERENCES "grid"("id") ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

ALTER TABLE "grid"
MODIFY "dimensions" varchar(10) NULL;

ALTER TABLE "user"
ADD COLUMN "last_log" datetime NOT NULL DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE "pixel"
ADD COLUMN "user_pseudo" varchar(50) NOT NULL;

ALTER TABLE "pixel"
ADD CONSTRAINT "pixel_ibfk_3" FOREIGN KEY ("user_pseudo") REFERENCES "user"("pseudo") ON DELETE CASCADE;
ALTER TABLE "user"
ADD COLUMN "isAdmin" TINYINT(1) NOT NULL DEFAULT 0; 

ALTER TABLE `grid`
MODIFY `name` varchar(255) NOT NULL; */