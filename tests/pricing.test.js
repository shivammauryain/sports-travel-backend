import PricingCalculator from '../src/utils/pricing.js';

describe('PricingCalculator', () => {
  // Mock package object
  const mockPackage = {
    basePrice: 1000
  };
  
  describe('Seasonal Multiplier', () => {
    test('should apply 20% for June', () => {
      const travelDate = new Date('2025-06-15');
      const eventDate = new Date('2025-06-20');
      const calculator = new PricingCalculator(mockPackage, travelDate, eventDate, 2);
      
      const result = calculator.calculate();
      
      expect(result.adjustments.seasonalMultiplier.percentage).toBe(20);
      expect(result.adjustments.seasonalMultiplier.value).toBe(200);
    });
    
    test('should apply 20% for July', () => {
      const travelDate = new Date('2025-07-10');
      const eventDate = new Date('2025-07-15');
      const calculator = new PricingCalculator(mockPackage, travelDate, eventDate, 2);
      
      const result = calculator.calculate();
      
      expect(result.adjustments.seasonalMultiplier.percentage).toBe(20);
      expect(result.adjustments.seasonalMultiplier.value).toBe(200);
    });
    
    test('should apply 20% for December', () => {
      const travelDate = new Date('2025-12-15');
      const eventDate = new Date('2025-12-20');
      const calculator = new PricingCalculator(mockPackage, travelDate, eventDate, 2);
      
      const result = calculator.calculate();
      
      expect(result.adjustments.seasonalMultiplier.percentage).toBe(20);
      expect(result.adjustments.seasonalMultiplier.value).toBe(200);
    });
    
    test('should apply 10% for April', () => {
      const travelDate = new Date('2025-04-15');
      const eventDate = new Date('2025-04-20');
      const calculator = new PricingCalculator(mockPackage, travelDate, eventDate, 2);
      
      const result = calculator.calculate();
      
      expect(result.adjustments.seasonalMultiplier.percentage).toBe(10);
      expect(result.adjustments.seasonalMultiplier.value).toBe(100);
    });
    
    test('should apply 10% for May', () => {
      const travelDate = new Date('2025-05-15');
      const eventDate = new Date('2025-05-20');
      const calculator = new PricingCalculator(mockPackage, travelDate, eventDate, 2);
      
      const result = calculator.calculate();
      
      expect(result.adjustments.seasonalMultiplier.percentage).toBe(10);
      expect(result.adjustments.seasonalMultiplier.value).toBe(100);
    });
    
    test('should apply 10% for September', () => {
      const travelDate = new Date('2025-09-15');
      const eventDate = new Date('2025-09-20');
      const calculator = new PricingCalculator(mockPackage, travelDate, eventDate, 2);
      
      const result = calculator.calculate();
      
      expect(result.adjustments.seasonalMultiplier.percentage).toBe(10);
      expect(result.adjustments.seasonalMultiplier.value).toBe(100);
    });
    
    test('should apply 0% for other months', () => {
      const travelDate = new Date('2025-03-15');
      const eventDate = new Date('2025-03-20');
      const calculator = new PricingCalculator(mockPackage, travelDate, eventDate, 2);
      
      const result = calculator.calculate();
      
      expect(result.adjustments.seasonalMultiplier.percentage).toBe(0);
      expect(result.adjustments.seasonalMultiplier.value).toBe(0);
    });
  });
  
  describe('Early Bird Discount', () => {
    test('should apply 10% discount for exactly 120 days before event', () => {
      const travelDate = new Date('2025-01-01');
      const eventDate = new Date('2025-05-01'); // 120 days
      const calculator = new PricingCalculator(mockPackage, travelDate, eventDate, 2);
      
      const result = calculator.calculate();
      
      expect(result.adjustments.earlyBirdDiscount.percentage).toBe(10);
      expect(result.adjustments.earlyBirdDiscount.value).toBe(-100);
    });
    
    test('should apply 10% discount for more than 120 days', () => {
      const travelDate = new Date('2025-01-01');
      const eventDate = new Date('2025-06-01');
      const calculator = new PricingCalculator(mockPackage, travelDate, eventDate, 2);
      
      const result = calculator.calculate();
      
      expect(result.adjustments.earlyBirdDiscount.percentage).toBe(10);
      expect(result.adjustments.earlyBirdDiscount.value).toBe(-100);
    });
    
    test('should not apply discount for less than 120 days', () => {
      const travelDate = new Date('2025-05-01');
      const eventDate = new Date('2025-06-01');
      const calculator = new PricingCalculator(mockPackage, travelDate, eventDate, 2);
      
      const result = calculator.calculate();
      
      expect(result.adjustments.earlyBirdDiscount.percentage).toBe(0);
      expect(result.adjustments.earlyBirdDiscount.value).toBe(0);
    });
  });
  
  describe('Last Minute Surcharge', () => {
    test('should apply 25% surcharge for less than 15 days', () => {
      const travelDate = new Date('2025-06-01');
      const eventDate = new Date('2025-06-10');
      const calculator = new PricingCalculator(mockPackage, travelDate, eventDate, 2);
      
      const result = calculator.calculate();
      
      expect(result.adjustments.lastMinuteSurcharge.percentage).toBe(25);
      expect(result.adjustments.lastMinuteSurcharge.value).toBe(250);
    });
    
    test('should apply 25% surcharge for 14 days', () => {
      const travelDate = new Date('2025-06-01');
      const eventDate = new Date('2025-06-15');
      const calculator = new PricingCalculator(mockPackage, travelDate, eventDate, 2);
      
      const result = calculator.calculate();
      
      expect(result.adjustments.lastMinuteSurcharge.percentage).toBe(25);
      expect(result.adjustments.lastMinuteSurcharge.value).toBe(250);
    });
    
    test('should not apply surcharge for 15 days or more', () => {
      const travelDate = new Date('2025-06-01');
      const eventDate = new Date('2025-06-16');
      const calculator = new PricingCalculator(mockPackage, travelDate, eventDate, 2);
      
      const result = calculator.calculate();
      
      expect(result.adjustments.lastMinuteSurcharge.percentage).toBe(0);
      expect(result.adjustments.lastMinuteSurcharge.value).toBe(0);
    });
  });
  
  describe('Group Discount', () => {
    test('should apply 8% discount for exactly 4 travelers', () => {
      const travelDate = new Date('2025-06-01');
      const eventDate = new Date('2025-06-15');
      const calculator = new PricingCalculator(mockPackage, travelDate, eventDate, 4);
      
      const result = calculator.calculate();
      
      expect(result.adjustments.groupDiscount.percentage).toBe(8);
      expect(result.adjustments.groupDiscount.value).toBe(-80);
    });
    
    test('should apply 8% discount for more than 4 travelers', () => {
      const travelDate = new Date('2025-06-01');
      const eventDate = new Date('2025-06-15');
      const calculator = new PricingCalculator(mockPackage, travelDate, eventDate, 10);
      
      const result = calculator.calculate();
      
      expect(result.adjustments.groupDiscount.percentage).toBe(8);
      expect(result.adjustments.groupDiscount.value).toBe(-80);
    });
    
    test('should not apply discount for less than 4 travelers', () => {
      const travelDate = new Date('2025-06-01');
      const eventDate = new Date('2025-06-15');
      const calculator = new PricingCalculator(mockPackage, travelDate, eventDate, 3);
      
      const result = calculator.calculate();
      
      expect(result.adjustments.groupDiscount.percentage).toBe(0);
      expect(result.adjustments.groupDiscount.value).toBe(0);
    });
  });
  
  describe('Weekend Surcharge', () => {
    test('should apply 8% surcharge for Saturday', () => {
      const travelDate = new Date('2025-06-01');
      const eventDate = new Date('2025-06-14'); // Saturday
      const calculator = new PricingCalculator(mockPackage, travelDate, eventDate, 2);
      
      const result = calculator.calculate();
      
      expect(result.adjustments.weekendSurcharge.percentage).toBe(8);
      expect(result.adjustments.weekendSurcharge.value).toBe(80);
    });
    
    test('should apply 8% surcharge for Sunday', () => {
      const travelDate = new Date('2025-06-01');
      const eventDate = new Date('2025-06-15'); // Sunday
      const calculator = new PricingCalculator(mockPackage, travelDate, eventDate, 2);
      
      const result = calculator.calculate();
      
      expect(result.adjustments.weekendSurcharge.percentage).toBe(8);
      expect(result.adjustments.weekendSurcharge.value).toBe(80);
    });
    
    test('should not apply surcharge for weekdays', () => {
      const travelDate = new Date('2025-06-01');
      const eventDate = new Date('2025-06-16'); 
      const calculator = new PricingCalculator(mockPackage, travelDate, eventDate, 2);
      
      const result = calculator.calculate();
      
      expect(result.adjustments.weekendSurcharge.percentage).toBe(0);
      expect(result.adjustments.weekendSurcharge.value).toBe(0);
    });
  });
  
  describe('Complex Scenarios', () => {
    test('should calculate correctly with multiple adjustments', () => {
      const travelDate = new Date('2025-05-20');
      const eventDate = new Date('2025-06-14'); 
      const calculator = new PricingCalculator(mockPackage, travelDate, eventDate, 4);
      
      const result = calculator.calculate();
      
      expect(result.basePrice).toBe(1000);
      expect(result.finalPrice).toBe(1200);
    });
    
    test('should handle early bird with seasonal', () => {
      const travelDate = new Date('2025-01-01');
      const eventDate = new Date('2025-05-30'); 
      const calculator = new PricingCalculator(mockPackage, travelDate, eventDate, 2);
      
      const result = calculator.calculate();
      
      expect(result.adjustments.seasonalMultiplier.value).toBe(100);
      expect(result.adjustments.earlyBirdDiscount.value).toBe(-100);
      expect(result.finalPrice).toBe(1000);
    });
    
    test('should handle last minute with weekend and group', () => {
      const travelDate = new Date('2025-03-05');
      const eventDate = new Date('2025-03-15'); 
      const calculator = new PricingCalculator(mockPackage, travelDate, eventDate, 5);
      
      const result = calculator.calculate();
      
      expect(result.adjustments.lastMinuteSurcharge.value).toBe(250);
      expect(result.adjustments.groupDiscount.value).toBe(-80);
    });
    
    test('should handle maximum discounts scenario', () => {
      const travelDate = new Date('2025-01-01');
      const eventDate = new Date('2025-06-02'); 
      const calculator = new PricingCalculator(mockPackage, travelDate, eventDate, 6);
      
      const result = calculator.calculate();
      
      expect(result.finalPrice).toBe(1020);
    });
    
    test('should handle maximum surcharges scenario', () => {
      const travelDate = new Date('2025-06-08');
      const eventDate = new Date('2025-06-14'); 
      const calculator = new PricingCalculator(mockPackage, travelDate, eventDate, 2);
      
      const result = calculator.calculate();
      
      expect(result.finalPrice).toBe(1530);
    });
    
    test('should round final price correctly', () => {
      const basePrice = 999;
      const travelDate = new Date('2025-04-01');
      const eventDate = new Date('2025-04-15');
      const calculator = new PricingCalculator(mockPackage, travelDate, eventDate, 4);
      
      const result = calculator.calculate();
      
      expect(result.finalPrice).toBe(Math.round(result.finalPrice * 100) / 100);
    });
  });
});
