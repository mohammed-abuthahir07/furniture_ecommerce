-- MySQL dump 10.13  Distrib 8.0.46, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: furniture_ecommerce
-- ------------------------------------------------------
-- Server version	8.0.46

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `admins`
--

DROP TABLE IF EXISTS `admins`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `admins` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password` varchar(255) NOT NULL,
  `status` enum('ACTIVE','INACTIVE') NOT NULL DEFAULT 'ACTIVE',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admins`
--

LOCK TABLES `admins` WRITE;
/*!40000 ALTER TABLE `admins` DISABLE KEYS */;
INSERT INTO `admins` VALUES (1,'Administrator','admin@furniture.com','$2b$10$sycYcJdLZfNj3mrvINifSO/ssI7gLhOCf65Nl.15LhdaeIk7.hGG2','ACTIVE','2026-10-06 05:03:09','2026-10-09 05:51:26');
/*!40000 ALTER TABLE `admins` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `description` varchar(500) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `status` enum('ACTIVE','INACTIVE') NOT NULL DEFAULT 'ACTIVE',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,'Living Room','Living room furniture comprises the core comfort and gathering pieces designed to anchor the central social space of a home, balancing relaxation, entertainment, and visual appeal.','https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=70','ACTIVE','2026-10-08 06:56:37','2026-10-09 04:50:51'),(2,'Dining Room','Dining room furniture consists of coordinated pieces designed to create a welcoming, functional, and elegant space for everyday family meals, holiday gatherings, and formal entertaining.','https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=1200&q=70','ACTIVE','2026-10-08 06:56:37','2026-10-09 04:50:30'),(3,'Bedroom','Bedroom furniture encompasses essential pieces designed to create a restful, comfortable, and organized personal sanctuary focused on sleep, relaxation, and personal care.','https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=70','ACTIVE','2026-10-08 06:56:37','2026-10-09 04:50:11'),(4,'Home Office','Home office furniture consists of ergonomic and functional pieces designed to create a productive, organized, and professional workspace within a residential setting.','https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=1200&q=70','ACTIVE','2026-10-08 06:56:37','2026-10-09 04:49:51'),(5,'Storage','Storage furniture includes dedicated pieces designed to keep your living spaces organized, clutter-free, and visually tidy by concealing or neatly displaying personal belongings.','https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=1200&q=70','ACTIVE','2026-10-08 06:56:37','2026-10-09 04:49:29'),(6,'Outdoor','Outdoor furniture (also known as patio or garden furniture) consists of weather-resistant pieces designed to extend your living space into the open air, turning balconies, patios, decks, and lawns into comfortable lounging and dining areas.','https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?auto=format&fit=crop&w=1200&q=70','ACTIVE','2026-10-08 06:59:42','2026-10-09 04:45:57'),(7,'Kids Room','Kids room furniture is specifically engineered to combine playful aesthetics, safety, and durability, adapting to a child\'s rapid growth and changing developmental needs.','https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1200&q=70','ACTIVE','2026-10-08 06:59:42','2026-10-09 04:45:35'),(8,'Entryway','Entryway furniture encompasses functional and welcoming pieces designed to organize your foyer, mudroom, or front hall, creating a clean and stylish first impression as people step into your home.','https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=1200&q=70','ACTIVE','2026-10-08 06:59:42','2026-10-09 04:45:16'),(9,'Bar Furniture','Bar furniture encompasses specialized seating, counters, and storage solutions designed to create a dedicated, sophisticated entertainment or social area in a home or commercial setting. It blends high-end hospitality styling with ergonomic comfort.','https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=1200&q=70','ACTIVE','2026-10-08 06:59:42','2026-10-09 04:44:55'),(10,'Accent Tables','An accent table is a versatile, smaller piece of furniture designed to combine everyday functionality with a distinct visual flair. While traditionally used to fill empty spaces or complement larger statement furniture (like sofas and beds), they serve as key design anchors in a room.','https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=1200&q=70','ACTIVE','2026-10-08 07:06:47','2026-10-09 04:44:28'),(11,'Traditional Chettinad Wooden Furniture','It fits your traditional furniture website perfectly and gives you a good category to showcase the furniture images, animations, Tamil translation, and WhatsApp enquiry form','https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTTuwtS6ObgzOuV5jo031FxxAOqk4l5MU_f57XSvTuL3Dy6wAuPs0_KtOM8&s=10','ACTIVE','2026-10-09 04:23:54','2026-10-09 04:43:34'),(12,'Heritage Chettinad Carved Wooden Swings','Traditional handcrafted wooden swings featuring intricate Chettinad carvings and premium solid-wood construction.','/uploads/categories/category-1791520775681-61f5b7dd4537.jpg','ACTIVE','2026-10-09 04:39:35','2026-10-09 04:39:35');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `custom_requirements`
--

DROP TABLE IF EXISTS `custom_requirements`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `custom_requirements` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `customer_id` int unsigned DEFAULT NULL,
  `name` varchar(150) NOT NULL,
  `email` varchar(150) DEFAULT NULL,
  `phone` varchar(20) NOT NULL,
  `address` text NOT NULL,
  `city` varchar(100) DEFAULT NULL,
  `state` varchar(100) DEFAULT NULL,
  `pincode` varchar(10) DEFAULT NULL,
  `alternative_address` text,
  `requirement` text NOT NULL,
  `reference_image` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_custom_requirements_customer_id` (`customer_id`),
  KEY `idx_custom_requirements_created_at` (`created_at`),
  CONSTRAINT `fk_custom_requirements_customer` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `custom_requirements`
--

LOCK TABLES `custom_requirements` WRITE;
/*!40000 ALTER TABLE `custom_requirements` DISABLE KEYS */;
INSERT INTO `custom_requirements` VALUES (1,NULL,'Mohammed Abuthahir','mohammedabuthahir316@gmail.com','08012693457','periyarbustaand','madurai','Tamilnadu','625011','Crime Branch','Detailed Custom Specifications & Unique Furniture Concepts\r\nTo elevate a custom furniture line or standalone bespoke project, distinct technical specifications and unique engineering details set pieces apart from mass-market manufacturing. Below is a comprehensive guide to defining custom furniture specifications, incorporating high-end joinery, unique material blending, and functional innovations.','/uploads/custom-requirements/requirement-1791525328960-110885461.jpg','2026-10-09 05:55:28','2026-10-09 05:55:28');
/*!40000 ALTER TABLE `custom_requirements` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `customer_carts`
--

DROP TABLE IF EXISTS `customer_carts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `customer_carts` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `customer_id` int unsigned NOT NULL,
  `product_id` int unsigned NOT NULL,
  `variant_id` int unsigned NOT NULL,
  `quantity` int unsigned NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_customer_product_variant_cart` (`customer_id`,`product_id`,`variant_id`),
  KEY `idx_customer_carts_customer` (`customer_id`),
  KEY `idx_customer_carts_product` (`product_id`),
  KEY `idx_customer_carts_variant` (`variant_id`),
  CONSTRAINT `fk_customer_carts_customer` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_customer_carts_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_customer_carts_variant` FOREIGN KEY (`variant_id`) REFERENCES `product_variants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customer_carts`
--

LOCK TABLES `customer_carts` WRITE;
/*!40000 ALTER TABLE `customer_carts` DISABLE KEYS */;
/*!40000 ALTER TABLE `customer_carts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `customer_password_otps`
--

DROP TABLE IF EXISTS `customer_password_otps`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `customer_password_otps` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `customer_id` int unsigned NOT NULL,
  `email` varchar(150) NOT NULL,
  `otp_hash` varchar(255) NOT NULL,
  `expires_at` datetime NOT NULL,
  `attempts` int unsigned NOT NULL DEFAULT '0',
  `is_verified` tinyint(1) NOT NULL DEFAULT '0',
  `is_used` tinyint(1) NOT NULL DEFAULT '0',
  `reset_token_hash` varchar(255) DEFAULT NULL,
  `reset_token_expires_at` datetime DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_password_otp_email` (`email`),
  KEY `idx_password_otp_customer` (`customer_id`),
  KEY `idx_password_otp_expires` (`expires_at`),
  KEY `idx_password_otp_reset_token` (`reset_token_hash`),
  CONSTRAINT `fk_password_otp_customer` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customer_password_otps`
--

LOCK TABLES `customer_password_otps` WRITE;
/*!40000 ALTER TABLE `customer_password_otps` DISABLE KEYS */;
/*!40000 ALTER TABLE `customer_password_otps` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `customer_wishlist`
--

DROP TABLE IF EXISTS `customer_wishlist`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `customer_wishlist` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `customer_id` int unsigned NOT NULL,
  `product_id` int unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_customer_product_wishlist` (`customer_id`,`product_id`),
  KEY `idx_wishlist_customer` (`customer_id`),
  KEY `idx_wishlist_product` (`product_id`),
  CONSTRAINT `fk_wishlist_customer` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_wishlist_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customer_wishlist`
--

LOCK TABLES `customer_wishlist` WRITE;
/*!40000 ALTER TABLE `customer_wishlist` DISABLE KEYS */;
/*!40000 ALTER TABLE `customer_wishlist` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `customers`
--

DROP TABLE IF EXISTS `customers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `customers` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(150) NOT NULL,
  `email` varchar(150) NOT NULL,
  `google_id` varchar(255) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `profile_image` varchar(255) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `status` enum('ACTIVE','INACTIVE') NOT NULL DEFAULT 'ACTIVE',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `google_id` (`google_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customers`
--

LOCK TABLES `customers` WRITE;
/*!40000 ALTER TABLE `customers` DISABLE KEYS */;
INSERT INTO `customers` VALUES (2,'Abuthahir','abuthahirmohammed6@gmail.com','114942726365612718774','+918012693457','/uploads/customers/customer-1791448392450-217376121.jpg','$2b$10$UpEo156iXaNf2rcDdfBqK.CM4fxPLKZyfW9cwu0LOP69Ynue2X/xG','ACTIVE','2026-10-08 07:33:37','2026-10-08 08:33:12'),(3,'Mohammed Abuthahir','mohammedabuthahir316@gmail.com','113249304125670155854','+918682096578',NULL,'$2b$10$jZHOvNVr5lKU8/ssxH20he8cp9feu.kTEp51WHtOY20JcJxYbkVTG','ACTIVE','2026-10-09 06:06:09','2026-10-10 03:23:47');
/*!40000 ALTER TABLE `customers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notifications` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `customer_id` int unsigned DEFAULT NULL,
  `type` enum('NEW_ORDER','PAYMENT_RECEIVED','PAYMENT_FAILED','ORDER_CANCELLED','LOW_STOCK','OUT_OF_STOCK','NEW_CUSTOMER','OFFER_EXPIRING') NOT NULL,
  `title` varchar(200) NOT NULL,
  `message` varchar(500) NOT NULL,
  `reference_type` enum('ORDER','VARIANT','CUSTOMER','OFFER') DEFAULT NULL,
  `reference_id` int unsigned DEFAULT NULL,
  `is_read` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_notifications_type` (`type`),
  KEY `idx_notifications_is_read` (`is_read`),
  KEY `idx_notifications_created_at` (`created_at`),
  KEY `idx_notifications_reference` (`reference_type`,`reference_id`),
  KEY `idx_notifications_customer_created` (`customer_id`,`created_at`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notifications`
--

LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
INSERT INTO `notifications` VALUES (2,2,'NEW_ORDER','Order Placed Successfully','Your order ORD-1791525748940-1802 has been placed successfully.','ORDER',2,1,'2026-10-09 06:02:28');
/*!40000 ALTER TABLE `notifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `offers`
--

DROP TABLE IF EXISTS `offers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `offers` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(200) NOT NULL,
  `description` varchar(500) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `discount_type` enum('PERCENTAGE','FIXED') NOT NULL,
  `discount_value` decimal(10,2) NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `status` enum('ACTIVE','INACTIVE') NOT NULL DEFAULT 'ACTIVE',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `offers`
--

LOCK TABLES `offers` WRITE;
/*!40000 ALTER TABLE `offers` DISABLE KEYS */;
INSERT INTO `offers` VALUES (1,'Chettinad Heritage Furniture Festival','Celebrate timeless craftsmanship with 15% off selected solid wood furniture. Discover handcrafted Chettinad dining tables, carved wooden swings, and heritage furniture designs from Zayith Home. Upgrade your home with traditional elegance for a limited time.','/uploads/products/product-1791524211035-486273092.jpg','PERCENTAGE',15.00,'2026-10-09','2026-11-08','ACTIVE','2026-10-09 05:36:51','2026-10-09 05:36:51');
/*!40000 ALTER TABLE `offers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_items`
--

DROP TABLE IF EXISTS `order_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_items` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `order_id` int unsigned NOT NULL,
  `product_id` int unsigned NOT NULL,
  `variant_id` int unsigned DEFAULT NULL,
  `product_name` varchar(200) NOT NULL,
  `variant_name` varchar(100) DEFAULT NULL,
  `color` varchar(100) DEFAULT NULL,
  `quantity` int unsigned NOT NULL DEFAULT '1',
  `unit_price` decimal(10,2) NOT NULL,
  `subtotal` decimal(10,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_order_items_order_id` (`order_id`),
  KEY `idx_order_items_product_id` (`product_id`),
  KEY `idx_order_items_variant_id` (`variant_id`),
  CONSTRAINT `fk_order_items_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_order_items_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_order_items_variant` FOREIGN KEY (`variant_id`) REFERENCES `product_variants` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_items`
--

LOCK TABLES `order_items` WRITE;
/*!40000 ALTER TABLE `order_items` DISABLE KEYS */;
INSERT INTO `order_items` VALUES (2,2,38,75,'Chettinad Handcrafted Sheesham','Natural Sheesham','Honey Brown / Natural Wood Grain',1,41999.00,41999.00,'2026-10-09 06:02:28');
/*!40000 ALTER TABLE `order_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `order_number` varchar(50) NOT NULL,
  `customer_id` int unsigned DEFAULT NULL,
  `customer_name` varchar(150) NOT NULL,
  `customer_email` varchar(150) NOT NULL,
  `customer_phone` varchar(20) DEFAULT NULL,
  `shipping_address` text NOT NULL,
  `shipping_city` varchar(100) DEFAULT NULL,
  `shipping_state` varchar(100) DEFAULT NULL,
  `shipping_pincode` varchar(10) DEFAULT NULL,
  `alternative_address` text,
  `subtotal` decimal(10,2) NOT NULL DEFAULT '0.00',
  `discount_amount` decimal(10,2) NOT NULL DEFAULT '0.00',
  `shipping_charge` decimal(10,2) NOT NULL DEFAULT '0.00',
  `total_amount` decimal(10,2) NOT NULL DEFAULT '0.00',
  `payment_method` enum('COD','ONLINE') NOT NULL DEFAULT 'COD',
  `payment_status` enum('PENDING','PAID','FAILED','REFUNDED') NOT NULL DEFAULT 'PENDING',
  `order_status` enum('PENDING','CONFIRMED','PROCESSING','SHIPPED','OUT_FOR_DELIVERY','DELIVERED','CANCELLED') NOT NULL DEFAULT 'PENDING',
  `notes` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `order_number` (`order_number`),
  KEY `idx_orders_customer_id` (`customer_id`),
  KEY `idx_orders_order_status` (`order_status`),
  KEY `idx_orders_payment_status` (`payment_status`),
  KEY `idx_orders_created_at` (`created_at`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (2,'ORD-1791525748940-1802',2,'Abuthahir','abuthahirmohammed6@gmail.com','+918012693457','periyarbustaand','madurai','Tamilnadu','625011','Crime Branch',41999.00,0.00,0.00,41999.00,'ONLINE','PAID','CONFIRMED','please be carefull\nRazorpay: pay_TlhgQZNP8Pl8Va','2026-10-09 06:02:28','2026-10-09 06:03:25');
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_customization_requests`
--

DROP TABLE IF EXISTS `product_customization_requests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_customization_requests` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `customer_id` int unsigned NOT NULL,
  `request_type` enum('EXISTING_PRODUCT','NEW_PRODUCT') NOT NULL,
  `product_id` int unsigned DEFAULT NULL,
  `customer_requirement` text NOT NULL,
  `customer_image` varchar(255) DEFAULT NULL,
  `admin_reply` text,
  `additional_cost` decimal(10,2) NOT NULL DEFAULT '0.00',
  `status` enum('PENDING','UNDER_REVIEW','ADMIN_REPLIED','CUSTOMER_ACCEPTED','READY_TO_ORDER','ORDERED','REJECTED') NOT NULL DEFAULT 'PENDING',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_customization_customer` (`customer_id`),
  KEY `idx_customization_product` (`product_id`),
  KEY `idx_customization_type` (`request_type`),
  KEY `idx_customization_status` (`status`),
  KEY `idx_customization_created_at` (`created_at`),
  CONSTRAINT `fk_customization_customer` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_customization_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_customization_requests`
--

LOCK TABLES `product_customization_requests` WRITE;
/*!40000 ALTER TABLE `product_customization_requests` DISABLE KEYS */;
INSERT INTO `product_customization_requests` VALUES (1,3,'EXISTING_PRODUCT',38,'i want this exact furniture with 6 legs','/uploads/customizations/customization-1791526209265-123666053.jpg','okk we will do it',30000.00,'ADMIN_REPLIED','2026-10-09 06:10:09','2026-10-09 06:12:29');
/*!40000 ALTER TABLE `product_customization_requests` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_images`
--

DROP TABLE IF EXISTS `product_images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_images` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `product_id` int unsigned NOT NULL,
  `image` varchar(255) NOT NULL,
  `image_title` varchar(150) DEFAULT NULL,
  `sort_order` int unsigned NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_product_images_product` (`product_id`),
  CONSTRAINT `fk_product_images_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_images`
--

LOCK TABLES `product_images` WRITE;
/*!40000 ALTER TABLE `product_images` DISABLE KEYS */;
/*!40000 ALTER TABLE `product_images` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_reviews`
--

DROP TABLE IF EXISTS `product_reviews`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_reviews` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `customer_id` int unsigned NOT NULL,
  `product_id` int unsigned NOT NULL,
  `rating` tinyint unsigned NOT NULL,
  `comment` text NOT NULL,
  `status` enum('APPROVED','HIDDEN') NOT NULL DEFAULT 'APPROVED',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_customer_product_review` (`customer_id`,`product_id`),
  KEY `idx_product_reviews_product` (`product_id`),
  KEY `idx_product_reviews_customer` (`customer_id`),
  KEY `idx_product_reviews_status` (`status`),
  CONSTRAINT `fk_product_reviews_customer` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_product_reviews_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_reviews`
--

LOCK TABLES `product_reviews` WRITE;
/*!40000 ALTER TABLE `product_reviews` DISABLE KEYS */;
INSERT INTO `product_reviews` VALUES (2,2,38,4,'This product is fantastic','APPROVED','2026-10-09 06:04:47','2026-10-09 06:05:29');
/*!40000 ALTER TABLE `product_reviews` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_variant_images`
--

DROP TABLE IF EXISTS `product_variant_images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_variant_images` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `variant_id` int unsigned NOT NULL,
  `image` varchar(255) NOT NULL,
  `image_title` varchar(150) DEFAULT NULL,
  `sort_order` int unsigned NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_variant_images_variant_sort` (`variant_id`,`sort_order`),
  CONSTRAINT `fk_variant_images_variant` FOREIGN KEY (`variant_id`) REFERENCES `product_variants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_variant_images`
--

LOCK TABLES `product_variant_images` WRITE;
/*!40000 ALTER TABLE `product_variant_images` DISABLE KEYS */;
INSERT INTO `product_variant_images` VALUES (15,75,'/uploads/products/product-1791523374673-868626854.webp',NULL,1,'2026-10-09 05:22:54'),(16,76,'/uploads/products/product-1791523486227-360627548.jpg',NULL,1,'2026-10-09 05:24:46'),(17,77,'/uploads/products/product-1791523518252-663234016.jpg',NULL,1,'2026-10-09 05:25:18'),(18,79,'/uploads/products/product-1791523862691-798990480.jpg',NULL,1,'2026-10-09 05:31:02'),(19,80,'/uploads/products/product-1791523922578-369161975.jpg',NULL,1,'2026-10-09 05:32:02'),(20,81,'/uploads/products/product-1791523937346-481708516.jpg',NULL,1,'2026-10-09 05:32:17');
/*!40000 ALTER TABLE `product_variant_images` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_variants`
--

DROP TABLE IF EXISTS `product_variants`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_variants` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `product_id` int unsigned NOT NULL,
  `variant_name` varchar(100) NOT NULL,
  `color` varchar(100) DEFAULT NULL,
  `stock_quantity` int unsigned NOT NULL DEFAULT '0',
  `status` enum('ACTIVE','INACTIVE') NOT NULL DEFAULT 'ACTIVE',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_product_variants_product` (`product_id`),
  KEY `idx_variants_status_stock` (`status`,`stock_quantity`),
  CONSTRAINT `fk_product_variants_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=82 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_variants`
--

LOCK TABLES `product_variants` WRITE;
/*!40000 ALTER TABLE `product_variants` DISABLE KEYS */;
INSERT INTO `product_variants` VALUES (1,1,'Honey Finish','Honey',8,'ACTIVE','2026-10-08 06:56:37','2026-10-08 06:56:37'),(2,1,'Walnut Finish','Walnut',5,'ACTIVE','2026-10-08 06:56:37','2026-10-08 06:56:37'),(3,2,'Natural Teak','Natural',4,'ACTIVE','2026-10-08 06:56:38','2026-10-08 06:56:38'),(4,2,'Dark Polish','Dark Brown',3,'ACTIVE','2026-10-08 06:56:38','2026-10-08 06:56:38'),(5,3,'Natural Oak','Natural',12,'ACTIVE','2026-10-08 06:56:38','2026-10-08 06:56:38'),(6,3,'Smoked Oak','Smoked',6,'ACTIVE','2026-10-08 06:56:38','2026-10-08 06:56:38'),(7,4,'Honey Finish','Honey',10,'ACTIVE','2026-10-08 06:56:38','2026-10-08 06:56:38'),(8,4,'Espresso Finish','Espresso',7,'ACTIVE','2026-10-08 06:56:38','2026-10-08 06:56:38'),(9,5,'Natural Teak','Natural',4,'ACTIVE','2026-10-08 06:56:38','2026-10-08 06:56:38'),(10,5,'Walnut Stain','Walnut',3,'ACTIVE','2026-10-08 06:56:38','2026-10-08 06:56:38'),(11,6,'Honey Finish','Honey',6,'ACTIVE','2026-10-08 06:56:38','2026-10-08 06:56:38'),(12,6,'Provincial Teak Tone','Brown',4,'ACTIVE','2026-10-08 06:56:38','2026-10-08 06:56:38'),(13,7,'Natural Oak','Natural',8,'ACTIVE','2026-10-08 06:56:39','2026-10-08 07:03:26'),(14,7,'Grey Oak','Grey',5,'ACTIVE','2026-10-08 06:56:39','2026-10-08 06:56:39'),(15,8,'Natural Oak','Natural',4,'ACTIVE','2026-10-08 06:56:39','2026-10-08 06:56:39'),(16,8,'Weathered Oak','Weathered',3,'ACTIVE','2026-10-08 06:56:39','2026-10-08 06:56:39'),(17,9,'American Walnut','Walnut',5,'ACTIVE','2026-10-08 06:56:39','2026-10-08 06:56:39'),(18,9,'Dark Walnut','Dark Brown',3,'ACTIVE','2026-10-08 06:56:39','2026-10-08 06:56:39'),(19,10,'Natural Teak','Natural',14,'ACTIVE','2026-10-08 06:56:39','2026-10-08 06:56:39'),(20,10,'Honey Finish','Honey',8,'ACTIVE','2026-10-08 06:56:40','2026-10-08 06:56:40'),(21,11,'Walnut','Walnut',3,'ACTIVE','2026-10-08 06:56:40','2026-10-08 06:56:40'),(22,11,'Espresso','Espresso',2,'ACTIVE','2026-10-08 06:56:40','2026-10-08 06:56:40'),(23,12,'Walnut','Walnut',7,'ACTIVE','2026-10-08 06:56:41','2026-10-08 06:56:41'),(24,12,'Dark Walnut','Dark Brown',4,'ACTIVE','2026-10-08 06:56:41','2026-10-08 06:56:41'),(25,13,'Honey Finish','Honey',6,'ACTIVE','2026-10-08 06:56:41','2026-10-08 06:56:41'),(26,13,'Provincial Finish','Brown',5,'ACTIVE','2026-10-08 06:56:41','2026-10-08 06:56:41'),(27,14,'Natural Teak','Natural',6,'ACTIVE','2026-10-08 06:56:41','2026-10-08 06:56:41'),(28,14,'Antique Finish','Antique',4,'ACTIVE','2026-10-08 06:56:41','2026-10-08 06:56:41'),(29,15,'Natural Oak','Natural',5,'ACTIVE','2026-10-08 06:56:42','2026-10-08 06:56:42'),(30,15,'White Oak','White Oak',4,'ACTIVE','2026-10-08 06:56:42','2026-10-08 06:56:42'),(31,16,'Honey Finish','Honey',4,'ACTIVE','2026-10-08 06:56:42','2026-10-08 06:56:42'),(32,16,'Chestnut Finish','Chestnut',3,'ACTIVE','2026-10-08 06:56:42','2026-10-08 06:56:42'),(33,17,'Honey Finish','Honey',6,'ACTIVE','2026-10-08 06:59:42','2026-10-08 06:59:42'),(34,17,'Walnut Finish','Walnut',4,'ACTIVE','2026-10-08 06:59:42','2026-10-08 06:59:42'),(35,18,'Walnut','Walnut',20,'ACTIVE','2026-10-08 06:59:42','2026-10-08 06:59:42'),(36,18,'Dark Walnut','Dark Brown',12,'ACTIVE','2026-10-08 06:59:42','2026-10-08 06:59:42'),(37,19,'Natural Oak','Natural',5,'ACTIVE','2026-10-08 06:59:42','2026-10-08 06:59:42'),(38,19,'Weathered Oak','Weathered',3,'ACTIVE','2026-10-08 06:59:42','2026-10-08 06:59:42'),(39,20,'Honey Finish','Honey',4,'ACTIVE','2026-10-08 06:59:42','2026-10-08 06:59:42'),(40,20,'Provincial Finish','Brown',3,'ACTIVE','2026-10-08 06:59:42','2026-10-08 06:59:42'),(41,21,'Natural Teak','Natural',7,'ACTIVE','2026-10-08 06:59:43','2026-10-08 06:59:43'),(42,21,'Antique Finish','Antique',4,'ACTIVE','2026-10-08 06:59:43','2026-10-08 06:59:43'),(43,22,'Natural Teak','Natural',6,'ACTIVE','2026-10-08 06:59:43','2026-10-08 06:59:43'),(44,22,'Weathered Teak','Weathered',4,'ACTIVE','2026-10-08 06:59:43','2026-10-08 06:59:43'),(45,23,'Natural Teak','Natural',8,'ACTIVE','2026-10-08 06:59:43','2026-10-08 06:59:43'),(46,23,'Dark Oil','Dark Brown',5,'ACTIVE','2026-10-08 06:59:43','2026-10-08 06:59:43'),(47,24,'Natural Oak','Natural',5,'ACTIVE','2026-10-08 06:59:43','2026-10-08 06:59:43'),(48,24,'White Oak','White Oak',4,'ACTIVE','2026-10-08 06:59:43','2026-10-08 06:59:43'),(49,25,'Honey Finish','Honey',8,'ACTIVE','2026-10-08 06:59:43','2026-10-08 06:59:43'),(50,25,'Walnut Finish','Walnut',5,'ACTIVE','2026-10-08 06:59:43','2026-10-08 06:59:43'),(51,26,'Honey Finish','Honey',6,'ACTIVE','2026-10-08 06:59:43','2026-10-08 06:59:43'),(52,26,'Chestnut Finish','Chestnut',4,'ACTIVE','2026-10-08 06:59:43','2026-10-08 06:59:43'),(53,27,'Natural Teak','Natural',7,'ACTIVE','2026-10-08 06:59:43','2026-10-08 06:59:43'),(54,27,'Honey Finish','Honey',5,'ACTIVE','2026-10-08 06:59:43','2026-10-08 06:59:43'),(55,28,'Walnut','Walnut',4,'ACTIVE','2026-10-08 06:59:43','2026-10-08 06:59:43'),(56,28,'Dark Walnut','Dark Brown',3,'ACTIVE','2026-10-08 06:59:43','2026-10-08 06:59:43'),(57,29,'Natural Oak','Natural',16,'ACTIVE','2026-10-08 06:59:44','2026-10-08 06:59:44'),(58,29,'Smoked Oak','Smoked',10,'ACTIVE','2026-10-08 06:59:44','2026-10-08 06:59:44'),(59,30,'Honey Finish','Honey',8,'ACTIVE','2026-10-08 07:06:47','2026-10-08 07:06:47'),(60,30,'Walnut Finish','Walnut',5,'ACTIVE','2026-10-08 07:06:47','2026-10-08 07:06:47'),(61,31,'Natural Oak','Natural',10,'ACTIVE','2026-10-08 07:06:47','2026-10-08 07:06:47'),(62,31,'Smoked Oak','Smoked',6,'ACTIVE','2026-10-08 07:06:47','2026-10-08 07:06:47'),(63,32,'Walnut','Walnut',3,'ACTIVE','2026-10-08 07:06:47','2026-10-08 07:06:47'),(64,32,'Dark Walnut','Dark Brown',2,'ACTIVE','2026-10-08 07:06:47','2026-10-08 07:06:47'),(65,33,'Natural Teak','Natural',4,'ACTIVE','2026-10-08 07:06:48','2026-10-08 07:06:48'),(66,33,'Weathered Teak','Weathered',3,'ACTIVE','2026-10-08 07:06:48','2026-10-08 07:06:48'),(67,34,'Natural Oak','Natural',6,'ACTIVE','2026-10-08 07:06:48','2026-10-08 07:06:48'),(68,34,'White Oak','White Oak',4,'ACTIVE','2026-10-08 07:06:48','2026-10-08 07:06:48'),(69,35,'Natural Oak','Natural',5,'ACTIVE','2026-10-08 07:06:48','2026-10-08 07:06:48'),(70,35,'Weathered Oak','Weathered',4,'ACTIVE','2026-10-08 07:06:48','2026-10-08 07:06:48'),(71,36,'Natural Teak','Natural',3,'ACTIVE','2026-10-08 07:06:48','2026-10-08 07:06:48'),(72,36,'Honey Finish','Honey',3,'ACTIVE','2026-10-08 07:06:48','2026-10-08 07:06:48'),(73,37,'Walnut','Walnut',7,'ACTIVE','2026-10-08 07:06:48','2026-10-08 07:06:48'),(74,37,'Dark Walnut','Dark Brown',4,'ACTIVE','2026-10-08 07:06:48','2026-10-08 07:06:48'),(75,38,'Natural Sheesham','Honey Brown / Natural Wood Grain',4,'ACTIVE','2026-10-09 05:00:53','2026-10-09 06:02:28'),(76,38,'Dark Walnut Finish','Deep Walnut Brown / Satin Finish',8,'ACTIVE','2026-10-09 05:01:17','2026-10-09 05:01:17'),(77,38,'Espresso Brown Finish','Rich Espresso Brown / Polished Finish',3,'ACTIVE','2026-10-09 05:01:45','2026-10-09 05:01:45'),(79,39,'Royal Floral Carving','Honey Teak Brown',10,'ACTIVE','2026-10-09 05:30:39','2026-10-09 05:48:19'),(80,39,'Antique Walnut Heritage','Dark Walnut Brown',8,'ACTIVE','2026-10-09 05:31:26','2026-10-09 05:31:26'),(81,39,'Espresso Palace Edition','Espresso Brown',10,'ACTIVE','2026-10-09 05:31:44','2026-10-09 05:31:44');
/*!40000 ALTER TABLE `product_variants` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `category_id` int unsigned NOT NULL,
  `name` varchar(200) NOT NULL,
  `brand` varchar(150) DEFAULT NULL,
  `main_image` varchar(255) DEFAULT NULL,
  `short_description` varchar(500) DEFAULT NULL,
  `description` text,
  `mrp` decimal(10,2) NOT NULL,
  `selling_price` decimal(10,2) NOT NULL,
  `material` varchar(100) DEFAULT NULL,
  `wood_type` varchar(100) DEFAULT NULL,
  `length` decimal(10,2) DEFAULT NULL,
  `width` decimal(10,2) DEFAULT NULL,
  `height` decimal(10,2) DEFAULT NULL,
  `weight` decimal(10,2) DEFAULT NULL,
  `seating_capacity` int unsigned DEFAULT NULL,
  `assembly_required` enum('YES','NO') NOT NULL DEFAULT 'NO',
  `delivery_days` int unsigned NOT NULL DEFAULT '6',
  `status` enum('ACTIVE','INACTIVE') NOT NULL DEFAULT 'ACTIVE',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_products_category` (`category_id`),
  KEY `idx_products_status_id` (`status`,`id`),
  CONSTRAINT `fk_products_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=40 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (1,1,'Sheesham 3-Seater Sofa','WoodCraft Studio','/uploads/products/product-1791442597345-131142316.jpg','Low-profile living room sofa in seasoned Sheesham with deep seat cushions.','A three-seat sofa built from seasoned Sheesham. The frame is joined for daily living-room use, with removable cushions and a warm timber tone.',68990.00,54990.00,'Solid Wood','Sheesham (Indian Rosewood)',210.00,88.00,84.00,42.00,3,'YES',8,'ACTIVE','2026-10-08 06:56:37','2026-10-08 06:56:37'),(2,1,'Teak L-Shaped Sectional','WoodCraft Studio','/uploads/products/product-1791442598115-826739735.jpg','Corner sectional in solid teak for a larger living room.','An L-shaped sectional with a teak frame and firm seat cushions. Sized for a family living room.',112990.00,94990.00,'Solid Wood','Teak Wood',260.00,160.00,86.00,68.00,5,'YES',12,'ACTIVE','2026-10-08 06:56:38','2026-10-08 06:56:38'),(3,1,'Oak Lounge Chair','WoodCraft Studio','/uploads/products/product-1791442598317-887403615.jpg','Single lounge chair in oak with a linen seat.','An oak lounge chair with a linen cushion. The arms are wide enough to rest a book.',24990.00,19990.00,'Solid Wood','Oak Wood',78.00,80.00,86.00,14.00,1,'NO',5,'ACTIVE','2026-10-08 06:56:38','2026-10-08 06:56:38'),(4,1,'Sheesham Coffee Table','WoodCraft Studio','/uploads/products/product-1791442598505-520999278.jpg','Rectangular coffee table with a lower shelf for books.','A Sheesham coffee table with a lower shelf. The corners are eased and the finish is matte.',18990.00,14990.00,'Solid Wood','Sheesham (Indian Rosewood)',110.00,60.00,42.00,16.00,NULL,'NO',5,'ACTIVE','2026-10-08 06:56:38','2026-10-08 06:56:38'),(5,2,'Teak 6-Seater Dining Set','WoodCraft Studio','/uploads/products/product-1791442598722-657240844.jpg','Solid teak dining table with six chairs for family meals.','A six-seater dining table in solid teak with matching chairs. The top is finished to show the grain.',92990.00,79990.00,'Solid Wood','Teak Wood',180.00,90.00,76.00,68.00,6,'YES',10,'ACTIVE','2026-10-08 06:56:38','2026-10-08 06:56:38'),(6,2,'Sheesham 4-Seater Dining Table','WoodCraft Studio','/uploads/products/product-1791442598939-719843934.jpg','Compact four-seater table for an apartment dining room.','A four-seat Sheesham dining table with a thick top and tapered legs. Chairs are sold with the table.',54990.00,46990.00,'Solid Wood','Sheesham (Indian Rosewood)',140.00,80.00,76.00,38.00,4,'YES',8,'ACTIVE','2026-10-08 06:56:38','2026-10-08 06:56:38'),(7,2,'Oak Dining Bench','WoodCraft Studio','/uploads/products/product-1791442599157-469824840.jpg','Solid oak bench that seats two beside a dining table.','A backless oak bench for a dining table. The seat is sanded smooth and finished with a clear coat.',16990.00,13990.00,'Solid Wood','Oak Wood',140.00,36.00,46.00,12.00,2,'NO',6,'ACTIVE','2026-10-08 06:56:39','2026-10-08 06:56:39'),(8,3,'Solid Oak King Bed','WoodCraft Studio','/uploads/products/product-1791442599391-221600410.jpg','King platform bed in oak with a low headboard.','A king platform bed in solid oak. The slats support a standard mattress without a box spring.',74990.00,62990.00,'Solid Wood','Oak Wood',210.00,190.00,110.00,72.00,NULL,'YES',9,'ACTIVE','2026-10-08 06:56:39','2026-10-08 06:56:39'),(9,3,'Walnut Queen Bed','WoodCraft Studio','/uploads/products/product-1791442599625-166913678.jpg','Queen bed in walnut with a panel headboard.','A queen bed in walnut. The headboard is a solid panel and the frame uses slats for the mattress.',68990.00,57990.00,'Solid Wood','Walnut Wood',210.00,160.00,120.00,64.00,NULL,'YES',9,'ACTIVE','2026-10-08 06:56:39','2026-10-08 06:56:39'),(10,3,'Teak Nightstand','WoodCraft Studio','/uploads/products/product-1791442599968-546545339.jpg','One-drawer teak nightstand with an open shelf.','A teak bedside table with one drawer and an open shelf for books. Sold as a single piece.',12990.00,9990.00,'Solid Wood','Teak Wood',45.00,40.00,55.00,10.00,NULL,'NO',5,'ACTIVE','2026-10-08 06:56:39','2026-10-08 06:56:39'),(11,3,'Walnut 3-Door Wardrobe','WoodCraft Studio','/uploads/products/product-1791442600633-698826084.jpg','Three-door wardrobe in walnut with a hanging rail and shelves.','A three-door walnut wardrobe with a hanging rail, two shelves, and space for standard hangers.',85990.00,72990.00,'Solid Wood','Walnut Wood',160.00,58.00,210.00,90.00,NULL,'YES',12,'ACTIVE','2026-10-08 06:56:40','2026-10-08 06:56:40'),(12,4,'Walnut Writing Desk','WoodCraft Studio','/uploads/products/product-1791442601060-299618418.jpg','Compact walnut desk with a drawer for a home office.','A writing desk in walnut with one drawer and a cable gap. The top fits a laptop and a lamp.',32990.00,27990.00,'Solid Wood','Walnut Wood',120.00,60.00,76.00,28.00,1,'NO',6,'ACTIVE','2026-10-08 06:56:41','2026-10-08 06:56:41'),(13,4,'Sheesham Study Table','WoodCraft Studio','/uploads/products/product-1791442601408-114195453.jpg','Study table in Sheesham with a modesty panel.','A Sheesham study table for a bedroom or office. The top is deep enough for books and a monitor.',28990.00,23990.00,'Solid Wood','Sheesham (Indian Rosewood)',140.00,65.00,76.00,30.00,1,'YES',7,'ACTIVE','2026-10-08 06:56:41','2026-10-08 06:56:41'),(14,4,'Teak Open Bookshelf','WoodCraft Studio','/uploads/products/product-1791442601732-330904129.jpg','Five-shelf teak bookcase for a living room or study.','An open teak bookshelf with five shelves for books, ceramics, and a small lamp.',28990.00,23990.00,'Solid Wood','Teak Wood',80.00,35.00,180.00,32.00,NULL,'YES',7,'ACTIVE','2026-10-08 06:56:41','2026-10-08 06:56:41'),(15,5,'Oak TV Console','WoodCraft Studio','/uploads/products/product-1791442602080-883249124.jpg','Low oak media console with two cabinets.','An oak TV console with closed cabinets and a cable opening. The top holds a television up to 55 inches.',34990.00,28990.00,'Solid Wood','Oak Wood',150.00,42.00,50.00,34.00,NULL,'YES',8,'ACTIVE','2026-10-08 06:56:42','2026-10-08 06:56:42'),(16,5,'Sheesham Sideboard','WoodCraft Studio','/uploads/products/product-1791442602305-721101767.jpg','Three-door sideboard for a dining room.','A Sheesham sideboard with three doors and an adjustable shelf. It sits against a dining wall.',42990.00,36990.00,'Solid Wood','Sheesham (Indian Rosewood)',160.00,45.00,80.00,48.00,NULL,'YES',9,'ACTIVE','2026-10-08 06:56:42','2026-10-08 06:56:42'),(17,1,'Sheesham 2-Seater Loveseat','WoodCraft Studio','/uploads/products/product-1791442782284-905232914.jpg','Compact two-seat sofa in Sheesham for a smaller living room.','A two-seat loveseat in seasoned Sheesham. The frame matches the three-seater and fits an apartment living room.',48990.00,39990.00,'Solid Wood','Sheesham (Indian Rosewood)',150.00,84.00,82.00,32.00,2,'YES',7,'ACTIVE','2026-10-08 06:59:42','2026-10-08 06:59:42'),(18,2,'Walnut Dining Chair','WoodCraft Studio','/uploads/products/product-1791442782547-213847311.jpg','Solid walnut dining chair sold as one seat.','A walnut dining chair with a curved back. Order a set by adding the quantity you need for the table.',8990.00,7490.00,'Solid Wood','Walnut Wood',48.00,46.00,96.00,7.00,1,'NO',5,'ACTIVE','2026-10-08 06:59:42','2026-10-08 06:59:42'),(19,3,'Oak Chest of Drawers','WoodCraft Studio','/uploads/products/product-1791442782639-494442306.jpg','Five-drawer oak chest for clothing and linen.','An oak chest with five drawers on wooden runners. It stands beside a bed or inside a dressing corner.',38990.00,32990.00,'Solid Wood','Oak Wood',90.00,48.00,120.00,46.00,NULL,'YES',8,'ACTIVE','2026-10-08 06:59:42','2026-10-08 06:59:42'),(20,3,'Sheesham Dressing Table','WoodCraft Studio','/uploads/products/product-1791442782748-668369161.jpg','Dressing table in Sheesham with a mirror and two drawers.','A Sheesham dressing table with a framed mirror and two drawers for small items.',27990.00,22990.00,'Solid Wood','Sheesham (Indian Rosewood)',100.00,45.00,150.00,28.00,NULL,'YES',8,'ACTIVE','2026-10-08 06:59:42','2026-10-08 06:59:42'),(21,4,'Teak Filing Cabinet','WoodCraft Studio','/uploads/products/product-1791442783107-417478650.jpg','Two-drawer teak cabinet for files beside a desk.','A teak filing cabinet with two deep drawers. It sits under or beside a writing desk.',18990.00,15990.00,'Solid Wood','Teak Wood',45.00,50.00,70.00,22.00,NULL,'NO',6,'ACTIVE','2026-10-08 06:59:43','2026-10-08 06:59:43'),(22,6,'Teak Garden Bench','WoodCraft Studio','/uploads/products/product-1791442783340-419396241.jpg','Three-seat teak bench for a balcony or garden.','A teak garden bench with a slatted seat and back. The timber is left to weather outdoors.',24990.00,20990.00,'Solid Wood','Teak Wood',150.00,58.00,90.00,24.00,3,'YES',8,'ACTIVE','2026-10-08 06:59:43','2026-10-08 06:59:43'),(23,6,'Teak Outdoor Lounge Chair','WoodCraft Studio','/uploads/products/product-1791442783432-677355012.jpg','Low teak lounge chair for a patio.','A low teak lounge chair with a reclined back. A cushion can be added after delivery.',21990.00,17990.00,'Solid Wood','Teak Wood',80.00,70.00,78.00,12.00,1,'NO',6,'ACTIVE','2026-10-08 06:59:43','2026-10-08 06:59:43'),(24,7,'Oak Kids Single Bed','WoodCraft Studio','/uploads/products/product-1791442783531-407834611.jpg','Single bed in oak with a low headboard for a child\'s room.','An oak single bed with rounded corners and a low headboard. The slats fit a standard single mattress.',32990.00,27990.00,'Solid Wood','Oak Wood',200.00,100.00,80.00,36.00,NULL,'YES',8,'ACTIVE','2026-10-08 06:59:43','2026-10-08 06:59:43'),(25,7,'Sheesham Kids Study Desk','WoodCraft Studio','/uploads/products/product-1791442783620-109804135.jpg','Smaller Sheesham desk for homework.','A compact Sheesham desk with one drawer. The height suits a school-age child.',16990.00,13990.00,'Solid Wood','Sheesham (Indian Rosewood)',100.00,50.00,68.00,18.00,1,'YES',6,'ACTIVE','2026-10-08 06:59:43','2026-10-08 06:59:43'),(26,8,'Sheesham Shoe Cabinet','WoodCraft Studio','/uploads/products/product-1791442783713-811002342.jpg','Two-door shoe cabinet for an entryway.','A Sheesham shoe cabinet with two doors and three shelves. It sits against an entry wall.',19990.00,16990.00,'Solid Wood','Sheesham (Indian Rosewood)',80.00,35.00,110.00,26.00,NULL,'YES',7,'ACTIVE','2026-10-08 06:59:43','2026-10-08 06:59:43'),(27,8,'Teak Console Table','WoodCraft Studio','/uploads/products/product-1791442783821-251949022.jpg','Narrow teak console for keys, a lamp, and a mirror.','A slim teak console table for an entry or behind a sofa. The lower shelf holds shoes or baskets.',17990.00,14990.00,'Solid Wood','Teak Wood',110.00,35.00,80.00,16.00,NULL,'NO',6,'ACTIVE','2026-10-08 06:59:43','2026-10-08 06:59:43'),(28,9,'Walnut Bar Cabinet','WoodCraft Studio','/uploads/products/product-1791442783899-109101245.jpg','Walnut cabinet with bottle shelves and a serving top.','A walnut bar cabinet with an open shelf for bottles and a closed cupboard below. The top is a serving surface.',45990.00,38990.00,'Solid Wood','Walnut Wood',100.00,45.00,110.00,40.00,NULL,'YES',9,'ACTIVE','2026-10-08 06:59:43','2026-10-08 06:59:43'),(29,9,'Oak Bar Stool','WoodCraft Studio','/uploads/products/product-1791442783993-217103412.jpg','Solid oak bar stool with a footrest.','An oak bar stool with a footrest and a flat seat. Sold as one stool.',7990.00,6490.00,'Solid Wood','Oak Wood',40.00,40.00,75.00,6.00,1,'NO',5,'ACTIVE','2026-10-08 06:59:44','2026-10-08 06:59:44'),(30,10,'Sheesham Nesting Tables','WoodCraft Studio','/uploads/products/product-1791443207766-81860673.jpg','Set of two nesting side tables in Sheesham.','A pair of nesting tables that slide together beside a sofa. The smaller table tucks under the larger one.',14990.00,11990.00,'Solid Wood','Sheesham (Indian Rosewood)',50.00,40.00,50.00,9.00,NULL,'NO',5,'ACTIVE','2026-10-08 07:06:47','2026-10-08 07:06:47'),(31,10,'Oak Round Side Table','WoodCraft Studio','/uploads/products/product-1791443207858-92430395.jpg','Small round oak table for a lamp or a cup.','A round oak side table with a lower shelf. It fits next to a lounge chair or bed.',9990.00,7990.00,'Solid Wood','Oak Wood',45.00,45.00,55.00,7.00,NULL,'NO',5,'ACTIVE','2026-10-08 07:06:47','2026-10-08 07:06:47'),(32,5,'Walnut Display Cabinet','WoodCraft Studio','/uploads/products/product-1791443207937-28867485.jpg','Glass-front walnut cabinet for dishes or books.','A tall walnut display cabinet with shelves behind doors. It stands in a dining room or living room.',52990.00,44990.00,'Solid Wood','Walnut Wood',90.00,40.00,180.00,52.00,NULL,'YES',10,'ACTIVE','2026-10-08 07:06:47','2026-10-08 07:06:47'),(33,6,'Teak Outdoor Dining Table','WoodCraft Studio','/uploads/products/product-1791443207998-874815441.jpg','Four-seat teak table for a balcony or terrace.','A teak outdoor dining table with a slatted top so rain can drain. Seats four.',42990.00,36990.00,'Solid Wood','Teak Wood',140.00,80.00,75.00,28.00,4,'YES',8,'ACTIVE','2026-10-08 07:06:48','2026-10-08 07:06:48'),(34,7,'Oak Toy Storage Bench','WoodCraft Studio','/uploads/products/product-1791443208059-370577636.jpg','Lift-top oak bench that stores toys.','An oak storage bench with a hinged lid. It sits at the foot of a child\'s bed.',15990.00,12990.00,'Solid Wood','Oak Wood',90.00,40.00,45.00,14.00,2,'YES',6,'ACTIVE','2026-10-08 07:06:48','2026-10-08 07:06:48'),(35,8,'Oak Hall Bench','WoodCraft Studio','/uploads/products/product-1791443208384-975414690.jpg','Entry bench in oak with a shelf for shoes.','A solid oak bench for putting on shoes. The lower shelf holds a pair of everyday shoes.',18990.00,15490.00,'Solid Wood','Oak Wood',100.00,38.00,48.00,15.00,2,'NO',6,'ACTIVE','2026-10-08 07:06:48','2026-10-08 07:06:48'),(36,2,'Teak Buffet Server','WoodCraft Studio','/uploads/products/product-1791443208465-137448015.jpg','Long teak buffet for serving and storage.','A teak buffet with drawers and cupboards. It sits against a dining wall.',48990.00,41990.00,'Solid Wood','Teak Wood',170.00,45.00,80.00,50.00,NULL,'YES',9,'ACTIVE','2026-10-08 07:06:48','2026-10-08 07:06:48'),(37,1,'Walnut Armchair','WoodCraft Studio','/uploads/products/product-1791443208527-384113875.jpg','Single walnut armchair with a cushioned seat.','A walnut armchair with a high back and a firm cushion. Use it as an extra living-room seat.',22990.00,18990.00,'Solid Wood','Walnut Wood',72.00,74.00,92.00,13.00,1,'NO',6,'ACTIVE','2026-10-08 07:06:48','2026-10-08 07:06:48'),(38,11,'Chettinad Handcrafted Sheesham','WoodCraft Studio','/uploads/products/product-1791521785284-764853334.jpg','Six-seater solid Sheesham dining table featuring traditional Chettinad craftsmanship','Handcrafted from solid Sheesham wood, this six-seater dining table combines traditional Chettinad-inspired carving with durable construction. Its rich natural wood grain, detailed legs, and spacious tabletop make it ideal for family dining rooms and traditional interiors.',48000.00,41999.00,'Solid Wood','Sheesham',72.00,36.00,30.00,45.00,6,'NO',8,'ACTIVE','2026-10-09 04:56:25','2026-10-09 05:34:35'),(39,12,'Heritage Chettinad Carved','WoodCraft Studio','/uploads/products/product-1791523802198-543130457.jpg','Elegant Chettinad-style carved Sheesham wooden swing featuring traditional craftsmanship, decorative brass chains, and comfortable cushioned seating for two.','Bring timeless South Indian heritage into your home with the Heritage Chettinad Carved Wooden Swing from Zayith Home. Crafted from solid Sheesham wood, this elegant swing features intricate floral carvings, beautifully detailed wooden pillars, and decorative brass-finish chains. Its rich natural wood grain and traditional design make it a stunning addition to living rooms, spacious verandas, pooja rooms, and heritage-inspired interiors. The comfortable two-person seat can be styled with soft cushions for a relaxing and luxurious experience. Designed to combine traditional character with everyday comfort, this swing makes a beautiful statement piece for your home.\r\n',32000.00,27999.00,'Solid Wood','Sheesham Wood',48.00,24.00,24.00,35.00,2,'YES',7,'ACTIVE','2026-10-09 05:30:02','2026-10-09 05:34:27');
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `store_settings`
--

DROP TABLE IF EXISTS `store_settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `store_settings` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `shipping_charge` decimal(10,2) NOT NULL DEFAULT '0.00',
  `free_shipping_threshold` decimal(10,2) NOT NULL DEFAULT '0.00',
  `default_delivery_days` int unsigned NOT NULL DEFAULT '6',
  `cod_enabled` tinyint(1) NOT NULL DEFAULT '1',
  `online_payment_enabled` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `store_settings`
--

LOCK TABLES `store_settings` WRITE;
/*!40000 ALTER TABLE `store_settings` DISABLE KEYS */;
INSERT INTO `store_settings` VALUES (1,499.00,10000.00,6,1,0,'2026-10-08 06:45:17','2026-10-09 05:51:40');
/*!40000 ALTER TABLE `store_settings` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-10-10 13:00:27
