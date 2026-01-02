-- Host: gateway01.ap-southeast-1.prod.aws.tidbcloud.com    Database: test
-- ------------------------------------------------------

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

--
-- Table structure for table `activites`
--

DROP TABLE IF EXISTS `activites`;
CREATE TABLE `activites` (
  `id_activite` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `tiers_id` int(10) unsigned NOT NULL,
  `type_activite` varchar(50) NOT NULL,
  `sujet` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `date_activite` datetime NOT NULL,
  `date_rappel` datetime DEFAULT NULL,
  `statut` enum('planifie','realise','annule') DEFAULT 'planifie',
  `priorite` varchar(20) DEFAULT 'normal',
  `utilisateur_id` int(10) unsigned DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_activite`),
  KEY `activites_tiers_id_foreign` (`tiers_id`),
  CONSTRAINT `activites_tiers_id_foreign` FOREIGN KEY (`tiers_id`) REFERENCES `tiers` (`id_tiers`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

--
-- Dumping data for table `activites`
--

INSERT INTO `activites` VALUES
(1,1,'appel','Relance contrat maintenance','Appel téléphonique pour confirmer la mise en place','2024-11-17 10:00:00',NULL,'realise','haute',NULL,'2025-11-17 14:53:26','2025-11-17 14:53:26'),
(2,1,'reunion','Présentation des nouvelles fonctionnalités','Réunion de présentation des mises à jour du logiciel','2024-11-18 14:00:00',NULL,'planifie','normal',NULL,'2025-11-17 14:56:18','2025-11-17 14:56:18'),
(3,1,'email','Envoi documentation technique','Envoi des manuels utilisateur et fiches techniques','2024-11-17 16:30:00',NULL,'realise','normal',NULL,'2025-11-17 14:56:19','2025-11-17 14:56:19');

--
-- Table structure for table `articles`
--

DROP TABLE IF EXISTS `articles`;
CREATE TABLE `articles` (
  `code_article` varchar(50) NOT NULL,
  `description` varchar(255) NOT NULL,
  `prix_unitaire` decimal(15,2) NOT NULL,
  `taux_tva` decimal(5,2) DEFAULT 20.00,
  `unite` varchar(20) DEFAULT 'unite',
  `actif` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `devise` varchar(3) DEFAULT 'MGA',
  `quantite_stock` int(11) NOT NULL DEFAULT 0,
  `seuil_alerte` int(11) NOT NULL DEFAULT 5,
  PRIMARY KEY (`code_article`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

--
-- Dumping data for table `articles`
--

INSERT INTO `articles` VALUES
('ART001','Ordinateur Portable',2500000.00,20.00,'unite',1,'2025-11-21 06:56:16','2025-12-28 10:41:26','MGA',3,3),
('ART002','Souris USB',15000.00,20.00,'unite',1,'2025-11-21 06:56:16','2025-12-28 10:40:25','MGA',108,5),
('ART003','Clavier Mécanique',80000.00,20.00,'unite',1,'2025-11-21 06:56:16','2025-12-28 10:40:12','MGA',41,5),
('ART004','Service Maintenance',150000.00,20.00,'heure',1,'2025-11-21 06:56:16','2025-12-11 06:35:02','MGA',895,1),
('ART005','Formation Logiciel',500000.00,0.00,'jour',1,'2025-11-21 06:56:16','2025-12-11 07:50:40','MGA',0,3),
('ART100','Nouveau Produit Test MODIFIÉ',30000.00,20.00,'unite',1,'2025-11-22 06:29:29','2025-11-22 06:33:10','MGA',200,15);

--
-- Table structure for table `commandes`
--

DROP TABLE IF EXISTS `commandes`;
CREATE TABLE `commandes` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `numero_commande` varchar(255) NOT NULL,
  `type` enum('import','export') NOT NULL,
  `client_id` int(10) unsigned NOT NULL,
  `fournisseur_id` int(10) unsigned NOT NULL,
  `date_commande` date NOT NULL,
  `date_livraison_prevue` date DEFAULT NULL,
  `statut` enum('brouillon','confirmée','expédiée','livrée','annulée') DEFAULT 'brouillon',
  `notes` text DEFAULT NULL,
  `montant_total` decimal(15,2) DEFAULT 0.00,
  `devise` varchar(3) DEFAULT 'EUR',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `commandes_numero_commande_unique` (`numero_commande`),
  KEY `fk_commandes_client` (`client_id`),
  KEY `fk_commandes_fournisseur` (`fournisseur_id`),
  CONSTRAINT `fk_commandes_client` FOREIGN KEY (`client_id`) REFERENCES `tiers` (`id_tiers`),
  CONSTRAINT `fk_commandes_fournisseur` FOREIGN KEY (`fournisseur_id`) REFERENCES `tiers` (`id_tiers`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

--
-- Dumping data for table `commandes`
--

INSERT INTO `commandes` VALUES
(8,'CMD-000001','import',1,2,'2024-01-15',NULL,'brouillon',NULL,6300000.00,'EUR','2025-11-12 05:46:48','2025-11-12 05:46:48'),
(9,'CMD-000002','export',4,2,'2025-11-12',NULL,'brouillon',NULL,0.00,'USD','2025-11-12 05:48:04','2025-11-12 05:48:04'),
(10,'CMD-000003','import',1,2,'2024-01-15',NULL,'livrée',NULL,6300000.00,'MGA','2025-11-12 08:59:57','2025-11-12 09:09:38'),
(11,'CMD-000004','export',3,2,'2024-01-20',NULL,'brouillon',NULL,1000000.00,'USD','2025-11-12 09:16:13','2025-11-12 09:16:13'),
(12,'CMD-000005','import',1,2,'2024-02-01',NULL,'brouillon',NULL,9000000.00,'EUR','2025-11-12 09:21:36','2025-11-12 09:21:36'),
(13,'CMD-000006','export',4,2,'2024-02-15',NULL,'brouillon',NULL,3000000.00,'MGA','2025-11-12 09:25:42','2025-11-12 09:25:42'),
(14,'CMD-000007','import',1,2,'2024-01-14',NULL,'brouillon',NULL,18000.00,'EUR','2025-11-13 12:19:57','2025-11-13 12:19:57'),
(15,'CMD-000008','export',4,2,'2025-11-11',NULL,'brouillon',NULL,180000.00,'USD','2025-11-13 12:20:19','2025-11-13 12:20:19'),
(16,'CMD-000009','import',1,2,'2024-01-14',NULL,'brouillon',NULL,3000000.00,'EUR','2025-11-13 12:20:39','2025-11-13 12:20:39'),
(17,'CMD-000010','import',1,2,'2024-01-14',NULL,'brouillon',NULL,18000.00,'EUR','2025-11-13 12:21:01','2025-11-13 12:21:01'),
(18,'CMD-000011','import',3,2,'2025-11-13',NULL,'brouillon',NULL,96000.00,'EUR','2025-11-13 12:21:26','2025-11-13 12:21:26'),
(19,'CMD-000012','import',3,2,'2025-11-12',NULL,'brouillon',NULL,1152000.00,'EUR','2025-11-13 12:37:34','2025-11-13 12:37:34'),
(20,'CMD-000013','import',1,2,'2024-01-14',NULL,'brouillon',NULL,3000000.00,'EUR','2025-11-13 12:37:55','2025-11-13 12:37:55'),
(21,'CMD-000014','import',1,2,'2025-11-13',NULL,'brouillon',NULL,3096000.00,'EUR','2025-11-13 13:54:50','2025-11-13 13:54:50'),
(22,'CMD-000015','import',1,2,'2025-11-12',NULL,'brouillon',NULL,4248000.00,'EUR','2025-11-13 13:59:43','2025-11-13 13:59:43'),
(23,'CMD-000016','import',1,2,'2025-11-11',NULL,'livrée',NULL,4248000.00,'EUR','2025-11-13 14:01:01','2025-11-13 14:01:01'),
(24,'CMD-000017','import',3,2,'2025-11-11',NULL,'livrée',NULL,1152000.00,'EUR','2025-11-13 14:01:47','2025-11-13 14:01:47'),
(25,'CMD-000018','import',4,2,'2025-11-21',NULL,'brouillon',NULL,1800000.00,'MGA','2025-11-21 11:26:21','2025-11-21 11:26:21'),
(26,'CMD-000019','import',4,2,'2025-11-20',NULL,'expédiée',NULL,1800000.00,'MGA','2025-11-21 11:26:40','2025-11-21 11:26:40'),
(27,'CMD-000020','import',1,2,'2024-12-01',NULL,'brouillon',NULL,12000000.00,'EUR','2025-12-29 09:48:00','2025-12-29 09:48:00');

--
-- Table structure for table `connaissements`
--

DROP TABLE IF EXISTS `connaissements`;
CREATE TABLE `connaissements` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `numero_connaissement` varchar(100) NOT NULL,
  `expedition_id` int(10) unsigned NOT NULL,
  `transporteur_id` int(10) unsigned NOT NULL,
  `type_connaissement` varchar(50) DEFAULT 'maritime',
  `type_document` varchar(50) DEFAULT 'original',
  `date_emission` date DEFAULT NULL,
  `date_embarquement` date DEFAULT NULL,
  `port_chargement` varchar(255) DEFAULT NULL,
  `port_dechargement` varchar(255) DEFAULT NULL,
  `consignataire` text DEFAULT NULL,
  `destinataire` text DEFAULT NULL,
  `statut` varchar(50) DEFAULT 'emis',
  `fichier_url` varchar(500) DEFAULT NULL,
  `observations` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `numero_connaissement` (`numero_connaissement`),
  KEY `idx_connaissement_numero` (`numero_connaissement`),
  KEY `idx_connaissement_expedition` (`expedition_id`),
  KEY `idx_connaissement_transporteur` (`transporteur_id`),
  KEY `idx_connaissement_statut` (`statut`),
  CONSTRAINT `connaissements_ibfk_1` FOREIGN KEY (`expedition_id`) REFERENCES `expeditions` (`id`),
  CONSTRAINT `connaissements_ibfk_2` FOREIGN KEY (`transporteur_id`) REFERENCES `transporteurs` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

--
-- Dumping data for table `connaissements`
--

INSERT INTO `connaissements` VALUES
(1,'CON-000001',1,1,'maritime','original','2024-11-22','2024-11-25','Port de Toamasina','Port de Marseille','Aquatiko SARL','Client Europe SA','emis',NULL,NULL,'2025-11-22 09:45:52','2025-11-22 09:45:52');

--
-- Table structure for table `contacts`
--

DROP TABLE IF EXISTS `contacts`;
CREATE TABLE `contacts` (
  `id_contact` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `tiers_id` int(10) unsigned NOT NULL,
  `nom` varchar(255) NOT NULL,
  `prenom` varchar(255) DEFAULT NULL,
  `fonction` varchar(100) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `telephone` varchar(20) DEFAULT NULL,
  `principal` tinyint(1) DEFAULT 0,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_contact`),
  KEY `contacts_tiers_id_foreign` (`tiers_id`),
  CONSTRAINT `contacts_tiers_id_foreign` FOREIGN KEY (`tiers_id`) REFERENCES `tiers` (`id_tiers`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

--
-- Dumping data for table `contacts`
--

INSERT INTO `contacts` VALUES
(1,1,'Dupont','Pierre','Directeur Commercial','p.dupont@client.mg','+261 34 11 223 34',1,NULL,'2025-11-17 04:56:57','2025-11-17 04:56:57'),
(2,3,'aa','aaa','dg','aaa@dd.kd','+261 34 30 746 23',1,'dadafafd','2025-11-17 08:01:02','2025-11-17 08:01:02'),
(3,1,'wwww','wwwww','www','ee@kddk.dl','+261132456789',0,'wwwww','2025-11-20 11:27:15','2025-11-20 11:27:15'),
(4,4,'nnnn','','','','',1,'','2025-11-21 11:29:07','2025-11-21 11:29:07');

--
-- Table structure for table `contrats`
--

DROP TABLE IF EXISTS `contrats`;
CREATE TABLE `contrats` (
  `id_contrat` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `numero_contrat` varchar(50) NOT NULL,
  `tiers_id` int(10) unsigned NOT NULL,
  `devis_id` int(10) unsigned DEFAULT NULL,
  `type_contrat` varchar(100) NOT NULL,
  `date_debut` date NOT NULL,
  `date_fin` date DEFAULT NULL,
  `statut` enum('actif','inactif','resilie','termine') DEFAULT 'actif',
  `montant_ht` decimal(15,2) DEFAULT 0.00,
  `montant_ttc` decimal(15,2) DEFAULT 0.00,
  `periodicite` varchar(50) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `conditions` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_contrat`),
  UNIQUE KEY `contrats_numero_contrat_unique` (`numero_contrat`),
  KEY `contrats_tiers_id_foreign` (`tiers_id`),
  KEY `contrats_devis_id_foreign` (`devis_id`),
  CONSTRAINT `contrats_devis_id_foreign` FOREIGN KEY (`devis_id`) REFERENCES `devis` (`id_devis`),
  CONSTRAINT `contrats_tiers_id_foreign` FOREIGN KEY (`tiers_id`) REFERENCES `tiers` (`id_tiers`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

--
-- Dumping data for table `contrats`
--

INSERT INTO `contrats` VALUES
(1,'CONT-2024-001',1,1,'Maintenance','2025-11-17','2025-11-17','actif',500000.00,0.00,'annuel','Prestation de consulting test','Paiement à 30 jours','2025-11-17 14:37:12','2025-11-17 14:37:12'),
(2,'CONT-2024-002',1,1,'Maintenance','2025-11-17',NULL,'actif',500000.00,0.00,'ponctuel','Prestation de consulting test','Paiement à 30 jours','2025-11-17 14:37:59','2025-11-17 14:37:59'),
(3,'CONT-2024-003',1,NULL,'Formation','2024-12-01','2024-12-31','actif',1200000.00,1440000.00,'ponctuel','Formation intensive aux outils CRM','Paiement à 15 jours','2025-11-18 05:27:25','2025-11-18 05:27:25'),
(4,'CONT-2024-004',4,5,'Formation','2025-11-18','2025-11-20','termine',100000.00,120000.00,'trimestriel','ok','ok','2025-11-18 05:29:55','2025-11-18 05:30:12');

--
-- Table structure for table `couts_logistiques`
--

DROP TABLE IF EXISTS `couts_logistiques`;
CREATE TABLE `couts_logistiques` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `commande_id` int(10) unsigned NOT NULL,
  `fret_maritime` decimal(15,2) DEFAULT 0.00,
  `fret_aerien` decimal(15,2) DEFAULT 0.00,
  `assurance` decimal(15,2) DEFAULT 0.00,
  `droits_douane` decimal(15,2) DEFAULT 0.00,
  `frais_transit` decimal(15,2) DEFAULT 0.00,
  `transport_local` decimal(15,2) DEFAULT 0.00,
  `autres_frais` decimal(15,2) DEFAULT 0.00,
  `description_autres_frais` text DEFAULT NULL,
  `devise_couts` varchar(3) DEFAULT 'EUR',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_couts_commande` (`commande_id`),
  CONSTRAINT `fk_couts_commande` FOREIGN KEY (`commande_id`) REFERENCES `commandes` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

--
-- Dumping data for table `couts_logistiques`
--

INSERT INTO `couts_logistiques` VALUES
(1,10,500000.00,0.00,100000.00,300000.00,75000.00,200000.00,50000.00,'Frais de manutention portuaire','MGA','2025-11-12 09:03:50','2025-11-12 09:21:25'),
(2,11,800000.00,0.00,150000.00,200000.00,50000.00,100000.00,75000.00,'Frais de dossier et formalités administratives','USD','2025-11-12 09:21:11','2025-11-12 09:21:11'),
(3,12,0.00,1200000.00,200000.00,150000.00,80000.00,120000.00,30000.00,'Frais aéroportuaires et handling','EUR','2025-11-12 09:21:54','2025-11-12 09:21:54'),
(4,13,300000.00,0.00,50000.00,0.00,0.00,80000.00,0.00,NULL,'MGA','2025-11-12 09:26:38','2025-11-12 09:26:38'),
(6,14,50000.00,0.00,10000.00,20000.00,15000.00,25000.00,5000.00,NULL,'EUR','2025-11-13 14:53:12','2025-11-13 14:53:12');

--
-- Table structure for table `devis`
--

DROP TABLE IF EXISTS `devis`;
CREATE TABLE `devis` (
  `id_devis` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `numero_devis` varchar(50) NOT NULL,
  `tiers_id` int(10) unsigned NOT NULL,
  `date_devis` date NOT NULL,
  `date_validite` date DEFAULT NULL,
  `statut` enum('brouillon','envoye','accepte','refuse','expire','transforme_contrat') DEFAULT NULL,
  `montant_ht` decimal(15,2) DEFAULT 0.00,
  `montant_ttc` decimal(15,2) DEFAULT 0.00,
  `objet` text DEFAULT NULL,
  `description` text DEFAULT NULL,
  `conditions` text DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_devis`),
  UNIQUE KEY `devis_numero_devis_unique` (`numero_devis`),
  KEY `devis_tiers_id_foreign` (`tiers_id`),
  CONSTRAINT `devis_tiers_id_foreign` FOREIGN KEY (`tiers_id`) REFERENCES `tiers` (`id_tiers`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

--
-- Dumping data for table `devis`
--

INSERT INTO `devis` VALUES
(1,'DEV-000001',1,'2024-11-16','2024-12-16','accepte',1800000.00,2160000.00,'Prestation de maintenance annuelle - Révision',NULL,'Paiement à 45 jours, démarrage immédiat',NULL,'2025-11-16 06:47:52','2025-11-18 05:08:52'),
(2,'DEV-000002',1,'2024-11-16','2024-12-16','brouillon',750000.00,0.00,'Prestation maintenance système',NULL,'Paiement à 30 jours, garantie 3 mois',NULL,'2025-11-16 06:52:48','2025-11-16 06:52:48'),
(3,'DEV-000003',1,'2024-11-16','2024-12-16','brouillon',3500000.00,0.00,'Prestation de consulting digital - Optimisation processus','Audit complet des processus métier et recommandations d optimisation','Paiement à 30 jours fin de mois, démarrage sous 10 jours ouvrés',NULL,'2025-11-17 04:49:07','2025-11-17 04:49:07'),
(4,'DEV-000004',1,'2024-11-16','2024-12-16','brouillon',500000.00,0.00,'Solution de gestion de projets créatifs - Licence annuelle',NULL,'Paiement à 30 jours, mise en place incluse, support technique 9h-18h',NULL,'2025-11-17 13:59:15','2025-11-17 13:59:15'),
(5,'DEV-000005',1,'2024-11-17',NULL,'brouillon',100000.00,120000.00,'Test transformation contrat',NULL,NULL,NULL,'2025-11-17 14:26:36','2025-11-17 14:26:36'),
(6,'DEV-000006',1,'2024-11-17',NULL,'brouillon',100000.00,120000.00,'Test transformation contrat',NULL,NULL,NULL,'2025-11-17 14:27:21','2025-11-17 14:27:21'),
(7,'DEV-000007',1,'2024-11-18','2024-12-18','accepte',1500000.00,1800000.00,'Prestation de maintenance annuelle',NULL,'Paiement à 30 jours fin de mois',NULL,'2025-11-18 04:50:30','2025-11-18 06:54:05'),
(8,'DEV-000008',5,'2025-11-20','2025-12-20','brouillon',0.00,0.00,'','','Paiement à 30 jours fin de mois\nValidité 30 jours',NULL,'2025-11-20 09:41:23','2025-11-20 09:41:23');

--
-- Table structure for table `ecritures_comptables`
--

DROP TABLE IF EXISTS `ecritures_comptables`;
CREATE TABLE `ecritures_comptables` (
  `id_ecriture` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `numero_ecriture` varchar(50) NOT NULL,
  `date` date NOT NULL,
  `journal` enum('ventes','achats','banque','caisse') NOT NULL,
  `compte` varchar(10) NOT NULL,
  `libelle` varchar(255) NOT NULL,
  `debit` decimal(15,2) DEFAULT 0.00,
  `credit` decimal(15,2) DEFAULT 0.00,
  `devise` varchar(3) DEFAULT 'MGA',
  `taux_change` decimal(10,4) DEFAULT 1.0000,
  `reference` varchar(255) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_ecriture`),
  UNIQUE KEY `ecritures_comptables_numero_ecriture_unique` (`numero_ecriture`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

--
-- Dumping data for table `ecritures_comptables`
--

INSERT INTO `ecritures_comptables` VALUES
(101,'202511-TEST-001','2025-11-21','ventes','701000','Vente de test',0.00,1000000.00,'MGA',1.0000,'TEST',NULL,'2025-11-21 06:56:16','2025-11-21 06:56:16'),
(102,'202511-TEST-002','2025-11-21','ventes','445710','TVA collectée',0.00,200000.00,'MGA',1.0000,'TEST',NULL,'2025-11-21 06:56:16','2025-11-21 06:56:16'),
(103,'202511-4-1','2025-11-21','ventes','411000','Facture 4 - mariot',3096000.00,0.00,'MGA',1.0000,'4',NULL,'2025-11-21 11:13:28','2025-11-21 11:13:28'),
(104,'202511-4-2','2025-11-21','ventes','445710','TVA Facture 4 - collectée',0.00,516000.00,'MGA',1.0000,'4',NULL,'2025-11-21 11:13:28','2025-11-21 11:13:28'),
(105,'202511-4-3','2025-11-21','ventes','701000','Facture 4 - Vente HT',0.00,2580000.00,'MGA',1.0000,'4',NULL,'2025-11-21 11:13:28','2025-11-21 11:13:28'),
(106,'202511-5-1','2025-11-21','ventes','411000','Facture 5 - mariot',3000000.00,0.00,'MGA',1.0000,'5',NULL,'2025-11-21 11:19:12','2025-11-21 11:19:12'),
(107,'202511-5-2','2025-11-21','ventes','445710','TVA Facture 5 - collectée',0.00,500000.00,'MGA',1.0000,'5',NULL,'2025-11-21 11:19:12','2025-11-21 11:19:12'),
(108,'202511-5-3','2025-11-21','ventes','701000','Facture 5 - Vente HT',0.00,2500000.00,'MGA',1.0000,'5',NULL,'2025-11-21 11:19:12','2025-11-21 11:19:12'),
(109,'202511-6-1','2025-11-21','achats','401000','Facture 6 - Fournisseur Import',0.00,3000000.00,'MGA',1.0000,'6',NULL,'2025-11-21 11:22:36','2025-11-21 11:22:36'),
(110,'202511-6-2','2025-11-21','achats','445620','TVA Facture 6 - déductible',500000.00,0.00,'MGA',1.0000,'6',NULL,'2025-11-21 11:22:36','2025-11-21 11:22:36'),
(111,'202511-6-3','2025-11-21','achats','607000','Facture 6 - Achat HT',2500000.00,0.00,'MGA',1.0000,'6',NULL,'2025-11-21 11:22:36','2025-11-21 11:22:36'),
(112,'202512-7-1','2025-12-10','ventes','411000','Facture 7 - mariot',13003200000.00,0.00,'USD',4200.0000,'7',NULL,'2025-12-10 17:29:25','2025-12-10 17:29:25'),
(113,'202512-7-2','2025-12-10','ventes','445710','TVA Facture 7 - collectée',0.00,2167200000.00,'USD',4200.0000,'7',NULL,'2025-12-10 17:29:25','2025-12-10 17:29:25'),
(114,'202512-7-3','2025-12-10','ventes','701000','Facture 7 - Vente HT',0.00,10836000000.00,'USD',4200.0000,'7',NULL,'2025-12-10 17:29:25','2025-12-10 17:29:25'),
(115,'202412-2-1','2024-12-15','ventes','411000','Facture 2 - Entreprise Service',650000.00,0.00,'MGA',1.0000,'2',NULL,'2025-12-10 17:49:28','2025-12-10 17:49:28'),
(116,'202412-2-3','2024-12-15','ventes','701000','Facture 2 - Vente HT',0.00,650000.00,'MGA',1.0000,'2',NULL,'2025-12-10 17:49:28','2025-12-10 17:49:28'),
(117,'202512-8-1','2025-12-11','ventes','411000','Facture 8 - Entreprise Service',18636000.00,0.00,'MGA',1.0000,'8',NULL,'2025-12-11 06:35:02','2025-12-11 06:35:02'),
(118,'202512-8-2','2025-12-11','ventes','445710','TVA Facture 8 - collectée',0.00,3106000.00,'MGA',1.0000,'8',NULL,'2025-12-11 06:35:02','2025-12-11 06:35:02'),
(119,'202512-8-3','2025-12-11','ventes','701000','Facture 8 - Vente HT',0.00,15530000.00,'MGA',1.0000,'8',NULL,'2025-12-11 06:35:02','2025-12-11 06:35:02'),
(120,'202512-9-1','2025-12-11','ventes','411000','Facture 9 - mariot',18000.00,0.00,'MGA',1.0000,'9',NULL,'2025-12-11 06:36:38','2025-12-11 06:36:38'),
(121,'202512-9-2','2025-12-11','ventes','445710','TVA Facture 9 - collectée',0.00,3000.00,'MGA',1.0000,'9',NULL,'2025-12-11 06:36:38','2025-12-11 06:36:38'),
(122,'202512-9-3','2025-12-11','ventes','701000','Facture 9 - Vente HT',0.00,15000.00,'MGA',1.0000,'9',NULL,'2025-12-11 06:36:38','2025-12-11 06:36:38'),
(123,'202512-14-1','2025-12-11','ventes','411000','Facture 14 - mariot',3000000.00,0.00,'MGA',1.0000,'14',NULL,'2025-12-11 17:33:30','2025-12-11 17:33:30'),
(124,'202512-14-2','2025-12-11','ventes','445710','TVA Facture 14 - collectée',0.00,500000.00,'MGA',1.0000,'14',NULL,'2025-12-11 17:33:30','2025-12-11 17:33:30'),
(125,'202512-14-3','2025-12-11','ventes','701000','Facture 14 - Vente HT',0.00,2500000.00,'MGA',1.0000,'14',NULL,'2025-12-11 17:33:30','2025-12-11 17:33:30'),
(126,'202512-13-1','2025-12-11','ventes','411000','Facture 13 - Client SARL',18000.00,0.00,'MGA',1.0000,'13',NULL,'2025-12-11 17:44:15','2025-12-11 17:44:15'),
(127,'202512-13-2','2025-12-11','ventes','445710','TVA Facture 13 - collectée',0.00,3000.00,'MGA',1.0000,'13',NULL,'2025-12-11 17:44:15','2025-12-11 17:44:15'),
(128,'202512-13-3','2025-12-11','ventes','701000','Facture 13 - Vente HT',0.00,15000.00,'MGA',1.0000,'13',NULL,'2025-12-11 17:44:15','2025-12-11 17:44:15'),
(129,'202512-15-1','2025-12-28','ventes','411000','Facture 15 - mariot',151200096000.00,0.00,'MGA',1.0000,'15',NULL,'2025-12-28 10:38:43','2025-12-28 10:38:43'),
(130,'202512-15-2','2025-12-28','ventes','445710','TVA Facture 15 - collectée',0.00,25200016000.00,'MGA',1.0000,'15',NULL,'2025-12-28 10:38:43','2025-12-28 10:38:43'),
(131,'202512-15-3','2025-12-28','ventes','701000','Facture 15 - Vente HT',0.00,126000080000.00,'MGA',1.0000,'15',NULL,'2025-12-28 10:38:43','2025-12-28 10:38:43'),
(132,'202512-12-1','2025-12-11','ventes','411000','Facture 12 - Entreprise Service',75600000.00,0.00,'USD',4200.0000,'12',NULL,'2025-12-28 10:40:25','2025-12-28 10:40:25'),
(133,'202512-12-2','2025-12-11','ventes','445710','TVA Facture 12 - collectée',0.00,12600000.00,'USD',4200.0000,'12',NULL,'2025-12-28 10:40:25','2025-12-28 10:40:25'),
(134,'202512-12-3','2025-12-11','ventes','701000','Facture 12 - Vente HT',0.00,63000000.00,'USD',4200.0000,'12',NULL,'2025-12-28 10:40:25','2025-12-28 10:40:25');

--
-- Table structure for table `expeditions`
--

DROP TABLE IF EXISTS `expeditions`;
CREATE TABLE `expeditions` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `commande_id` int(10) unsigned NOT NULL,
  `numero_bl` varchar(255) DEFAULT NULL,
  `numero_connaissement` varchar(255) DEFAULT NULL,
  `numero_packing_list` varchar(255) DEFAULT NULL,
  `date_expedition` date DEFAULT NULL,
  `date_arrivee_prevue` date DEFAULT NULL,
  `date_arrivee_reelle` date DEFAULT NULL,
  `transporteur` varchar(255) DEFAULT NULL,
  `transporteur_id` int(10) unsigned DEFAULT NULL,
  `mode_transport` varchar(50) DEFAULT NULL,
  `instructions_speciales` text DEFAULT NULL,
  `statut` enum('preparation','expédiée','transit','arrivée','livrée') DEFAULT 'preparation',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_expeditions_commande` (`commande_id`),
  KEY `idx_expedition_transporteur` (`transporteur_id`),
  CONSTRAINT `expeditions_ibfk_1` FOREIGN KEY (`transporteur_id`) REFERENCES `transporteurs` (`id`),
  CONSTRAINT `fk_expeditions_commande` FOREIGN KEY (`commande_id`) REFERENCES `commandes` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

--
-- Dumping data for table `expeditions`
--

INSERT INTO `expeditions` VALUES
(1,10,'BL-2024-001','CON-2024-001','PKG-IMPORT-2024-001','2024-01-20','2024-02-05','2024-02-03','Maersk Line',NULL,'maritime',NULL,'livrée','2025-11-12 09:03:40','2025-11-12 09:17:01'),
(2,11,'BL-EXPORT-2024-001','CON-EXPORT-2024-001','PKG-EXPORT-2024-001','2024-01-25','2024-02-10','2024-02-08','CMA CGM',NULL,'maritime','Fragile - Manipulation avec précaution','livrée','2025-11-12 09:16:33','2025-11-12 09:17:15'),
(3,24,'BL-123456','CON-123456','PL-321456','2025-11-13','2025-11-15',NULL,'transporteur test',NULL,'aerien','FRAGILE','expédiée','2025-11-13 14:25:39','2025-11-13 14:25:39'),
(4,13,'BL-555','CON-555','PL-123','2025-11-13','2025-11-14',NULL,'hj09gfg',NULL,'maritime','','transit','2025-11-13 14:27:33','2025-11-13 14:27:33'),
(5,21,'BL-666','CON-556','PL-556','2025-11-13','2025-11-22',NULL,'test test',NULL,'terrestre','','transit','2025-11-13 14:31:00','2025-11-13 14:31:00'),
(6,26,'BL-125855','CON-33333','PL-3654','2025-11-22','2025-11-23',NULL,'test',NULL,'aerien','fragile','preparation','2025-11-22 08:39:23','2025-11-22 08:39:23'),
(7,17,'BL-0000013','CON-0000013','PL-0000013','2025-11-22','2025-11-30',NULL,'Air France Cargo',3,'','kdkkdkdkdlfdfjsf-','transit','2025-11-22 13:08:36','2025-11-22 13:08:36');

--
-- Table structure for table `factures`
--

DROP TABLE IF EXISTS `factures`;
CREATE TABLE `factures` (
  `numero_facture` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `date` date NOT NULL,
  `type_facture` enum('proforma','facture','avoir','vente') NOT NULL,
  `id_tiers` int(10) unsigned NOT NULL,
  `echeance` date DEFAULT NULL,
  `reglement` varchar(50) DEFAULT NULL,
  `total_ht` decimal(15,2) DEFAULT 0.00,
  `total_tva` decimal(15,2) DEFAULT 0.00,
  `total_ttc` decimal(15,2) DEFAULT 0.00,
  `statut` enum('brouillon','validee','annulee') DEFAULT 'brouillon',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `devise` varchar(3) DEFAULT 'MGA',
  `taux_change` decimal(10,4) DEFAULT 1.0000,
  `notes` text DEFAULT NULL,
  `statut_paiement` varchar(20) DEFAULT 'non_paye',
  `type_paiement` varchar(20) DEFAULT 'comptant',
  `montant_paye` decimal(15,2) DEFAULT 0.00,
  `montant_restant` decimal(15,2) DEFAULT NULL,
  `date_finale_paiement` date DEFAULT NULL,
  `montant_minimum_paiement` decimal(15,2) DEFAULT 0.00,
  `penalite_retard` decimal(5,2) DEFAULT 0.00,
  PRIMARY KEY (`numero_facture`),
  KEY `factures_id_tiers_foreign` (`id_tiers`),
  CONSTRAINT `factures_id_tiers_foreign` FOREIGN KEY (`id_tiers`) REFERENCES `tiers` (`id_tiers`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

--
-- Dumping data for table `factures`
--

INSERT INTO `factures` VALUES
(1,'2024-12-01','facture',1,'2024-12-31','virement',2580000.00,516000.00,3096000.00,'validee','2025-11-21 06:56:16','2025-11-21 06:56:16','MGA',1.0000,NULL,'non_paye','comptant',0.00,NULL,NULL,0.00,0.00),
(2,'2024-12-15','proforma',3,'2025-01-15','cheque',650000.00,0.00,650000.00,'validee','2025-11-21 06:56:16','2025-12-10 17:49:28','MGA',1.0000,NULL,'non_paye','comptant',0.00,NULL,NULL,0.00,0.00),
(3,'2025-11-21','facture',4,'2025-12-21','virement',45000.00,9000.00,54000.00,'annulee','2025-11-21 10:56:49','2025-12-10 13:54:52','MGA',1.0000,NULL,'partiellement_payee','acompte',16200.00,37800.00,NULL,0.00,0.00),
(4,'2025-11-21','facture',4,'2025-12-21','virement',2580000.00,516000.00,3096000.00,'annulee','2025-11-21 11:13:27','2025-11-21 11:20:25','MGA',1.0000,NULL,'non_paye','comptant',0.00,3096000.00,NULL,0.00,0.00),
(5,'2025-11-21','facture',4,'2025-12-21','virement',2500000.00,500000.00,3000000.00,'validee','2025-11-21 11:19:12','2025-11-21 11:19:12','MGA',1.0000,NULL,'non_paye','flexible',0.00,3000000.00,'2025-11-22',100.00,0.00),
(6,'2025-11-21','facture',2,'2025-12-21','virement',2500000.00,500000.00,3000000.00,'validee','2025-11-21 11:22:35','2025-11-21 11:22:35','MGA',1.0000,NULL,'non_paye','flexible',0.00,3000000.00,'2025-11-23',1000.00,0.00),
(7,'2025-12-10','facture',4,'2026-01-09','virement',10836000000.00,2167200000.00,13003200000.00,'validee','2025-12-10 17:29:25','2025-12-10 17:29:25','USD',4200.0000,NULL,'non_paye','flexible',0.00,13003200000.00,'2025-12-13',420000.00,0.00),
(8,'2025-12-11','proforma',3,'2026-01-10','virement',15530000.00,3106000.00,18636000.00,'validee','2025-12-11 06:35:01','2025-12-11 06:35:02','MGA',1.0000,NULL,'non_paye','flexible',0.00,18636000.00,'2025-12-13',5000.00,0.00),
(9,'2025-12-11','facture',4,'2026-01-10','virement',15000.00,3000.00,18000.00,'validee','2025-12-11 06:36:38','2025-12-11 06:36:38','MGA',1.0000,NULL,'non_paye','flexible',0.00,18000.00,'2025-12-11',1000.00,0.00),
(10,'2025-12-11','facture',3,'2026-01-10','virement',15000.00,3000.00,18000.00,'brouillon','2025-12-11 07:20:22','2025-12-11 07:20:22','MGA',1.0000,NULL,'non_paye','comptant',0.00,18000.00,NULL,0.00,0.00),
(11,'2025-12-11','facture',3,'2026-01-10','virement',2500000.00,500000.00,3000000.00,'brouillon','2025-12-11 07:25:49','2025-12-11 07:25:49','MGA',1.0000,NULL,'non_paye','comptant',0.00,3000000.00,NULL,0.00,0.00),
(12,'2025-12-11','facture',3,'2026-01-10','virement',63000000.00,12600000.00,75600000.00,'validee','2025-12-11 07:31:56','2025-12-28 10:40:25','USD',4200.0000,NULL,'non_paye','comptant',0.00,75600000.00,NULL,0.00,0.00),
(13,'2025-12-11','facture',1,'2026-01-10','virement',15000.00,3000.00,18000.00,'validee','2025-12-11 07:35:45','2025-12-11 17:44:15','MGA',1.0000,NULL,'non_paye','comptant',0.00,18000.00,NULL,0.00,0.00),
(14,'2025-12-11','facture',4,'2026-01-10','virement',2500000.00,500000.00,3000000.00,'annulee','2025-12-11 07:49:39','2025-12-11 17:44:09','MGA',1.0000,NULL,'non_paye','comptant',0.00,3000000.00,NULL,0.00,0.00),
(15,'2025-12-28','facture',4,'2026-01-27','espece',126000080000.00,25200016000.00,151200096000.00,'annulee','2025-12-28 10:38:43','2025-12-28 10:40:12','MGA',1.0000,NULL,'non_paye','flexible',0.00,151200096000.00,'2025-12-29',5.00,0.00);

--
-- Table structure for table `knex_migrations`
--

DROP TABLE IF EXISTS `knex_migrations`;
CREATE TABLE `knex_migrations` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `batch` int(11) DEFAULT NULL,
  `migration_time` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

--
-- Dumping data for table `knex_migrations`
--

INSERT INTO `knex_migrations` VALUES
(1,'20251120000001_create_transporteurs_table.js',1,'2025-11-22 09:26:25'),
(2,'20251120000002_create_connaissements_table.js',1,'2025-11-22 09:26:25'),
(3,'20251120000003_update_expeditions_table.js',1,'2025-11-22 09:26:25');

--
-- Table structure for table `knex_migrations_lock`
--

DROP TABLE IF EXISTS `knex_migrations_lock`;
CREATE TABLE `knex_migrations_lock` (
  `index` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `is_locked` int(11) DEFAULT NULL,
  PRIMARY KEY (`index`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

--
-- Dumping data for table `knex_migrations_lock`
--

INSERT INTO `knex_migrations_lock` VALUES
(1,0);

--
-- Table structure for table `ligne_facture`
--

DROP TABLE IF EXISTS `ligne_facture`;
CREATE TABLE `ligne_facture` (
  `id_ligne` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `numero_facture` int(10) unsigned NOT NULL,
  `code_article` varchar(50) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `quantite` decimal(10,2) NOT NULL,
  `prix_unitaire` decimal(15,2) NOT NULL,
  `taux_tva` decimal(5,2) NOT NULL,
  `remise` decimal(5,2) DEFAULT 0.00,
  `montant_ht` decimal(15,2) NOT NULL,
  `montant_tva` decimal(15,2) NOT NULL,
  `montant_ttc` decimal(15,2) NOT NULL,
  PRIMARY KEY (`id_ligne`),
  KEY `ligne_facture_numero_facture_foreign` (`numero_facture`),
  KEY `ligne_facture_code_article_foreign` (`code_article`),
  CONSTRAINT `ligne_facture_code_article_foreign` FOREIGN KEY (`code_article`) REFERENCES `articles` (`code_article`),
  CONSTRAINT `ligne_facture_numero_facture_foreign` FOREIGN KEY (`numero_facture`) REFERENCES `factures` (`numero_facture`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

--
-- Dumping data for table `ligne_facture`
--

INSERT INTO `ligne_facture` VALUES
(1,1,'ART001','Ordinateur Portable Dell',1.00,2500000.00,20.00,0.00,2500000.00,500000.00,3000000.00),
(2,1,'ART002','Souris USB Logitech',2.00,15000.00,20.00,10.00,27000.00,5400.00,32400.00),
(3,1,'ART004','Maintenance installation',2.00,150000.00,20.00,0.00,300000.00,60000.00,360000.00),
(4,2,'ART005','Formation avancée',1.00,500000.00,0.00,0.00,500000.00,0.00,500000.00),
(5,2,'ART004','Support technique',1.00,150000.00,0.00,0.00,150000.00,0.00,150000.00),
(6,3,'ART002','Souris USB',1.00,15000.00,20.00,0.00,15000.00,3000.00,18000.00),
(7,3,'ART002','Souris USB',1.00,15000.00,20.00,0.00,15000.00,3000.00,18000.00),
(8,3,'ART002','Souris USB',1.00,15000.00,20.00,0.00,15000.00,3000.00,18000.00),
(9,4,'ART001','Ordinateur Portable',1.00,2500000.00,20.00,0.00,2500000.00,500000.00,3000000.00),
(10,4,'ART003','Clavier Mécanique',1.00,80000.00,20.00,0.00,80000.00,16000.00,96000.00),
(11,5,'ART001','Ordinateur Portable',1.00,2500000.00,20.00,0.00,2500000.00,500000.00,3000000.00),
(12,6,'ART001','Ordinateur Portable',1.00,2500000.00,20.00,0.00,2500000.00,500000.00,3000000.00),
(13,7,'ART001','Ordinateur Portable',1.00,10500000000.00,20.00,0.00,10500000000.00,2100000000.00,12600000000.00),
(14,7,'ART003','Clavier Mécanique',1.00,336000000.00,20.00,0.00,336000000.00,67200000.00,403200000.00),
(15,8,'ART004','Service Maintenance',103.00,150000.00,20.00,0.00,15450000.00,3090000.00,18540000.00),
(16,8,'ART003','Clavier Mécanique',1.00,80000.00,20.00,0.00,80000.00,16000.00,96000.00),
(17,9,'ART002','Souris USB',1.00,15000.00,20.00,0.00,15000.00,3000.00,18000.00),
(18,10,'ART002','Souris USB',1.00,15000.00,20.00,0.00,15000.00,3000.00,18000.00),
(19,11,'ART001','Ordinateur Portable',1.00,2500000.00,20.00,0.00,2500000.00,500000.00,3000000.00),
(20,12,'ART002','Souris USB',1.00,63000000.00,20.00,0.00,63000000.00,12600000.00,75600000.00),
(21,13,'ART002','Souris USB',1.00,15000.00,20.00,0.00,15000.00,3000.00,18000.00),
(22,14,'ART001','Ordinateur Portable',1.00,2500000.00,20.00,0.00,2500000.00,500000.00,3000000.00),
(23,15,'ART001','Ordinateur Portable',12.00,10500000000.00,20.00,0.00,126000000000.00,25200000000.00,151200000000.00),
(24,15,'ART003','Clavier Mécanique',1.00,80000.00,20.00,0.00,80000.00,16000.00,96000.00);

--
-- Table structure for table `lignes_commande`
--

DROP TABLE IF EXISTS `lignes_commande`;
CREATE TABLE `lignes_commande` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `commande_id` int(10) unsigned NOT NULL,
  `article_id` varchar(50) DEFAULT NULL,
  `description` varchar(255) NOT NULL,
  `quantite` decimal(10,2) NOT NULL,
  `prix_unitaire` decimal(15,2) NOT NULL,
  `taux_tva` decimal(5,2) DEFAULT 0.00,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_lignes_commande` (`commande_id`),
  KEY `fk_lignes_articles` (`article_id`),
  CONSTRAINT `fk_lignes_articles` FOREIGN KEY (`article_id`) REFERENCES `articles` (`code_article`),
  CONSTRAINT `fk_lignes_commande` FOREIGN KEY (`commande_id`) REFERENCES `commandes` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

--
-- Dumping data for table `lignes_commande`
--

INSERT INTO `lignes_commande` VALUES
(5,10,'ART001','Ordinateur Portable',2.00,2500000.00,20.00,'2025-11-12 08:59:57','2025-11-12 08:59:57'),
(6,10,'ART002','Souris USB',5.00,50000.00,20.00,'2025-11-12 08:59:57','2025-11-12 08:59:57'),
(7,11,'ART005','Formation Logiciel',10.00,100000.00,0.00,'2025-11-12 09:16:13','2025-11-12 09:16:13'),
(8,12,'ART003','Clavier Mécanique',50.00,150000.00,20.00,'2025-11-12 09:21:36','2025-11-12 09:21:36'),
(9,13,'ART004','Service Maintenance',5.00,500000.00,20.00,'2025-11-12 09:25:42','2025-11-12 09:25:42'),
(10,14,'ART002','Souris USB',1.00,15000.00,20.00,'2025-11-13 12:19:57','2025-11-13 12:19:57'),
(11,15,'ART004','Service Maintenance',1.00,150000.00,20.00,'2025-11-13 12:20:19','2025-11-13 12:20:19'),
(12,16,'ART001','Ordinateur Portable',1.00,2500000.00,20.00,'2025-11-13 12:20:39','2025-11-13 12:20:39'),
(13,17,'ART002','Souris USB',1.00,15000.00,20.00,'2025-11-13 12:21:01','2025-11-13 12:21:01'),
(14,18,'ART003','Clavier Mécanique',1.00,80000.00,20.00,'2025-11-13 12:21:26','2025-11-13 12:21:26'),
(15,19,'ART003','Clavier Mécanique',12.00,80000.00,20.00,'2025-11-13 12:37:34','2025-11-13 12:37:34'),
(16,20,'ART001','Ordinateur Portable',1.00,2500000.00,20.00,'2025-11-13 12:37:55','2025-11-13 12:37:55'),
(17,21,'ART001','Ordinateur Portable',1.00,2500000.00,20.00,'2025-11-13 13:54:50','2025-11-13 13:54:50'),
(18,21,'ART003','Clavier Mécanique',1.00,80000.00,20.00,'2025-11-13 13:54:50','2025-11-13 13:54:50'),
(19,22,'ART001','Ordinateur Portable',1.00,2500000.00,20.00,'2025-11-13 13:59:43','2025-11-13 13:59:43'),
(20,22,'ART003','Clavier Mécanique',13.00,80000.00,20.00,'2025-11-13 13:59:43','2025-11-13 13:59:43'),
(21,23,'ART001','Ordinateur Portable',1.00,2500000.00,20.00,'2025-11-13 14:01:01','2025-11-13 14:01:01'),
(22,23,'ART003','Clavier Mécanique',13.00,80000.00,20.00,'2025-11-13 14:01:01','2025-11-13 14:01:01'),
(23,24,'ART003','Clavier Mécanique',12.00,80000.00,20.00,'2025-11-13 14:01:47','2025-11-13 14:01:47'),
(24,25,'ART002','Souris USB',100.00,15000.00,20.00,'2025-11-21 11:26:21','2025-11-21 11:26:21'),
(25,26,'ART002','Souris USB',100.00,15000.00,20.00,'2025-11-21 11:26:40','2025-11-21 11:26:40'),
(26,27,'ART001','Moteur marin',2.00,5000000.00,20.00,'2025-12-29 09:48:00','2025-12-29 09:48:00');

--
-- Table structure for table `paiements`
--

DROP TABLE IF EXISTS `paiements`;
CREATE TABLE `paiements` (
  `id_paiement` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `numero_facture` int(10) unsigned NOT NULL,
  `date_paiement` date NOT NULL,
  `montant` decimal(15,2) NOT NULL,
  `mode_paiement` enum('espèce','virement','chèque','carte') NOT NULL,
  `reference` varchar(255) DEFAULT NULL,
  `statut` enum('validé','en_attente','annulé') DEFAULT 'validé',
  `devise` varchar(3) DEFAULT 'MGA',
  `taux_change` decimal(10,4) DEFAULT 1.0000,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_paiement`),
  KEY `paiements_numero_facture_foreign` (`numero_facture`),
  CONSTRAINT `paiements_numero_facture_foreign` FOREIGN KEY (`numero_facture`) REFERENCES `factures` (`numero_facture`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

--
-- Dumping data for table `paiements`
--

INSERT INTO `paiements` VALUES
(1,11,'2025-11-05',20000.00,'virement','TEST-001','validé','MGA',1.0000,NULL,'2025-11-05 14:23:26','2025-11-05 14:23:26'),
(2,11,'2025-11-05',50000.00,'virement','SOLDE-003','validé','MGA',1.0000,NULL,'2025-11-05 14:25:16','2025-11-05 14:25:16'),
(11,12,'2025-11-05',54000.00,'virement','FINAL-001','validé','MGA',1.0000,NULL,'2025-11-05 14:53:49','2025-11-05 14:53:49'),
(12,12,'2025-11-05',72000.00,'espèce','FINAL-002','validé','MGA',1.0000,NULL,'2025-11-05 14:54:03','2025-11-05 14:54:03'),
(13,12,'2025-11-05',54000.00,'chèque','FINAL-003','validé','MGA',1.0000,NULL,'2025-11-05 14:54:18','2025-11-05 14:54:18'),
(14,15,'2025-11-05',50000.00,'virement','STATUT-TEST-1','validé','MGA',1.0000,NULL,'2025-11-05 15:03:46','2025-11-05 15:03:46'),
(15,15,'2025-11-05',70000.00,'virement','STATUT-TEST-2','validé','MGA',1.0000,NULL,'2025-11-05 15:03:46','2025-11-05 15:03:46'),
(16,1,'2024-01-20',50000.00,'virement','TEST-PAY-001','validé','MGA',1.0000,NULL,'2025-11-06 04:27:28','2025-11-06 04:27:28'),
(17,19,'2024-01-20',1000000.00,'virement','TEST-PAY-001','validé','MGA',1.0000,NULL,'2025-11-06 04:29:32','2025-11-06 04:29:32'),
(22,21,'2024-01-15',50000.00,'virement','NEW-FLEX-1','validé','MGA',1.0000,NULL,'2025-11-06 04:36:13','2025-11-06 04:36:13'),
(23,21,'2024-02-01',142000.00,'espèce','NEW-FLEX-2','validé','MGA',1.0000,NULL,'2025-11-06 04:36:13','2025-11-06 04:36:13'),
(26,22,'2024-02-10',50000.00,'virement','TRIGGER-FLEX-1','validé','MGA',1.0000,NULL,'2025-11-06 04:47:39','2025-11-06 04:47:39'),
(27,22,'2024-02-20',130000.00,'espèce','TRIGGER-FLEX-2','validé','MGA',1.0000,NULL,'2025-11-06 04:47:39','2025-11-06 04:47:39'),
(31,26,'2024-01-20',54000.00,'virement','PAIEMENT-1','validé','MGA',1.0000,NULL,'2025-11-07 04:26:22','2025-11-07 04:26:22'),
(32,26,'2024-02-15',72000.00,'espèce','PAIEMENT-2','validé','MGA',1.0000,NULL,'2025-11-07 04:26:22','2025-11-07 04:26:22'),
(33,26,'2024-03-10',54000.00,'chèque','PAIEMENT-3','validé','MGA',1.0000,NULL,'2025-11-07 04:26:23','2025-11-07 04:26:23'),
(34,11,'2025-11-07',50000.00,'espèce','COMPLETION-11-1762496448181','validé','MGA',1.0000,NULL,'2025-11-07 06:21:12','2025-11-07 06:21:12'),
(35,6,'2025-11-07',6000000.00,'virement','COMPLETION-6-1762500426457','validé','MGA',1.0000,NULL,'2025-11-07 07:27:15','2025-11-07 07:27:15'),
(36,1,'2024-01-20',50000.00,'espèce','TEST-ESPECE-001','validé','MGA',1.0000,NULL,'2025-11-11 04:44:08','2025-11-11 04:44:08'),
(37,3,'2024-01-20',100000.00,'virement','TEST-VIR-001','validé','MGA',1.0000,NULL,'2025-11-11 04:44:09','2025-11-11 04:44:09'),
(38,5,'2024-01-20',50000.00,'chèque','TEST-CHEQUE-001','validé','MGA',1.0000,NULL,'2025-11-11 04:44:10','2025-11-11 04:44:10'),
(39,1,'2024-01-20',15000.00,'espèce','TEST-FINAL-CORRECTION','validé','MGA',1.0000,NULL,'2025-11-11 04:53:08','2025-11-11 04:53:08'),
(40,1,'2024-01-20',20000.00,'espèce','TEST-DEBUG-CAISSE','validé','MGA',1.0000,NULL,'2025-11-11 04:55:14','2025-11-11 04:55:14'),
(41,1,'2024-01-20',25000.00,'espèce','TEST-SANS-ACCENT','validé','MGA',1.0000,NULL,'2025-11-11 04:57:38','2025-11-11 04:57:38'),
(42,3,'2024-01-20',30000.00,'espèce','TEST-AVEC-ACCENT','validé','MGA',1.0000,NULL,'2025-11-11 04:57:39','2025-11-11 04:57:39');

--
-- Trigger for table `paiements`
--

DELIMITER $$
CREATE TRIGGER after_paiement_insert 
AFTER INSERT ON paiements
FOR EACH ROW
BEGIN
    DECLARE total_paiements DECIMAL(15,2);
    DECLARE total_facture DECIMAL(15,2);
    DECLARE nouveau_statut VARCHAR(20);
    DECLARE date_finale DATE;
    
    SELECT COALESCE(SUM(montant), 0) INTO total_paiements 
    FROM paiements 
    WHERE numero_facture = NEW.numero_facture AND statut = 'validé';
    
    SELECT total_ttc, date_finale_paiement INTO total_facture, date_finale
    FROM factures 
    WHERE numero_facture = NEW.numero_facture;
    
    IF total_paiements >= total_facture THEN
        SET nouveau_statut = 'payee';
    ELSEIF total_paiements > 0 THEN
        IF date_finale IS NOT NULL AND CURDATE() > date_finale THEN
            SET nouveau_statut = 'en_retard';
        ELSE
            SET nouveau_statut = 'partiellement_payee';
        END IF;
    ELSE
        SET nouveau_statut = 'non_paye';
    END IF;
    
    UPDATE factures 
    SET statut_paiement = nouveau_statut,
        montant_paye = total_paiements,
        montant_restant = total_facture - total_paiements,
        updated_at = NOW()
    WHERE numero_facture = NEW.numero_facture;
END$$
DELIMITER ;

--
-- Table structure for table `permissions`
--

DROP TABLE IF EXISTS `permissions`;
CREATE TABLE `permissions` (
  `id_permission` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `module` varchar(50) NOT NULL,
  `action` varchar(50) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_permission`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

--
-- Dumping data for table `permissions`
--

INSERT INTO `permissions` VALUES
(1,'comptabilite','read','Lecture des données comptables','2025-11-21 06:56:15'),
(2,'comptabilite','write','Écriture des données comptables','2025-11-21 06:56:15'),
(3,'crm','read','Lecture des données CRM','2025-11-21 06:56:15'),
(4,'crm','write','Écriture des données CRM','2025-11-21 06:56:15'),
(5,'import-export','read','Lecture des données import/export','2025-11-21 06:56:15'),
(6,'import-export','write','Écriture des données import/export','2025-11-21 06:56:15'),
(7,'admin','read','Accès administration','2025-11-21 06:56:15'),
(8,'admin','write','Gestion administration','2025-11-21 06:56:15');

--
-- Table structure for table `plan_comptable`
--

DROP TABLE IF EXISTS `plan_comptable`;
CREATE TABLE `plan_comptable` (
  `numero_compte` varchar(6) NOT NULL,
  `libelle` varchar(100) NOT NULL,
  `type_compte` enum('actif','passif','charge','produit') NOT NULL,
  `categorie` varchar(50) DEFAULT NULL,
  `actif` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`numero_compte`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

--
-- Dumping data for table `plan_comptable`
--

INSERT INTO `plan_comptable` VALUES
('401000','Fournisseurs','passif','fournisseur',1,'2025-11-05 04:37:45','2025-11-05 04:37:45'),
('411000','Clients','actif','client',1,'2025-11-05 04:37:45','2025-11-05 04:37:45'),
('445620','TVA déductible','actif','tva',1,'2025-11-05 04:37:45','2025-11-05 04:37:45'),
('445710','TVA collectée','passif','tva',1,'2025-11-05 04:37:45','2025-11-05 04:37:45'),
('512000','Banque','actif','banque',1,'2025-11-05 04:37:45','2025-11-05 04:37:45'),
('530000','Caisse','actif','caisse',1,'2025-11-05 04:37:45','2025-11-05 04:37:45'),
('607000','Achats de marchandises','charge','achat',1,'2025-11-05 04:37:45','2025-11-05 04:37:45'),
('701000','Ventes de produits','produit','vente',1,'2025-11-05 04:37:45','2025-11-05 04:37:45');

--
-- Table structure for table `referentiel_modes_paiement`
--

DROP TABLE IF EXISTS `referentiel_modes_paiement`;
CREATE TABLE `referentiel_modes_paiement` (
  `code` varchar(20) NOT NULL,
  `libelle` varchar(50) NOT NULL,
  `actif` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

--
-- Dumping data for table `referentiel_modes_paiement`
--

INSERT INTO `referentiel_modes_paiement` VALUES
('carte','Carte',1,'2025-11-05 04:37:46','2025-11-05 04:37:46'),
('cheque','Chèque',1,'2025-11-05 04:37:46','2025-11-05 04:37:46'),
('espece','Espèce',1,'2025-11-05 04:37:46','2025-11-05 04:37:46'),
('virement','Virement',1,'2025-11-05 04:37:46','2025-11-05 04:37:46');

--
-- Table structure for table `referentiel_taux_tva`
--

DROP TABLE IF EXISTS `referentiel_taux_tva`;
CREATE TABLE `referentiel_taux_tva` (
  `taux` decimal(5,2) NOT NULL,
  `libelle` varchar(50) NOT NULL,
  `actif` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`taux`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

--
-- Dumping data for table `referentiel_taux_tva`
--

INSERT INTO `referentiel_taux_tva` VALUES
(0.00,'Exonéré',1,'2025-11-05 04:37:46','2025-11-05 04:37:46'),
(5.00,'TVA 5%',1,'2025-11-05 04:37:46','2025-11-05 04:37:46'),
(10.00,'TVA 10%',1,'2025-11-05 04:37:46','2025-11-05 04:37:46'),
(20.00,'TVA 20%',1,'2025-11-05 04:37:46','2025-11-05 04:37:46');

--
-- Table structure for table `referentiel_types_facture`
--

DROP TABLE IF EXISTS `referentiel_types_facture`;
CREATE TABLE `referentiel_types_facture` (
  `code` varchar(20) NOT NULL,
  `libelle` varchar(50) NOT NULL,
  `actif` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

--
-- Dumping data for table `referentiel_types_facture`
--

INSERT INTO `referentiel_types_facture` VALUES
('avoir','Avoir',1,'2025-11-05 04:37:45','2025-11-05 04:37:45'),
('facture','Facture',1,'2025-11-05 04:37:45','2025-11-05 04:37:45'),
('proforma','Proforma',1,'2025-11-05 04:37:45','2025-11-05 04:37:45');

--
-- Table structure for table `relances`
--

DROP TABLE IF EXISTS `relances`;
CREATE TABLE `relances` (
  `id_relance` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `tiers_id` int(10) unsigned NOT NULL,
  `type_relance` varchar(50) NOT NULL,
  `objet` varchar(255) NOT NULL,
  `message` text DEFAULT NULL,
  `date_relance` date NOT NULL,
  `echeance` date DEFAULT NULL,
  `statut` enum('en_attente','envoyee','traitee','annulee') DEFAULT 'en_attente',
  `canal` enum('email','telephone','courrier','sms') DEFAULT 'email',
  `facture_id` int(10) unsigned DEFAULT NULL,
  `contrat_id` int(10) unsigned DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_relance`),
  KEY `relances_tiers_id_foreign` (`tiers_id`),
  KEY `relances_contrat_id_foreign` (`contrat_id`),
  KEY `relances_facture_id_foreign` (`facture_id`),
  CONSTRAINT `relances_contrat_id_foreign` FOREIGN KEY (`contrat_id`) REFERENCES `contrats` (`id_contrat`),
  CONSTRAINT `relances_facture_id_foreign` FOREIGN KEY (`facture_id`) REFERENCES `factures` (`numero_facture`),
  CONSTRAINT `relances_tiers_id_foreign` FOREIGN KEY (`tiers_id`) REFERENCES `tiers` (`id_tiers`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

--
-- Dumping data for table `relances`
--

INSERT INTO `relances` VALUES
(1,2,'paiement','Relance paiement - Facture 23','Cher client, votre facture 23 d\'un montant de 30000.00 MGA est en retard de paiement.','2025-11-16','2025-11-15','en_attente','email',23,NULL,'2025-11-16 06:42:37','2025-11-16 06:42:37'),
(2,2,'paiement','Relance paiement - Facture 25','Cher client, votre facture 25 d\'un montant de 1080000.00 MGA est en retard de paiement.','2025-11-16','2025-11-15','en_attente','email',25,NULL,'2025-11-16 06:42:38','2025-11-16 06:42:38'),
(4,1,'paiement','Relance facture F2024-00123','Bonjour, nous vous rappelons que votre facture est impayée.','2024-11-16','2024-11-30','en_attente','email',27,NULL,'2025-11-17 04:56:26','2025-11-17 04:56:26'),
(5,1,'paiement','Rappel facture impayée','Cher client, nous vous rappelons que votre facture n°29 d un montant de 136,836,000,000 MGA est impayée. Merci de régulariser votre situation.','2024-11-17','2024-11-24','envoyee','email',29,NULL,'2025-11-17 15:00:00','2025-11-17 15:02:10'),
(6,1,'contrat','Échéance contrat maintenance','Votre contrat de maintenance CONT-2024-001 arrive à échéance le 2025-11-30. Souhaitez-vous le renouveler ? Nous restons à votre disposition pour en discuter.','2024-11-17','2025-11-30','en_attente','email',NULL,1,'2025-11-17 15:01:44','2025-11-17 15:01:44'),
(7,1,'paiement_urgent','Relance téléphonique - Facture impayée','Appel effectué le 17/11/2024 à 14h00. M. Martin informé des pénalités de retard. Promet de régulariser sous 48h.','2024-11-17','2024-11-19','traitee','telephone',29,NULL,'2025-11-17 15:04:28','2025-11-17 15:04:28'),
(8,1,'rappel','Rappel SMS - Paiement en attente','RAPPEL: Facture n°29 impayée. Merci de régulariser. Service Client','2024-11-17','2024-11-20','envoyee','sms',29,NULL,'2025-11-17 15:04:40','2025-11-17 15:04:40'),
(9,1,'paiement_urgent','Relance téléphonique - Facture impayée','Appel effectué. Client promet régularisation sous 48h.','2024-11-17','2024-11-19','traitee','telephone',29,NULL,'2025-11-17 15:05:09','2025-11-17 15:05:09');

--
-- Table structure for table `role_permissions`
--

DROP TABLE IF EXISTS `role_permissions`;
CREATE TABLE `role_permissions` (
  `id_role_permission` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `id_role` int(10) unsigned NOT NULL,
  `id_permission` int(10) unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_role_permission`),
  UNIQUE KEY `unique_role_permission` (`id_role`,`id_permission`),
  KEY `id_permission` (`id_permission`),
  CONSTRAINT `role_permissions_ibfk_1` FOREIGN KEY (`id_role`) REFERENCES `roles` (`id_role`),
  CONSTRAINT `role_permissions_ibfk_2` FOREIGN KEY (`id_permission`) REFERENCES `permissions` (`id_permission`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

--
-- Dumping data for table `role_permissions`
--

INSERT INTO `role_permissions` VALUES
(1,7,1,'2025-11-21 06:56:15'),
(2,7,2,'2025-11-21 06:56:15'),
(3,7,3,'2025-11-21 06:56:15'),
(4,7,4,'2025-11-21 06:56:15'),
(5,7,5,'2025-11-21 06:56:15'),
(6,7,6,'2025-11-21 06:56:15'),
(7,7,7,'2025-11-21 06:56:15'),
(8,7,8,'2025-11-21 06:56:15'),
(9,8,1,'2025-11-21 06:56:15'),
(10,8,2,'2025-11-21 06:56:15'),
(11,9,3,'2025-11-21 06:56:15'),
(12,9,4,'2025-11-21 06:56:15'),
(13,9,5,'2025-11-21 06:56:15'),
(14,9,6,'2025-11-21 06:56:15');

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
CREATE TABLE `roles` (
  `id_role` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `code_role` varchar(50) NOT NULL,
  `nom_role` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_role`),
  UNIQUE KEY `code_role` (`code_role`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` VALUES
(7,'admin','Administrateur','Accès complet au système','2025-11-21 06:56:14','2025-11-21 06:56:14'),
(8,'comptable','Comptable','Gestion de la comptabilité','2025-11-21 06:56:14','2025-11-21 06:56:14'),
(9,'commercial','Commercial','Gestion commerciale et CRM','2025-11-21 06:56:14','2025-11-21 06:56:14');

--
-- Table structure for table `taux_change`
--

DROP TABLE IF EXISTS `taux_change`;
CREATE TABLE `taux_change` (
  `id_taux` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `devise_source` varchar(3) NOT NULL,
  `devise_cible` varchar(3) NOT NULL,
  `taux` decimal(10,4) NOT NULL,
  `date_effet` date NOT NULL,
  `actif` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_taux`),
  UNIQUE KEY `taux_change_devise_source_devise_cible_date_effet_unique` (`devise_source`,`devise_cible`,`date_effet`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

--
-- Dumping data for table `taux_change`
--

INSERT INTO `taux_change` VALUES
(36,'EUR','MGA',4500.0000,'2025-11-21',0,'2025-11-21 06:56:16','2025-11-21 06:56:16'),
(37,'USD','MGA',4200.0000,'2025-11-21',1,'2025-11-21 06:56:16','2025-11-21 06:56:16'),
(38,'MGA','EUR',0.0002,'2025-11-21',1,'2025-11-21 06:56:16','2025-11-21 06:56:16'),
(39,'MGA','USD',0.0002,'2025-11-21',1,'2025-11-21 06:56:16','2025-11-21 06:56:16'),
(40,'EUR','USD',1.0700,'2025-11-21',1,'2025-11-21 06:56:16','2025-11-21 06:56:16'),
(41,'USD','EUR',0.9300,'2025-11-21',1,'2025-11-21 06:56:16','2025-11-21 06:56:16'),
(42,'EUR','MGA',4550.0000,'2025-11-22',0,'2025-11-22 07:26:27','2025-11-22 07:26:27');

--
-- Table structure for table `tiers`
--

DROP TABLE IF EXISTS `tiers`;
CREATE TABLE `tiers` (
  `id_tiers` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `type_tiers` enum('client','fournisseur') NOT NULL,
  `nom` varchar(255) NOT NULL,
  `numero` varchar(50) DEFAULT NULL,
  `siret` varchar(14) DEFAULT NULL,
  `forme_juridique` varchar(100) DEFAULT NULL,
  `secteur_activite` varchar(100) DEFAULT NULL,
  `categorie` enum('prospect','client','fournisseur','partenaire') DEFAULT NULL,
  `chiffre_affaires_annuel` int(11) DEFAULT NULL,
  `effectif` int(11) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `site_web` varchar(255) DEFAULT NULL,
  `responsable_commercial` varchar(255) DEFAULT NULL,
  `date_premier_contact` date DEFAULT NULL,
  `date_derniere_activite` date DEFAULT NULL,
  `adresse` text DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `telephone` varchar(20) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `devise_preferee` varchar(3) DEFAULT 'MGA',
  PRIMARY KEY (`id_tiers`),
  UNIQUE KEY `tiers_numero_unique` (`numero`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

--
-- Dumping data for table `tiers`
--

INSERT INTO `tiers` VALUES
(1,'client','Client SARL','CLI001',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'123 Avenue de l\'Indépendance, Antananarivo','client@sarl.mg','+261 34 12 345 67','2025-11-21 06:56:16','2025-11-21 06:56:16','MGA'),
(2,'fournisseur','Fournisseur Import','FRN001',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'456 Rue du Commerce, Tamatave','contact@import.mg','+261 33 12 345 68','2025-11-21 06:56:16','2025-11-21 06:56:16','MGA'),
(3,'client','Entreprise Service','CLI002',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'789 Boulevard de France, Antsirabe','info@service.mg','+261 32 12 345 69','2025-11-21 06:56:16','2025-11-21 06:56:16','MGA'),
(4,'client','mariot','CLI-7',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'itaosy','mariotfanantenana@gmail.com','+261343074623','2025-11-21 10:54:44','2025-11-21 10:55:24','MGA');

--
-- Table structure for table `transporteurs`
--

DROP TABLE IF EXISTS `transporteurs`;
CREATE TABLE `transporteurs` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `nom` varchar(255) NOT NULL,
  `type_transport` varchar(50) DEFAULT NULL,
  `contact` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `telephone` varchar(50) DEFAULT NULL,
  `adresse` text DEFAULT NULL,
  `code_transporteur` varchar(50) DEFAULT NULL,
  `actif` tinyint(1) DEFAULT 1,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code_transporteur` (`code_transporteur`),
  KEY `idx_transporteur_nom` (`nom`),
  KEY `idx_transporteur_type` (`type_transport`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

--
-- Dumping data for table `transporteurs`
--

INSERT INTO `transporteurs` VALUES
(1,'Maersk Line','maritime','Jean Dupont','contact@maersk.com','+261 20 22 123 45',NULL,'TRP-0001',1,'2025-11-22 09:27:46','2025-11-22 09:27:46'),
(2,'CMA CGM','maritime','Marie Martin','info@cmacgm.com','+261 20 22 234 56',NULL,'TRP-0002',1,'2025-11-22 09:27:46','2025-11-22 09:27:46'),
(3,'Air France Cargo','aerien','Paul Bernard','cargo@airfrance.com','+261 20 22 345 67',NULL,'TRP-0003',1,'2025-11-22 09:27:46','2025-11-22 09:27:46'),
(4,'DHL Express','aerien','Sophie Leroy','express@dhl.com','+261 20 22 456 78',NULL,'TRP-0004',1,'2025-11-22 09:27:46','2025-11-22 09:27:46'),
(5,'Maersk Line Madagascar','maritime','Jean Rakoto','contact@maersk.mg','+261 20 22 123 45','Port de Toamasina, Madagascar','TRP-0005',1,'2025-11-22 09:44:57','2025-11-22 09:44:57');

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id_user` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `nom` varchar(100) NOT NULL,
  `prenom` varchar(100) NOT NULL,
  `id_role` int(10) unsigned NOT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `last_login` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_user`),
  UNIQUE KEY `email` (`email`),
  KEY `id_role` (`id_role`),
  CONSTRAINT `users_ibfk_1` FOREIGN KEY (`id_role`) REFERENCES `roles` (`id_role`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

--
-- Dumping data for table `users`
--

INSERT INTO `users` VALUES
(1,'admin@aquatiko.mg','$2b$12$/lONMYu6lzkB/8QryD56AO7oylXhu04Lmqrn3taVZY2hBXa9HoHde','Admin','Principal',7,1,NULL,'2025-11-21 06:56:15','2025-11-21 06:56:15'),
(2,'comptable@aquatiko.mg','$2b$12$/lONMYu6lzkB/8QryD56AO7oylXhu04Lmqrn3taVZY2hBXa9HoHde','Comptable','Marie',8,1,NULL,'2025-11-21 06:56:15','2025-11-21 06:56:15'),
(3,'commercial@aquatiko.mg','$2b$12$/lONMYu6lzkB/8QryD56AO7oylXhu04Lmqrn3taVZY2hBXa9HoHde','Commercial','Pierre',9,1,NULL,'2025-11-21 06:56:15','2025-11-21 06:56:15');

SET FOREIGN_KEY_CHECKS = 1;