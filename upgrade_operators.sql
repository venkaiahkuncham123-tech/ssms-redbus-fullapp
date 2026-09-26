USE RedBusDB;
GO

IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Travelers' AND COLUMN_NAME = 'BusOperator')
BEGIN
    ALTER TABLE Travelers ADD BusOperator NVARCHAR(100) NULL DEFAULT 'VRL Travels';
    PRINT 'Added BusOperator column.';
END
GO

IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Travelers' AND COLUMN_NAME = 'BusNumber')
BEGIN
    ALTER TABLE Travelers ADD BusNumber NVARCHAR(50) NULL DEFAULT 'KA-01-F-2024';
    PRINT 'Added BusNumber column.';
END
GO

-- Populate initial records
UPDATE Travelers SET BusOperator = 'VRL Travels', BusNumber = 'KA-01-F-2024' WHERE Id = 'trv_101';
UPDATE Travelers SET BusOperator = 'SRS Travels', BusNumber = 'MH-12-Q-4455' WHERE Id = 'trv_102';
UPDATE Travelers SET BusOperator = 'Orange Tours & Travels', BusNumber = 'AP-09-V-7890' WHERE Id = 'trv_103';
UPDATE Travelers SET BusOperator = 'KPN Travels', BusNumber = 'TN-01-AB-1234' WHERE Id = 'trv_104';
UPDATE Travelers SET BusOperator = 'IntrCity SmartBus', BusNumber = 'MH-14-TR-9900' WHERE Id = 'trv_105';
UPDATE Travelers SET BusOperator = 'Zingbus Plus', BusNumber = 'DL-01-RT-5678' WHERE Id = 'trv_106';

SELECT Id, Name, BusOperator, BusNumber, FromCity, ToCity, TravelDate, Preference, SelectedSeats, TotalFare FROM Travelers;
GO
