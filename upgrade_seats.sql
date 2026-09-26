-- Add SelectedSeats column to Travelers table if it doesn't exist
USE RedBusDB;
GO

IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Travelers' AND COLUMN_NAME = 'SelectedSeats')
BEGIN
    ALTER TABLE Travelers ADD SelectedSeats NVARCHAR(150) NULL;
    PRINT 'Added SelectedSeats column to Travelers table.';
END
GO

-- Populate initial selected seats for existing records
UPDATE Travelers SET SelectedSeats = 'U1' WHERE Id = 'trv_101' AND (SelectedSeats IS NULL OR SelectedSeats = '');
UPDATE Travelers SET SelectedSeats = '1W' WHERE Id = 'trv_102' AND (SelectedSeats IS NULL OR SelectedSeats = '');
UPDATE Travelers SET SelectedSeats = 'U2,U3' WHERE Id = 'trv_103' AND (SelectedSeats IS NULL OR SelectedSeats = '');
UPDATE Travelers SET SelectedSeats = 'L1' WHERE Id = 'trv_104' AND (SelectedSeats IS NULL OR SelectedSeats = '');
UPDATE Travelers SET SelectedSeats = '4W' WHERE Id = 'trv_105' AND (SelectedSeats IS NULL OR SelectedSeats = '');
UPDATE Travelers SET SelectedSeats = 'L3' WHERE Id = 'trv_106' AND (SelectedSeats IS NULL OR SelectedSeats = '');

SELECT Id, Name, FromCity, ToCity, TravelDate, Preference, SeatCount, SelectedSeats, TotalFare FROM Travelers;
GO
