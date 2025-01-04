-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 29, 2024 at 04:38 AM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `mhzobaer`
--

-- --------------------------------------------------------

--
-- Table structure for table `client_master`
--

CREATE TABLE `client_master` (
  `client_no` varchar(4) NOT NULL,
  `name` varchar(20) DEFAULT NULL,
  `city` varchar(20) DEFAULT NULL,
  `pincode` int(11) NOT NULL,
  `state` varchar(20) DEFAULT NULL,
  `bal_due` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `client_master`
--

INSERT INTO `client_master` (`client_no`, `name`, `city`, `pincode`, `state`, `bal_due`) VALUES
('0001', 'Ivan', 'Bombay', 400054, 'Maharashtra', 15000),
('0002', 'Vandana', 'Madras', 780001, 'Tamilnadu', 0),
('0003', 'Pramada', 'Bombay', 400057, 'Maharashtra', 5000),
('0004', 'Basu', 'Bombay', 400056, 'Maharashtra', 0),
('0005', 'Ravi', 'Delhi', 100001, 'Delhi', 2000),
('0006', 'Rukmini', 'Bombay', 400050, 'Maharashtra', 0);

-- --------------------------------------------------------

--
-- Table structure for table `product_master`
--

CREATE TABLE `product_master` (
  `product_no` varchar(50) NOT NULL,
  `description` varchar(50) DEFAULT NULL,
  `profit_percent` varchar(50) DEFAULT NULL,
  `unit_measure` varchar(50) DEFAULT NULL,
  `qty_on_hand` int(11) DEFAULT NULL,
  `reorder_lvl` int(11) DEFAULT NULL,
  `sell_price` int(11) DEFAULT NULL,
  `cost_price` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `product_master`
--

INSERT INTO `product_master` (`product_no`, `description`, `profit_percent`, `unit_measure`, `qty_on_hand`, `reorder_lvl`, `sell_price`, `cost_price`) VALUES
('P00001', '1.44floppies', '5', 'Piece', 100, 20, 1150, 500),
('P03453', 'Monitors', '6', 'Piece', 10, 3, 12000, 11200),
('P06734', 'Mouse', '5', 'Piece', 20, 5, 1050, 500),
('P07865', '1.22 floppies', '5', 'Piece', 100, 20, 525, 500),
('P07868', 'Keyboards', '2', 'Piece', 2, 3, 3150, 3050),
('P07885', 'CD Drive', '2.5', 'Piece', 10, 3, 5250, 5100),
('P07965', '540HDD', '4', 'Piece', 10, 3, 8400, 8000),
('P08865', '1.22 Drive', '5', 'Piece', 2, 3, 1050, 1000),
('POT975', '1.44 Drive', '5', 'Piece', 10, 3, 1050, 1000);

-- --------------------------------------------------------

--
-- Table structure for table `sales_master`
--

CREATE TABLE `sales_master` (
  `Salesman_no` varchar(6) NOT NULL CHECK (`Salesman_no` like 's%'),
  `Salesman_name` varchar(20) NOT NULL,
  `Address` varchar(200) NOT NULL,
  `City` varchar(20) DEFAULT NULL,
  `State` varchar(20) DEFAULT NULL,
  `Pincode` int(6) DEFAULT NULL,
  `Sal_amt` float(8,2) NOT NULL CHECK (`Sal_amt` <> 0),
  `Tgt_to_get` float(8,2) NOT NULL CHECK (`Tgt_to_get` <> 0),
  `Ytd_sales` float(6,2) NOT NULL CHECK (`Ytd_sales` <> 0),
  `Remarks` varchar(30) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `sales_master`
--

INSERT INTO `sales_master` (`Salesman_no`, `Salesman_name`, `Address`, `City`, `State`, `Pincode`, `Sal_amt`, `Tgt_to_get`, `Ytd_sales`, `Remarks`) VALUES
('S00001', 'Kiran', 'A/14, worli', 'Bombay', 'Mah', 400002, 3000.00, 100.00, 50.00, 'Good'),
('S00002', 'Manish', '65, nariman', 'Bombay', 'Mah', 400001, 3000.00, 200.00, 100.00, 'Good'),
('S00003', 'Ravi', 'P-7, Bandra', 'Bombay', 'Mah', 400032, 3000.00, 200.00, 100.00, 'Good'),
('S00004', 'Ashish', 'A/5, Juhu', 'Bombay', 'Mah', 400044, 3500.00, 200.00, 150.00, 'Good');

-- --------------------------------------------------------

--
-- Table structure for table `sales_order`
--

CREATE TABLE `sales_order` (
  `S_order_no` varchar(6) NOT NULL CHECK (`S_order_no` like 'O%'),
  `S_order_date` date DEFAULT NULL,
  `Client_no` varchar(6) NOT NULL,
  `Dely_type` enum('P','F') DEFAULT 'F',
  `Billed_YN` enum('Y','N') DEFAULT NULL,
  `Salesman_no` varchar(6) NOT NULL,
  `Dely_date` date DEFAULT NULL CHECK (`Dely_date` >= `S_order_date`),
  `Order_status` enum('in process','fulfilled','back order','canceled') DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `sales_order`
--

INSERT INTO `sales_order` (`S_order_no`, `S_order_date`, `Client_no`, `Dely_type`, `Billed_YN`, `Salesman_no`, `Dely_date`, `Order_status`) VALUES
('O10008', '2015-05-24', '0005', 'F', 'N', 'S00004', '2015-05-26', 'in process'),
('O16865', '2015-02-18', '0003', 'F', 'Y', 'S00003', '2015-02-20', 'fulfilled'),
('O19001', '2015-01-12', '0001', 'F', 'N', 'S00001', '2015-01-20', 'in process'),
('O19002', '2015-01-25', '0002', 'P', 'N', 'S00002', '2015-01-27', 'canceled'),
('O19003', '2015-04-03', '0001', 'F', 'Y', 'S00001', '2015-04-07', 'fulfilled'),
('O46866', '2015-05-20', '0004', 'P', 'N', 'S00002', '2015-05-22', 'canceled');

-- --------------------------------------------------------

--
-- Table structure for table `sales_order_details`
--

CREATE TABLE `sales_order_details` (
  `S_order_no` varchar(6) NOT NULL,
  `Product_no` varchar(6) NOT NULL,
  `Qty_order` int(11) DEFAULT NULL,
  `Qty_display` int(11) DEFAULT NULL,
  `Product_rate` float(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `sales_order_details`
--

INSERT INTO `sales_order_details` (`S_order_no`, `Product_no`, `Qty_order`, `Qty_display`, `Product_rate`) VALUES
('O10008', 'P00001', 1, 0, 1050.00),
('O16865', 'P03453', 1, 1, 12000.00),
('O19001', 'P06734', 4, 4, 525.00),
('O19002', 'P07865', 10, 0, 525.00),
('O19003', 'P07868', 4, 4, 1050.00),
('O46866', 'P07885', 1, 1, 12000.00);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `client_master`
--
ALTER TABLE `client_master`
  ADD PRIMARY KEY (`client_no`);

--
-- Indexes for table `product_master`
--
ALTER TABLE `product_master`
  ADD PRIMARY KEY (`product_no`);

--
-- Indexes for table `sales_master`
--
ALTER TABLE `sales_master`
  ADD PRIMARY KEY (`Salesman_no`);

--
-- Indexes for table `sales_order`
--
ALTER TABLE `sales_order`
  ADD PRIMARY KEY (`S_order_no`),
  ADD KEY `Client_no` (`Client_no`),
  ADD KEY `Salesman_no` (`Salesman_no`);

--
-- Indexes for table `sales_order_details`
--
ALTER TABLE `sales_order_details`
  ADD PRIMARY KEY (`S_order_no`,`Product_no`),
  ADD KEY `Product_no` (`Product_no`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `sales_order`
--
ALTER TABLE `sales_order`
  ADD CONSTRAINT `sales_order_ibfk_1` FOREIGN KEY (`Client_no`) REFERENCES `client_master` (`client_no`),
  ADD CONSTRAINT `sales_order_ibfk_2` FOREIGN KEY (`Salesman_no`) REFERENCES `sales_master` (`Salesman_no`);

--
-- Constraints for table `sales_order_details`
--
ALTER TABLE `sales_order_details`
  ADD CONSTRAINT `sales_order_details_ibfk_1` FOREIGN KEY (`S_order_no`) REFERENCES `sales_order` (`S_order_no`),
  ADD CONSTRAINT `sales_order_details_ibfk_2` FOREIGN KEY (`Product_no`) REFERENCES `product_master` (`product_no`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
