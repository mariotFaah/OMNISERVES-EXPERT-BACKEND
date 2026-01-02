/*M!999999\- enable the sandbox mode */ 
-- MariaDB dump 10.19-11.8.3-MariaDB, for debian-linux-gnu (x86_64)
--
-- Host: localhost    Database: gestion_entreprise
-- ------------------------------------------------------
-- Server version	11.8.3-MariaDB-0+deb13u1 from Debian

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*M!100616 SET @OLD_NOTE_VERBOSITY=@@NOTE_VERBOSITY, NOTE_VERBOSITY=0 */;

--
-- Table structure for table `activites`
--

DROP TABLE IF EXISTS `activites`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
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
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id_activite`),
  KEY `activites_tiers_id_foreign` (`tiers_id`),
  CONSTRAINT `activites_tiers_id_foreign` FOREIGN KEY (`tiers_id`) REFERENCES `tiers` (`id_tiers`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `articles`
--

DROP TABLE IF EXISTS `articles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `articles` (
  `code_article` varchar(50) NOT NULL,
  `description` varchar(255) NOT NULL,
  `prix_unitaire` decimal(15,2) NOT NULL,
  `taux_tva` decimal(5,2) DEFAULT 20.00,
  `unite` varchar(20) DEFAULT 'unite',
  `actif` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `devise` varchar(3) DEFAULT 'MGA',
  `quantite_stock` int(11) NOT NULL DEFAULT 0,
  `seuil_alerte` int(11) NOT NULL DEFAULT 5,
  PRIMARY KEY (`code_article`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `commandes`
--

DROP TABLE IF EXISTS `commandes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
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
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `commandes_numero_commande_unique` (`numero_commande`),
  KEY `fk_commandes_client` (`client_id`),
  KEY `fk_commandes_fournisseur` (`fournisseur_id`),
  CONSTRAINT `fk_commandes_client` FOREIGN KEY (`client_id`) REFERENCES `tiers` (`id_tiers`),
  CONSTRAINT `fk_commandes_fournisseur` FOREIGN KEY (`fournisseur_id`) REFERENCES `tiers` (`id_tiers`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `connaissements`
--

DROP TABLE IF EXISTS `connaissements`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
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
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `numero_connaissement` (`numero_connaissement`),
  KEY `idx_connaissement_numero` (`numero_connaissement`),
  KEY `idx_connaissement_expedition` (`expedition_id`),
  KEY `idx_connaissement_transporteur` (`transporteur_id`),
  KEY `idx_connaissement_statut` (`statut`),
  CONSTRAINT `connaissements_ibfk_1` FOREIGN KEY (`expedition_id`) REFERENCES `expeditions` (`id`),
  CONSTRAINT `connaissements_ibfk_2` FOREIGN KEY (`transporteur_id`) REFERENCES `transporteurs` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `contacts`
--

DROP TABLE IF EXISTS `contacts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
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
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id_contact`),
  KEY `contacts_tiers_id_foreign` (`tiers_id`),
  CONSTRAINT `contacts_tiers_id_foreign` FOREIGN KEY (`tiers_id`) REFERENCES `tiers` (`id_tiers`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `contrats`
--

DROP TABLE IF EXISTS `contrats`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
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
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id_contrat`),
  UNIQUE KEY `contrats_numero_contrat_unique` (`numero_contrat`),
  KEY `contrats_tiers_id_foreign` (`tiers_id`),
  KEY `contrats_devis_id_foreign` (`devis_id`),
  CONSTRAINT `contrats_devis_id_foreign` FOREIGN KEY (`devis_id`) REFERENCES `devis` (`id_devis`),
  CONSTRAINT `contrats_tiers_id_foreign` FOREIGN KEY (`tiers_id`) REFERENCES `tiers` (`id_tiers`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `couts_logistiques`
--

DROP TABLE IF EXISTS `couts_logistiques`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
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
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `fk_couts_commande` (`commande_id`),
  CONSTRAINT `fk_couts_commande` FOREIGN KEY (`commande_id`) REFERENCES `commandes` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `devis`
--

DROP TABLE IF EXISTS `devis`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
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
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id_devis`),
  UNIQUE KEY `devis_numero_devis_unique` (`numero_devis`),
  KEY `devis_tiers_id_foreign` (`tiers_id`),
  CONSTRAINT `devis_tiers_id_foreign` FOREIGN KEY (`tiers_id`) REFERENCES `tiers` (`id_tiers`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `ecritures_comptables`
--

DROP TABLE IF EXISTS `ecritures_comptables`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
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
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id_ecriture`),
  UNIQUE KEY `ecritures_comptables_numero_ecriture_unique` (`numero_ecriture`)
) ENGINE=InnoDB AUTO_INCREMENT=112 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `expeditions`
--

