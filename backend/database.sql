-- MySQL dump 10.13  Distrib 8.0.46, for Win64 (x86_64)
--
-- Host: localhost    Database: inkora_db
-- ------------------------------------------------------
-- Server version	8.0.46

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `blog_tags`
--

DROP TABLE IF EXISTS `blog_tags`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `blog_tags` (
  `blog_id` bigint NOT NULL,
  `tag_id` bigint NOT NULL,
  PRIMARY KEY (`blog_id`,`tag_id`),
  KEY `FK40ssjxev6664mjrw1mrjduxns` (`tag_id`),
  CONSTRAINT `FK40ssjxev6664mjrw1mrjduxns` FOREIGN KEY (`tag_id`) REFERENCES `tags` (`id`),
  CONSTRAINT `FKknhfjqf24lyrdbfobo3qm09e6` FOREIGN KEY (`blog_id`) REFERENCES `blogs` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `blog_tags`
--

LOCK TABLES `blog_tags` WRITE;
/*!40000 ALTER TABLE `blog_tags` DISABLE KEYS */;
INSERT INTO `blog_tags` VALUES (1,1),(1,2),(2,2),(4,2),(1,3),(3,4),(3,5),(3,6),(4,7),(6,8),(6,9);
/*!40000 ALTER TABLE `blog_tags` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `blog_views`
--

DROP TABLE IF EXISTS `blog_views`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `blog_views` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `ip_hash` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `viewed_at` datetime(6) NOT NULL,
  `blog_id` bigint NOT NULL,
  `user_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_view_blog_ip_time` (`blog_id`,`ip_hash`,`viewed_at`),
  KEY `idx_view_blog_id` (`blog_id`),
  KEY `FK3q0bnjsoj6ecrb4as5xub4bgy` (`user_id`),
  CONSTRAINT `FK3q0bnjsoj6ecrb4as5xub4bgy` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `FKayfkr0ksbfl3qus1cvl4t4y88` FOREIGN KEY (`blog_id`) REFERENCES `blogs` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `blog_views`
--

LOCK TABLES `blog_views` WRITE;
/*!40000 ALTER TABLE `blog_views` DISABLE KEYS */;
INSERT INTO `blog_views` VALUES (1,'b6cf5bd6081fb775fc3f89927e582d7e945f955c35b73a07879d75bb4ea96a01','2026-10-05 15:24:45.861271',1,NULL),(2,'b6cf5bd6081fb775fc3f89927e582d7e945f955c35b73a07879d75bb4ea96a01','2026-10-06 04:16:11.488467',3,NULL),(3,'b6cf5bd6081fb775fc3f89927e582d7e945f955c35b73a07879d75bb4ea96a01','2026-10-06 05:23:00.429805',4,1),(4,'b6cf5bd6081fb775fc3f89927e582d7e945f955c35b73a07879d75bb4ea96a01','2026-10-06 05:27:22.463263',2,1),(5,'b6cf5bd6081fb775fc3f89927e582d7e945f955c35b73a07879d75bb4ea96a01','2026-10-14 10:33:33.113779',2,1),(6,'b6cf5bd6081fb775fc3f89927e582d7e945f955c35b73a07879d75bb4ea96a01','2026-10-14 10:33:38.587204',1,1);
/*!40000 ALTER TABLE `blog_views` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `blogs`
--

DROP TABLE IF EXISTS `blogs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `blogs` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `content` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `cover_image_url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime(6) NOT NULL,
  `excerpt` text COLLATE utf8mb4_unicode_ci,
  `published_at` datetime(6) DEFAULT NULL,
  `slug` varchar(280) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('DRAFT','PUBLISHED') COLLATE utf8mb4_unicode_ci NOT NULL,
  `style` enum('EDITORIAL','MAGAZINE','MINIMAL','NEO_BRUTALIST') COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `view_count` bigint NOT NULL,
  `author_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKpl5w1yw2c5lligoeb9a393fr3` (`slug`),
  KEY `idx_blog_slug` (`slug`),
  KEY `idx_blog_author_id` (`author_id`),
  KEY `idx_blog_status` (`status`),
  KEY `idx_blog_published_at` (`published_at`),
  CONSTRAINT `FKt8g0udj2fq40771g38t2t011n` FOREIGN KEY (`author_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `blogs`
--

LOCK TABLES `blogs` WRITE;
/*!40000 ALTER TABLE `blogs` DISABLE KEYS */;
INSERT INTO `blogs` VALUES (1,'Skip to contentSkip to content\nabout Geert Hofstede\nGert Jan Hofstede\nRelated Scientists\nContact\n\n\n\nfacebook-36linkedin-36\nGeert Hofstede\n\nCulture\nWhat is culture\n6D model of national culture\nCountry Comparison Bar Charts\nCountry comparison graphs\nHofstede’s globe\n6 dimensions of organisational culture\nGert Jan’s blog\nOur books\nTranslations\nTraining/Consulting\nOnline lectures\nSimulation games\nPartners\nFriends of Hofstede\nResearch and VSM\nLevels of analysis\nDimension data matrix\nVSM 08\nVSM 2013\nBOSS Blog 11: Why do people do stupid things?\n8 October 2020 by Gert Jan\nBOSS Blog 11 By Gert Jan Hofstede\nScience & Cocktails in Paradiso\nOn 28 October 2020, I was scheduled to speak at Paradiso in Amsterdam for \"Science & Cocktails\". The speech has been postponed again due to the 2nd COVID-19 wave, then to spring 2021. It was finally held to a reduced, welll-spaced audience on September 2021. See here.\n\nThis blog is a brief and partial rendering of my speech.\n\nRemember BOSS Blog 10: Status and power make the world go round\nThis blog builds on the previous one. In BOSS blog 10, I argued that whatever we do, status and power are involved. I explained how I meant those words: status is all the admiration, respect, and love that we give and crave. It is what we give to one another freely in all our interactions; what we claim from one another too, and what we acquire in society as a result. Power is what we do to obtain by force what we cannot get voluntarily. We learn to play the status-power game from our “reference groups”, starting with our parents. We live in a world of groups, in which every group may have different unwritten rules about what is appropriate. We do nothing else.\n\nBOSS Blog 11: Why do people do stupid things?\nHere, I argue that the status-power game can lead us into harmful behaviours. To name a few at the individual level: telling lame jokes, speeding, drug abuse,  killing one’s family members, killing strangers for ideological reasons, killing oneself. At the collective level there is also no shortage of examples: voting for inept leaders, messing with the earth’s climate, messing with the quality of the air and water, contracting contagious diseases from wild animals.\n\nThe motor is love\nCrucially, we are always basically motivated by love. This starts right at birth. A baby needs food, but also somebody to love. It needs to be cared for with love, and to respond by loving. If caretakers are absent or fickle, the child develops severe disorders. Clinical psychologist Abraham Maslow saw this in his practice and developed his model of human needs (Maslow, 1970). In status-power terms, the child needs to learn to give status to caretakers, and it needs to learn how to be worthy of receiving status from them. In short, it needs to learn to play the status game. Figure 1  (Syntax: flowchart) shows possible archetypical pathways. There are two possible outcomes, box 4 or box 9. The figure applies at all ages, anywhere in the world. Details will depend on context and culture. The variations around figure 1 are endless.\n\nHow do we get love?\nFigure 1. How do we get love?\nHappy group life\nWhen all goes well, we get the cycle shown in figure 2. Status claims succeed, the child receives love and encouragement, is happy, and learns to return status in appropriate ways. A childhood like this will yield confident persons, knowing to rely on status conferrals instead of power use for obtaining what they need, able to give love to others.\n\nWith Tolstoy, happy families are all alike - so this is a short paragraph.\n\nHappy group life\nFigure 2: Happy group life\nAcculturation, Socialization\nIn reality, status claims often go wrong. A child wets its pants, beats or bites, fails to say thank you, or to look at you, or to look down respectfully. Then, with luck, it will be corrected with enough encouragement for it to try again (figure 3). In this way it learns to behave appropriately. The path is similar for immigrants or new employees needing to learn the unwritten rules of the game.\n\nPower can replace status\nWhen claims for status fail, a child can try something else: use power to claim status (box 2: cry, or throw a tantrum). If using power works, the child can learn to take this as its modus operandi. Various options are available, and the child quickly learns to use power in an appropriate way. It has been found that boy infants can get their parents’ attention better when throwing tantrums than girl infants; for girls, crying works better (Eliot, 2009). This socialization differs across cultures, by the way. See Hofstede et al (2018) for more about this.\n\nWhen love is in short supply\nA child that receives no love from its primary caretakers will be desperate to find love. It may fabulise about loving parents, or search elsewhere. It will also be fearful and uncertain. This will mark it for life. It will search for other reference groups to love. Thus, it will be vulnerable to exploitation by people or groups that seem protective and pretend to love it. This could be an abusive parent, husband or wife, a narcissistic politician or preacher, a social media group claiming to have debunked the complots of the famous. In status-power terms, it will search powerful protection. The child could itself become a narcissistic person, prone to using power.\n\nCreating Donald Trump\nLet me give you an example. The socialization mechanism above is how, when a mother is absent and a father – his remaining essential reference group - violent, a child can easily come to revere force as the preferred way of getting its way. In a masculine, short-term oriented national culture, using power ostentatiously is seen as status-worthy. As a result, a violent and narcissistic temperament has some appeal, and voters may give legitimacy to such behaviour.\n\nAcculturation, socialization\nFigure 3: Acculturation, socialization\nFinding new groups\nOne solution to a felt lack of status conferrals, or love, is to disinvest in a certain reference group, or even leave it. Adolescents are likely to try new reference groups. Grown-ups in individualistic societies easily shift between groups as well. Each new group is rife with status claiming, since the status-power cards are not shuffled yet. In some groups this may also involve intense power play. Each new group develops its own culture: the unwritten rules of its status-power game.\n\nSocial media and instant status & power\nAs an aside, social media are a retreat for group hopping. They offer maximum ease of group-hopping, of status claiming (posting impressive pics, re-tweeting celebrities) and status conferral (liking, following), and of risk-free power use (death threats).\n\nDespair\nWhen no welcoming reference group can be found, a person could despair and become suicidal, a killer, or both. It would end up in box 9 with no further perspective.\n\nGroup hopping\nFigure 4: Group hopping\nThe search for love can lead us astray\nHere stops the discussion of figure 1. The point about all of this is that claiming and giving status, perhaps associated with using and avoiding power, are always top issues in people’s minds. The content matter of what we do always comes second. This hold for peasants, professors and politicians. We want to make some people proud, put others to shame. We’ll do stupid things to give love or to obtain it, to punish or avoid punishment.\n\nViolence can be based on love\nI am convinced that the notion that some people are just too stupid or too depraved to obey normal laws of social behaviour is unhelpful. Those people are acting out of love for the wrong reference groups, or out of sheer fear. One observer’s freedom fighter is another observer’s terrorist. One person\'s president is another person\'s sociopath.\n\nSo how can we improve?\n“Living a good life” is qualified by which reference group thinks so. If we do good, it is because our most important reference groups tell us to do so. The range of possible reference groups is endless. They can be living people or groups, deceased people, spirits, Gods or books. This blog could even act as a reference group, adding its voices to the voices in your mind, leading you to new choices. For sure, Theodore Kemper’s status-power theory became a reference group for me when I read about it ten years ago.\n\nYou are also a reference group\nThe good news is: if we are so strongly socially influenced by others, we can do the same thing to those who come after us. Everybody acts as a reference group, and that brings responsibility as well as opportunities for improvement. The higher your social status, the more you should be exemplary.\n\nConclusion\nSo yes, we do stupid things for love. An outsider could say that your love is misdirected. We ourselves can help others grow and direct their love. Especially small children. They are the future of the art of living a loving life.\n\nReferences\nEliot L (2009) Pink brain, blue brain: how small differences grow into troublesome gaps—and what we can do about it. Mariner Books, Boston\n\nHofstede, G.J., Student, J. & Kramer, M.R. (2018) The status–power arena: a comprehensive agent-based model of social status dynamics and gender in groups of children. AI & Society. https://doi.org/10.1007/s00146-017-0793-5.\n\nTrump, Mary L. (2020) Too much and never enough: How my family created the world’s most dangerous man. New York: Simon & Schuster.\n\nCategoriesNews\nBOSS Blog 10: Status and power make the world go round\nBOSS Blog 12: Schizophrenia and your inner Trump\nContactSitemap','','2026-10-05 15:24:45.691746','Introduction Building resilient distributed systems requires thoughtful boundary isolation. High cohesion Loose coupling Eventual consistency','2026-10-05 15:24:45.804304','architectural-principles-of-modern-distributed-applications','PUBLISHED','NEO_BRUTALIST','Architectural Principles of Modern Distributed Applications','2026-10-14 10:33:38.594247',2,1),(2,'![Image description]\n![Screenshot 2026-08-17 105132.png](/uploads/content/fc929dc3-4316-42d8-a032-317bf136cec4.png)\ntextA follow-up deep dive on reactive microservices and event streaming.','','2026-10-05 15:24:45.959225','A follow up deep dive on reactive microservices and event streaming.','2026-10-05 15:24:45.957122','architectural-principles-of-modern-distributed-applications-1','PUBLISHED','MINIMAL','Architectural Principles of Modern Distributed Applications','2026-10-14 10:44:58.520780',2,1),(3,'# High Contrast and Bold Borders\n\nNeo-brutalism rejects soft rounded glassmorphism in favor of raw black strokes and bold personality.\n\nIt stands out in a sea of homogenous SaaS templates.',NULL,'2026-10-05 15:24:46.175955','High Contrast and Bold Borders Neo brutalism rejects soft rounded glassmorphism in favor of raw black strokes and bold personality. It stands out in a sea of...','2026-10-05 15:24:46.166510','why-neo-brutalism-is-dominating-modern-web-aesthetics','PUBLISHED','NEO_BRUTALIST','Why Neo Brutalism Is Dominating Modern Web Aesthetics','2026-10-06 04:16:11.522335',1,2),(4,'# Core Principles\n\nReactive micro-frontends enable teams to ship independent user journeys with zero blast radius.\n\n* Isolated deployment units\n* Shared design tokens\n* Framework agnosticism\n\n```javascript\nexport const bootstrap = () => mountApp();\n```','','2026-10-05 15:59:43.314675','Why monolithic frontends are giving way to independent, reactive design architectures.','2026-10-05 15:59:43.201219','designing-reactive-micro-frontends-in-2026','PUBLISHED','NEO_BRUTALIST','Designing Reactive Micro-Frontends in 2026','2026-10-06 05:23:00.439702',1,2),(6,'This is a test check of the **website **if your are reading it get a life brother ,I mean like why are you even reading this still and why I\'m I even writing this much ;).','/uploads/blogs/75dfdec3-4305-42a7-a4c0-692fea027b08.png','2026-10-06 05:26:06.511909','This is a test check of the website if your are reading it get a life brother ,I mean like why are you even reading this still and why I\'m I even writing thi...','2026-10-14 10:45:50.264785','helloooo','PUBLISHED','MAGAZINE','Helloooo!','2026-10-14 10:45:50.278512',0,1);
/*!40000 ALTER TABLE `blogs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bookmarks`
--

DROP TABLE IF EXISTS `bookmarks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bookmarks` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL,
  `blog_id` bigint NOT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_bookmark_blog_user` (`blog_id`,`user_id`),
  KEY `idx_bookmark_blog_id` (`blog_id`),
  KEY `idx_bookmark_user_id` (`user_id`),
  CONSTRAINT `FKdbsho2e05w5r13fkjqfjmge5f` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `FKmcia0yqnt2h6e19xed7x3kr4r` FOREIGN KEY (`blog_id`) REFERENCES `blogs` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bookmarks`
--

LOCK TABLES `bookmarks` WRITE;
/*!40000 ALTER TABLE `bookmarks` DISABLE KEYS */;
/*!40000 ALTER TABLE `bookmarks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `comments`
--

DROP TABLE IF EXISTS `comments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `comments` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `content` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `blog_id` bigint NOT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_comment_blog_id` (`blog_id`),
  KEY `idx_comment_user_id` (`user_id`),
  CONSTRAINT `FK8omq0tc18jd43bu5tjh6jvraq` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `FK9aakob3a7aghrm94k9kmbrjqd` FOREIGN KEY (`blog_id`) REFERENCES `blogs` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comments`
--

LOCK TABLES `comments` WRITE;
/*!40000 ALTER TABLE `comments` DISABLE KEYS */;
/*!40000 ALTER TABLE `comments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `follows`
--

DROP TABLE IF EXISTS `follows`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `follows` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL,
  `follower_id` bigint NOT NULL,
  `following_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_follow_pair` (`follower_id`,`following_id`),
  KEY `idx_follow_follower_id` (`follower_id`),
  KEY `idx_follow_following_id` (`following_id`),
  CONSTRAINT `FKonkdkae2ngtx70jqhsh7ol6uq` FOREIGN KEY (`following_id`) REFERENCES `users` (`id`),
  CONSTRAINT `FKqnkw0cwwh6572nyhvdjqlr163` FOREIGN KEY (`follower_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `follows`
--

LOCK TABLES `follows` WRITE;
/*!40000 ALTER TABLE `follows` DISABLE KEYS */;
/*!40000 ALTER TABLE `follows` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `likes`
--

DROP TABLE IF EXISTS `likes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `likes` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL,
  `blog_id` bigint NOT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_like_blog_user` (`blog_id`,`user_id`),
  KEY `idx_like_blog_id` (`blog_id`),
  KEY `idx_like_user_id` (`user_id`),
  CONSTRAINT `FKl0jvfq4a7glp0xeuhd8hm05yt` FOREIGN KEY (`blog_id`) REFERENCES `blogs` (`id`),
  CONSTRAINT `FKnvx9seeqqyy71bij291pwiwrg` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `likes`
--

LOCK TABLES `likes` WRITE;
/*!40000 ALTER TABLE `likes` DISABLE KEYS */;
INSERT INTO `likes` VALUES (4,'2026-10-14 10:33:46.280204',1,1);
/*!40000 ALTER TABLE `likes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tags`
--

DROP TABLE IF EXISTS `tags`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tags` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL,
  `name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(60) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKt48xdq560gs3gap9g7jg36kgc` (`name`),
  UNIQUE KEY `UKsn0d91hxu700qcw0n4pebp5vc` (`slug`),
  KEY `idx_tag_slug` (`slug`),
  KEY `idx_tag_name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tags`
--

LOCK TABLES `tags` WRITE;
/*!40000 ALTER TABLE `tags` DISABLE KEYS */;
INSERT INTO `tags` VALUES (1,'2026-10-05 15:24:45.665212','Java','java'),(2,'2026-10-05 15:24:45.681565','Architecture','architecture'),(3,'2026-10-05 15:24:45.683583','Spring Boot','spring-boot'),(4,'2026-10-05 15:24:46.168605','Design','design'),(5,'2026-10-05 15:24:46.171780','UI/UX','uiux'),(6,'2026-10-05 15:24:46.174946','CSS','css'),(7,'2026-10-05 15:59:43.246781','Microfrontends','microfrontends'),(8,'2026-10-06 05:26:06.507346','Test','test'),(9,'2026-10-06 05:26:06.509888','check','check');
/*!40000 ALTER TABLE `tags` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `bio` text COLLATE utf8mb4_unicode_ci,
  `created_at` datetime(6) NOT NULL,
  `display_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password_hash` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `profile_image_url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `updated_at` datetime(6) NOT NULL,
  `username` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK6dotkott2kjsp8vw4d0m25fb7` (`email`),
  UNIQUE KEY `UKr43af9ap4edm43mmtq01oddj6` (`username`),
  KEY `idx_user_username` (`username`),
  KEY `idx_user_email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Design Engineer and Storyteller','2026-10-05 15:09:13.800941','Alex Rivera','alex@inkora.io','$2a$10$Lh73qdDlroaq4Gk2ZwWTcue4T0Eqd6jjrFKbvPG8ETXAFshkm1V/e','/uploads/profiles/3ad813fa-1b51-4832-8559-cebd2a25cbf4.png','2026-10-08 14:32:22.806615','alexrivera'),(2,'Senior Architect & Writer | Designing Elegant Digital Systems','2026-10-05 15:20:06.222273','Elena Rostova','elena@inkora.io','$2a$10$g..K35QO9URYZY4BkBH7OeydZ8jnXV2/qLhFRk6nuvgdqaSmY1oom',NULL,'2026-10-05 16:15:22.147577','elenarostova');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'inkora_db'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-10-14 17:08:45
