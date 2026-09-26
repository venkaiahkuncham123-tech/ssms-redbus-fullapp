-- =======================================================
-- Database Upgrade Script for RedBus Clone
-- Adds Route & Fare pricing support to dbo.Travelers
-- =======================================================

USE RedBusDB;
GO

IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Travelers' AND COLUMN_NAME = 'FromCity')
BEGIN
    ALTER TABLE Travelers ADD FromCity NVARCHAR(100) NULL;
END
GO

IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Travelers' AND COLUMN_NAME = 'ToCity')
BEGIN
    ALTER TABLE Travelers ADD ToCity NVARCHAR(100) NULL;
END
GO

IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Travelers' AND COLUMN_NAME = 'TravelDate')
BEGIN
    ALTER TABLE Travelers ADD TravelDate DATE NULL;
END
GO

IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Travelers' AND COLUMN_NAME = 'SeatCount')
BEGIN
    ALTER TABLE Travelers ADD SeatCount INT NOT NULL DEFAULT 1;
END
GO

IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Travelers' AND COLUMN_NAME = 'TotalFare')
BEGIN
    ALTER TABLE Travelers ADD TotalFare DECIMAL(10,2) NOT NULL DEFAULT 0.00;
END
GO

-- Populate initial routes and fares for pre-existing travelers
UPDATE Travelers
SET FromCity = 'Bengaluru', ToCity = 'Hyderabad', TravelDate = DATEADD(day, 2, CAST(GETDATE() AS DATE)), SeatCount = 1, TotalFare = 1450.00
WHERE Id = 'trv_101' AND (FromCity IS NULL OR FromCity = '');

UPDATE Travelers
SET FromCity = 'Mumbai', ToCity = 'Pune', TravelDate = DATEADD(day, 1, CAST(GETDATE() AS DATE)), SeatCount = 1, TotalFare = 680.00
WHERE Id = 'trv_102' AND (FromCity IS NULL OR FromCity = '');

UPDATE Travelers
SET FromCity = 'Hyderabad', ToCity = 'Bengaluru', TravelDate = DATEADD(day, 3, CAST(GETDATE() AS DATE)), SeatCount = 2, TotalFare = 2900.00
WHERE Id = 'trv_103' AND (FromCity IS NULL OR FromCity = '');

UPDATE Travelers
SET FromCity = 'Chennai', ToCity = 'Bengaluru', TravelDate = DATEADD(day, 4, CAST(GETDATE() AS DATE)), SeatCount = 1, TotalFare = 820.00
WHERE Id = 'trv_104' AND (FromCity IS NULL OR FromCity = '');

UPDATE Travelers
SET FromCity = 'Pune', ToCity = 'Goa', TravelDate = DATEADD(day, 5, CAST(GETDATE() AS DATE)), SeatCount = 1, TotalFare = 1150.00
WHERE Id = 'trv_105' AND (FromCity IS NULL OR FromCity = '');

UPDATE Travelers
SET FromCity = 'Delhi', ToCity = 'Jaipur', TravelDate = DATEADD(day, 2, CAST(GETDATE() AS DATE)), SeatCount = 1, TotalFare = 950.00
WHERE Id = 'trv_106' AND (FromCity IS NULL OR FromCity = '');

SELECT Id, Name, FromCity, ToCity, TravelDate, Preference, SeatCount, TotalFare FROM Travelers;
GO
