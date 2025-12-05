// src/utils/pricingCalculator.js

class PricingCalculator {
  /**
   * @param {Object} travelPackage - Package document
   * @param {Date | string} travelDate
   * @param {Date | string} eventStartDate
   * @param {number} numberOfTravelers
   */
  constructor(travelPackage, travelDate, eventStartDate, numberOfTravelers) {
    this.basePrice = travelPackage.basePrice; // per traveler or total – your business logic
    this.travelDate = new Date(travelDate);
    this.eventStartDate = new Date(eventStartDate);
    this.numberOfTravelers = numberOfTravelers;
    this.adjustments = {};
  }

  calculateSeasonalMultiplier() {
    const month = this.eventStartDate.getMonth() + 1; // 1-12
    let percentage = 0;

    if ([6, 7, 12].includes(month)) {
      percentage = 20; // June, July, December
    } else if ([4, 5, 9].includes(month)) {
      percentage = 10; // April, May, September
    }

    const value = (this.basePrice * percentage) / 100;
    this.adjustments.seasonalMultiplier = { value, percentage };
    return value;
  }

  calculateEarlyBirdDiscount() {
    const daysUntilEvent = Math.floor(
      (this.eventStartDate - this.travelDate) / (1000 * 60 * 60 * 24)
    );

    if (daysUntilEvent >= 120) {
      const percentage = 10;
      const value = -(this.basePrice * percentage) / 100;
      this.adjustments.earlyBirdDiscount = { value, percentage };
      return value;
    }

    this.adjustments.earlyBirdDiscount = { value: 0, percentage: 0 };
    return 0;
  }

  calculateLastMinuteSurcharge() {
    const daysUntilEvent = Math.floor(
      (this.eventStartDate - this.travelDate) / (1000 * 60 * 60 * 24)
    );

    if (daysUntilEvent < 15) {
      const percentage = 25;
      const value = (this.basePrice * percentage) / 100;
      this.adjustments.lastMinuteSurcharge = { value, percentage };
      return value;
    }

    this.adjustments.lastMinuteSurcharge = { value: 0, percentage: 0 };
    return 0;
  }

  calculateGroupDiscount() {
    if (this.numberOfTravelers >= 4) {
      const percentage = 8;
      const value = -(this.basePrice * percentage) / 100;
      this.adjustments.groupDiscount = { value, percentage };
      return value;
    }

    this.adjustments.groupDiscount = { value: 0, percentage: 0 };
    return 0;
  }

  calculateWeekendSurcharge() {
    const dayOfWeek = this.eventStartDate.getDay();

    // Saturday (6) or Sunday (0)
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      const percentage = 8;
      const value = (this.basePrice * percentage) / 100;
      this.adjustments.weekendSurcharge = { value, percentage };
      return value;
    }

    this.adjustments.weekendSurcharge = { value: 0, percentage: 0 };
    return 0;
  }

  /**
   * Internal calculator
   */
  calculate() {
    let totalPrice = this.basePrice;

    totalPrice += this.calculateSeasonalMultiplier();
    totalPrice += this.calculateEarlyBirdDiscount();
    totalPrice += this.calculateLastMinuteSurcharge();
    totalPrice += this.calculateGroupDiscount();
    totalPrice += this.calculateWeekendSurcharge();

    return {
      basePrice: this.basePrice,
      adjustments: this.adjustments,
      finalPrice: Math.round(totalPrice * 100) / 100,
    };
  }

  /**
   * Public API used in controller: calculator.calculateFinalPrice()
   */
  calculateFinalPrice() {
    return this.calculate();
  }
}

export default PricingCalculator;
