-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 15, 2022 at 06:53 AM
-- Server version: 10.4.24-MariaDB
-- PHP Version: 8.1.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `exam_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `answers`
--

CREATE TABLE `answers` (
  `id` bigint(20) NOT NULL,
  `answer_code` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `answer_content` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `explanation` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `is_correct` bit(1) NOT NULL,
  `question_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `answers`
--

INSERT INTO `answers` (`id`, `answer_code`, `answer_content`, `explanation`, `is_correct`, `question_id`) VALUES
(1, 'A1', 'Home Tool Markup Language', 'a', b'0', 1),
(2, 'A2', 'Hyper Text Markup Language', 'b', b'1', 1),
(3, 'A3', 'Hyperlinks and Text Markup Language', 'c', b'0', 1),
(4, 'A4', 'bgcolor', 'd', b'0', 2),
(5, 'A5', 'color', 'e', b'0', 2),
(6, 'A6', 'background-color', 'f', b'1', 2),
(7, 'A7', 'var carName', 'g', b'1', 3),
(8, 'A8', 'v carName', 'h', b'0', 3),
(9, 'A9', 'variable carName', 'i', b'0', 3);

-- --------------------------------------------------------

--
-- Table structure for table `questions`
--

CREATE TABLE `questions` (
  `id` bigint(20) NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `mark` int(11) NOT NULL,
  `question_code` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `question_content` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `subject` varchar(255) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `questions`
--

INSERT INTO `questions` (`id`, `created_at`, `mark`, `question_code`, `question_content`, `subject`) VALUES
(1, '2022-08-15 11:46:14', 5, 'Q1', 'What does HTML stand for?', 'HTML'),
(2, '2022-08-15 11:46:14', 5, 'Q2', 'Which property is used to change the background color?', 'CSS'),
(3, '2022-08-15 11:46:14', 5, 'Q3', 'How do you declare a JavaScript variable?', 'JavaScript');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `answers`
--
ALTER TABLE `answers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UK_hgxb9h3f6n1986ajv1dp57knt` (`answer_code`),
  ADD KEY `FK3erw1a3t0r78st8ty27x6v3g1` (`question_id`);

--
-- Indexes for table `questions`
--
ALTER TABLE `questions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UK_b5whig7a6s3n8s9cjrvcgqrxr` (`question_code`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `answers`
--
ALTER TABLE `answers`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `questions`
--
ALTER TABLE `questions`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `answers`
--
ALTER TABLE `answers`
  ADD CONSTRAINT `FK3erw1a3t0r78st8ty27x6v3g1` FOREIGN KEY (`question_id`) REFERENCES `questions` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
