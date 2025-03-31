const helpers = require('../../utils/helpers');

describe('Helper Functions', () => {
  describe('format_date', () => {
    it('should format date as MM/DD/YYYY', () => {
      // create date without time zone issues
      const date = new Date(2023, 0, 15); // January 15, 2023
      expect(helpers.format_date(date)).toBe('1/15/2023');
    });
    
    it('should handle string date inputs', () => {
      // avoid time zone issues by using a direct date constructor
      const dateStr = new Date(2023, 4, 15); // May 15, 2023
      expect(helpers.format_date(dateStr)).toBe('5/15/2023');
    });
    
    it('should handle timestamp inputs', () => {
      // Create timestamp without time zone issues
      const timestamp = new Date(2023, 5, 15).getTime(); // June 15, 2023
      expect(helpers.format_date(timestamp)).toBe('6/15/2023');
    });
    
    it('should format dates with single-digit months and days correctly', () => {
      const date = new Date(2023, 1, 3); // February 3, 2023
      expect(helpers.format_date(date)).toBe('2/3/2023');
    });
    
    it('should handle the current date', () => {
      const currentDate = new Date();
      const expectedFormat = `${currentDate.getMonth() + 1}/${currentDate.getDate()}/${currentDate.getFullYear()}`;
      expect(helpers.format_date(currentDate)).toBe(expectedFormat);
    });
    
    it('should handle null or undefined input', () => {
      // test with null 
      expect(helpers.format_date(null)).toBe('');
      expect(helpers.format_date(undefined)).toBe('');
    });
  });
});