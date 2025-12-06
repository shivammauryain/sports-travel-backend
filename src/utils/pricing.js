
class PricingCalculator {
  constructor(travelPackage, travelDate, eventStartDate, numberOfTravelers) {
    this.basePrice = travelPackage.basePrice;
    this.travelDate = new Date(travelDate);
    this.eventStartDate = new Date(eventStartDate);
    this.numberOfTravelers = numberOfTravelers;
    this.adjustments = {};
  }

  // Seasonal multiplier: +20% for June, July, December; +10% for April, May, September
  calculateSeasonalMultiplier() {
    const month = this.eventStartDate.getMonth() + 1; 
    let percentage = 0;

    if ([6, 7, 12].includes(month)) {
      percentage = 20;
    } else if ([4, 5, 9].includes(month)) {
      percentage = 10;
    }

    const value = (this.basePrice * percentage) / 100;
    this.adjustments.seasonalMultiplier = { value, percentage };
    return value;
  }

  // Early bird discount: -10% if booked 120 days in advance
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

  // Last minute surcharge: +25% if less than 15 days until event
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

  // Group discount: -8% if 4 or more travelers
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

  // Weekend surcharge: +8% if event starts on Saturday or Sunday
  calculateWeekendSurcharge() {
    const dayOfWeek = this.eventStartDate.getDay();

    if (dayOfWeek === 0 || dayOfWeek === 6) {
      const percentage = 8;
      const value = (this.basePrice * percentage) / 100;
      this.adjustments.weekendSurcharge = { value, percentage };
      return value;
    }

    this.adjustments.weekendSurcharge = { value: 0, percentage: 0 };
    return 0;
  }

  // Main calculation method
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

  calculateFinalPrice() {
    return this.calculate();
  }
}

export default PricingCalculator;
