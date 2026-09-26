-- =======================================================
-- Database Setup Script for RedBus Clone (Updated)
-- Can be opened and executed directly in SSMS
-- Server: .\SQLEXPRESS (Windows Authentication)
-- =======================================================

IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = N'RedBusDB')
BEGIN
    CREATE DATABASE RedBusDB;
    PRINT 'Database RedBusDB created successfully.';
END
ELSE
BEGIN
    PRINT 'Database RedBusDB already exists.';
END
GO

USE RedBusDB;
GO

IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = N'Travelers' AND type = 'U')
BEGIN
    CREATE TABLE Travelers (
        Id NVARCHAR(50) NOT NULL PRIMARY KEY,
        Name NVARCHAR(100) NOT NULL,
        Email NVARCHAR(150) NOT NULL UNIQUE,
        Phone NVARCHAR(20) NOT NULL UNIQUE,
        City NVARCHAR(100) NOT NULL,
        FromCity NVARCHAR(100) NULL,
        ToCity NVARCHAR(100) NULL,
        TravelDate DATE NULL,
        Gender NVARCHAR(30) NULL DEFAULT 'Prefer not to say',
        Preference NVARCHAR(50) NULL DEFAULT 'AC Sleeper',
        SeatCount INT NOT NULL DEFAULT 1,
        TotalFare DECIMAL(10,2) NOT NULL DEFAULT 0.00,
        Status NVARCHAR(20) NOT NULL DEFAULT 'Active',
        CreatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
        UpdatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
    );

    PRINT 'Table Travelers created successfully.';

    INSERT INTO Travelers (Id, Name, Email, Phone, City, FromCity, ToCity, TravelDate, Gender, Preference, SeatCount, TotalFare, Status, CreatedAt, UpdatedAt)
    VALUES
    ('trv_101', 'Ananya Sharma', 'ananya.sharma@example.com', '9876543210', 'Bengaluru', 'Bengaluru', 'Hyderabad', DATEADD(day, 2, CAST(GETDATE() AS DATE)), 'Female', 'AC Sleeper', 1, 1450.00, 'Active', SYSUTCDATETIME(), SYSUTCDATETIME()),
    ('trv_102', 'Vikram Malhotra', 'vikram.m@example.com', '9823456781', 'Mumbai', 'Mumbai', 'Pune', DATEADD(day, 1, CAST(GETDATE() AS DATE)), 'Male', 'AC Seater', 1, 680.00, 'Active', SYSUTCDATETIME(), SYSUTCDATETIME()),
    ('trv_103', 'Pooja Reddy', 'pooja.reddy@example.com', '9740123456', 'Hyderabad', 'Hyderabad', 'Bengaluru', DATEADD(day, 3, CAST(GETDATE() AS DATE)), 'Female', 'AC Sleeper', 2, 2900.00, 'Active', SYSUTCDATETIME(), SYSUTCDATETIME()),
    ('trv_104', 'Karthik Sundaram', 'karthik.s@example.com', '9445123987', 'Chennai', 'Chennai', 'Bengaluru', DATEADD(day, 4, CAST(GETDATE() AS DATE)), 'Male', 'Non-AC Sleeper', 1, 820.00, 'Active', SYSUTCDATETIME(), SYSUTCDATETIME()),
    ('trv_105', 'Rohan Deshmukh', 'rohan.d@example.com', '9922114455', 'Pune', 'Pune', 'Goa', DATEADD(day, 5, CAST(GETDATE() AS DATE)), 'Male', 'AC Seater', 1, 1150.00, 'Inactive', SYSUTCDATETIME(), SYSUTCDATETIME()),
    ('trv_106', 'Meera Sen', 'meera.sen@example.com', '9811223344', 'Kolkata', 'Delhi', 'Jaipur', DATEADD(day, 2, CAST(GETDATE() AS DATE)), 'Female', 'AC Sleeper', 1, 950.00, 'Active', SYSUTCDATETIME(), SYSUTCDATETIME());

    PRINT 'Sample travelers inserted successfully.';
END
GO
