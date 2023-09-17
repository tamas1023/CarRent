-- phpMyAdmin SQL Dump
-- version 5.0.4
-- https://www.phpmyadmin.net/
--
-- Gép: 127.0.0.1
-- Létrehozás ideje: 2023. Sze 17. 15:54
-- Kiszolgáló verziója: 10.4.17-MariaDB
-- PHP verzió: 8.0.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Adatbázis: `carrent`
--

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `cars`
--

CREATE TABLE `cars` (
  `ID` int(11) NOT NULL,
  `Name` varchar(100) COLLATE utf8_hungarian_ci NOT NULL,
  `Value` int(11) NOT NULL,
  `Description` varchar(1000) COLLATE utf8_hungarian_ci NOT NULL,
  `Image` varchar(1000) COLLATE utf8_hungarian_ci NOT NULL,
  `Rented` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `cars`
--

INSERT INTO `cars` (`ID`, `Name`, `Value`, `Description`, `Image`, `Rented`) VALUES
(1, 'VW Bogár2', 1000, 'Ez egy csodálatos autó.', 'https://upload.wikimedia.org/wikipedia/commons/c/cf/Volkswagen_Beetle_.jpg', 0),
(2, 'VW bogár', 2500, 'Kék színű, és még szép is!', 'https://upload.wikimedia.org/wikipedia/commons/4/47/VW_Käfer_blue_1956_vr_TCE.jpg', 0),
(6, 'Teszt', 1323, 'asd', 'https://upload.wikimedia.org/wikipedia/commons/c/cf/Volkswagen_Beetle_.jpg', 0);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `deniedtokens`
--

CREATE TABLE `deniedtokens` (
  `ID` int(11) NOT NULL,
  `token` varchar(1000) COLLATE utf8_hungarian_ci NOT NULL,
  `date` varchar(100) COLLATE utf8_hungarian_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `history`
--

CREATE TABLE `history` (
  `ID` int(11) NOT NULL,
  `CarID` int(11) NOT NULL,
  `UserName` varchar(100) COLLATE utf8_hungarian_ci NOT NULL,
  `CarName` varchar(100) COLLATE utf8_hungarian_ci NOT NULL,
  `Value` int(11) NOT NULL,
  `Description` varchar(1000) COLLATE utf8_hungarian_ci NOT NULL,
  `Image` varchar(1000) COLLATE utf8_hungarian_ci NOT NULL,
  `StartDate` datetime NOT NULL,
  `EndDate` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `history`
--

INSERT INTO `history` (`ID`, `CarID`, `UserName`, `CarName`, `Value`, `Description`, `Image`, `StartDate`, `EndDate`) VALUES
(2, 31331, 'adasdad', '', 131, 'adasda', 'adasd', '2023-09-09 00:00:00', '2023-09-16 00:00:00'),
(3, 1, 'Ötödik', '', 2500, 'Kék színű, és még szép is!', 'https://upload.wikimedia.org/wikipedia/commons/4/47/VW_Käfer_blue_1956_vr_TCE.jpg', '0000-00-00 00:00:00', '2023-09-08 17:22:00'),
(4, 1, 'Ötödik', 'VW Bogár', 1000, 'Ez egy csodálatos autó.', 'https://upload.wikimedia.org/wikipedia/commons/c/cf/Volkswagen_Beetle_.jpg', '0000-00-00 00:00:00', '2023-09-08 17:26:00'),
(5, 1, 'Ötödik', 'VW Bogár', 1000, 'Ez egy csodálatos autó.', 'https://upload.wikimedia.org/wikipedia/commons/c/cf/Volkswagen_Beetle_.jpg', '2023-09-08 17:28:00', '2023-09-08 17:32:00'),
(6, 1, 'Ötödik', 'VW Bogár', 1000, 'Ez egy csodálatos autó.', 'https://upload.wikimedia.org/wikipedia/commons/c/cf/Volkswagen_Beetle_.jpg', '2023-09-08 17:32:00', '2023-09-08 17:33:00'),
(7, 1, 'Ötödik', 'VW Bogár', 1000, 'Ez egy csodálatos autó.', 'https://upload.wikimedia.org/wikipedia/commons/c/cf/Volkswagen_Beetle_.jpg', '2023-09-08 17:33:00', '2023-09-08 17:33:00'),
(8, 2, 'Ötödik', 'VW bogár', 2500, 'Kék színű, és még szép is!', 'https://upload.wikimedia.org/wikipedia/commons/4/47/VW_Käfer_blue_1956_vr_TCE.jpg', '2023-09-08 17:35:00', '2023-09-08 17:35:00'),
(9, 2, 'admin12', 'VW bogár', 2500, 'Kék színű, és még szép is!', 'https://upload.wikimedia.org/wikipedia/commons/4/47/VW_Käfer_blue_1956_vr_TCE.jpg', '2023-09-08 17:56:00', '2023-09-08 17:57:00'),
(10, 1, 'admin12', 'VW Bogár', 1000, 'Ez egy csodálatos autó.', 'https://upload.wikimedia.org/wikipedia/commons/c/cf/Volkswagen_Beetle_.jpg', '2023-09-08 17:57:00', '2023-09-08 17:57:00');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `rents`
--

CREATE TABLE `rents` (
  `CarID` int(11) NOT NULL,
  `UserName` varchar(100) COLLATE utf8_hungarian_ci NOT NULL,
  `Date` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `users`
--

CREATE TABLE `users` (
  `ID` int(11) NOT NULL,
  `UserName` varchar(100) COLLATE utf8_hungarian_ci NOT NULL,
  `Password` varchar(100) COLLATE utf8_hungarian_ci NOT NULL,
  `Email` varchar(100) COLLATE utf8_hungarian_ci NOT NULL,
  `Money` int(11) NOT NULL,
  `RegDate` datetime NOT NULL,
  `RightsId` int(11) NOT NULL,
  `State` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `users`
--

INSERT INTO `users` (`ID`, `UserName`, `Password`, `Email`, `Money`, `RegDate`, `RightsId`, `State`) VALUES
(1, 'ElsoFelhasználó', '$2b$10$Ott4GbnaKs9Wmy4XuuCtyOud0MTUTYSu6QsLnmuFZWuJuXE2eoqZy', 'elso@email.com', 0, '2023-09-07 18:31:10', 1, 0),
(2, 'MásodikTeszt', '$2b$10$wdN/8ClbdsmAGhswFbzDLe8bwgfL8V9h4DUfJij7445jzuqsPU4Ti', 'masodik@email.com', 0, '2023-09-07 18:27:46', 1, 0),
(3, 'Harmadik', '$2b$10$faTbaPI/9P7ym6Dpzr4W7e07wEvuBw6kLp0yoplXOwCCCDT.rIwsS', 'harmadik@email.com', 0, '0000-00-00 00:00:00', 1, 0),
(4, 'Negyedik', '$2b$10$ywUSReQB72dGvk91HtQRnevupHfDsB7K0QaQTV4Htvi5GDiZQRD/G', 'negyedik@email.com', 0, '0000-00-00 00:00:00', 1, 0),
(5, 'Ötödik', '$2b$10$uG3wR73F/dVAolqxWmIx8u3N9erHsQF6i68vEYm9RSstlIHt/r1A2', 'otodik@email.com', 0, '2023-09-07 16:39:10', 1, 0),
(6, 'admin12', '$2b$10$50yqMRhKjXb7fy4cWVn/t.97Jn8eOt.7ZWknHN83LcWKKWhHIvrqi', 'admin@admin.hu', 120, '2023-09-08 17:39:23', 2, 0);

--
-- Indexek a kiírt táblákhoz
--

--
-- A tábla indexei `cars`
--
ALTER TABLE `cars`
  ADD PRIMARY KEY (`ID`);

--
-- A tábla indexei `deniedtokens`
--
ALTER TABLE `deniedtokens`
  ADD PRIMARY KEY (`ID`);

--
-- A tábla indexei `history`
--
ALTER TABLE `history`
  ADD PRIMARY KEY (`ID`);

--
-- A tábla indexei `rents`
--
ALTER TABLE `rents`
  ADD PRIMARY KEY (`CarID`);

--
-- A tábla indexei `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`ID`);

--
-- A kiírt táblák AUTO_INCREMENT értéke
--

--
-- AUTO_INCREMENT a táblához `cars`
--
ALTER TABLE `cars`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT a táblához `deniedtokens`
--
ALTER TABLE `deniedtokens`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=235;

--
-- AUTO_INCREMENT a táblához `history`
--
ALTER TABLE `history`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT a táblához `users`
--
ALTER TABLE `users`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