DROP TABLE IF EXISTS `expeditions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
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
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `fk_expeditions_commande` (`commande_id`),
  KEY `idx_expedition_transporteur` (`transporteur_id`),
  CONSTRAINT `expeditions_ibfk_1` FOREIGN KEY (`transporteur_id`) REFERENCES `transporteurs` (`id`),
  CONSTRAINT `fk_expeditions_commande` FOREIGN KEY (`commande_id`) REFERENCES `commandes` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `factures`
--

DROP TABLE IF EXISTS `factures`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
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
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
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
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `knex_migrations`
--

DROP TABLE IF EXISTS `knex_migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `knex_migrations` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `batch` int(11) DEFAULT NULL,
  `migration_time` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `knex_migrations_lock`
--

DROP TABLE IF EXISTS `knex_migrations_lock`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `knex_migrations_lock` (
  `index` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `is_locked` int(11) DEFAULT NULL,
  PRIMARY KEY (`index`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `ligne_facture`
--

DROP TABLE IF EXISTS `ligne_facture`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
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
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `lignes_commande`
--

DROP TABLE IF EXISTS `lignes_commande`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `lignes_commande` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `commande_id` int(10) unsigned NOT NULL,
  `article_id` varchar(50) DEFAULT NULL,
  `description` varchar(255) NOT NULL,
  `quantite` decimal(10,2) NOT NULL,
  `prix_unitaire` decimal(15,2) NOT NULL,
  `taux_tva` decimal(5,2) DEFAULT 0.00,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `fk_lignes_commande` (`commande_id`),
  KEY `fk_lignes_articles` (`article_id`),
  CONSTRAINT `fk_lignes_articles` FOREIGN KEY (`article_id`) REFERENCES `articles` (`code_article`),
  CONSTRAINT `fk_lignes_commande` FOREIGN KEY (`commande_id`) REFERENCES `commandes` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `paiements`
--

DROP TABLE IF EXISTS `paiements`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
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
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id_paiement`),
  KEY `paiements_numero_facture_foreign` (`numero_facture`),
  CONSTRAINT `paiements_numero_facture_foreign` FOREIGN KEY (`numero_facture`) REFERENCES `factures` (`numero_facture`)
) ENGINE=InnoDB AUTO_INCREMENT=43 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_uca1400_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER after_paiement_insert 
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
    
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `permissions`
--

DROP TABLE IF EXISTS `permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `permissions` (
  `id_permission` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `module` varchar(50) NOT NULL,
  `action` varchar(50) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id_permission`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `plan_comptable`
--

DROP TABLE IF EXISTS `plan_comptable`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `plan_comptable` (
  `numero_compte` varchar(6) NOT NULL,
  `libelle` varchar(100) NOT NULL,
  `type_compte` enum('actif','passif','charge','produit') NOT NULL,
  `categorie` varchar(50) DEFAULT NULL,
  `actif` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`numero_compte`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `referentiel_modes_paiement`
--

DROP TABLE IF EXISTS `referentiel_modes_paiement`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `referentiel_modes_paiement` (
  `code` varchar(20) NOT NULL,
  `libelle` varchar(50) NOT NULL,
  `actif` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `referentiel_taux_tva`
--

DROP TABLE IF EXISTS `referentiel_taux_tva`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `referentiel_taux_tva` (
  `taux` decimal(5,2) NOT NULL,
  `libelle` varchar(50) NOT NULL,
  `actif` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`taux`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `referentiel_types_facture`
--

DROP TABLE IF EXISTS `referentiel_types_facture`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `referentiel_types_facture` (
  `code` varchar(20) NOT NULL,
  `libelle` varchar(50) NOT NULL,
  `actif` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `relances`
--

DROP TABLE IF EXISTS `relances`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
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
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id_relance`),
  KEY `relances_tiers_id_foreign` (`tiers_id`),
  KEY `relances_contrat_id_foreign` (`contrat_id`),
  KEY `relances_facture_id_foreign` (`facture_id`),
  CONSTRAINT `relances_contrat_id_foreign` FOREIGN KEY (`contrat_id`) REFERENCES `contrats` (`id_contrat`),
  CONSTRAINT `relances_facture_id_foreign` FOREIGN KEY (`facture_id`) REFERENCES `factures` (`numero_facture`),
  CONSTRAINT `relances_tiers_id_foreign` FOREIGN KEY (`tiers_id`) REFERENCES `tiers` (`id_tiers`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `role_permissions`
--

DROP TABLE IF EXISTS `role_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `role_permissions` (
  `id_role_permission` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `id_role` int(10) unsigned NOT NULL,
  `id_permission` int(10) unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id_role_permission`),
  UNIQUE KEY `unique_role_permission` (`id_role`,`id_permission`),
  KEY `id_permission` (`id_permission`),
  CONSTRAINT `role_permissions_ibfk_1` FOREIGN KEY (`id_role`) REFERENCES `roles` (`id_role`),
  CONSTRAINT `role_permissions_ibfk_2` FOREIGN KEY (`id_permission`) REFERENCES `permissions` (`id_permission`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `id_role` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `code_role` varchar(50) NOT NULL,
  `nom_role` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id_role`),
  UNIQUE KEY `code_role` (`code_role`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `taux_change`
--

DROP TABLE IF EXISTS `taux_change`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `taux_change` (
  `id_taux` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `devise_source` varchar(3) NOT NULL,
  `devise_cible` varchar(3) NOT NULL,
  `taux` decimal(10,4) NOT NULL,
  `date_effet` date NOT NULL,
  `actif` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id_taux`),
  UNIQUE KEY `taux_change_devise_source_devise_cible_date_effet_unique` (`devise_source`,`devise_cible`,`date_effet`)
) ENGINE=InnoDB AUTO_INCREMENT=44 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tiers`
--

DROP TABLE IF EXISTS `tiers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
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
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `devise_preferee` varchar(3) DEFAULT 'MGA',
  PRIMARY KEY (`id_tiers`),
  UNIQUE KEY `tiers_numero_unique` (`numero`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `transporteurs`
--

DROP TABLE IF EXISTS `transporteurs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
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
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `code_transporteur` (`code_transporteur`),
  KEY `idx_transporteur_nom` (`nom`),
  KEY `idx_transporteur_type` (`type_transport`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id_user` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `nom` varchar(100) NOT NULL,
  `prenom` varchar(100) NOT NULL,
  `id_role` int(10) unsigned NOT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `last_login` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id_user`),
  UNIQUE KEY `email` (`email`),
  KEY `id_role` (`id_role`),
  CONSTRAINT `users_ibfk_1` FOREIGN KEY (`id_role`) REFERENCES `roles` (`id_role`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*M!100616 SET NOTE_VERBOSITY=@OLD_NOTE_VERBOSITY */;

-- Dump completed on 2025-11-24  7:40:52
