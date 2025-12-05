// src/utils/email.js

class EmailService {
  /**
   * Send quote email to lead.
   * In production, plug in a real email provider (SendGrid, SES, etc.).
   */
  static async sendQuoteEmail(lead, quote, event, packageInfo) {
    const emailContent = {
      to: lead.email,
      subject: `Your Quote for ${event.name}`,
      body: `
Dear ${lead.name},

Thank you for your interest in ${event.name}!

Quote Details:
- Package: ${packageInfo.name}
- Travel Date: ${new Date(quote.travelDate).toLocaleDateString()}
- Number of Travelers: ${quote.numberOfTravelers}
- Base Price: $${quote.basePrice.toFixed ? quote.basePrice.toFixed(2) : quote.basePrice}
- Final Price: $${quote.finalPrice.toFixed ? quote.finalPrice.toFixed(2) : quote.finalPrice}

This quote is valid until ${new Date(quote.validUntil).toLocaleDateString()}.

Best regards,
Sports Travel Team
      `.trim(),
    };

    // For now, just log the email content
    console.log("📧 EMAIL SENT:", emailContent);

    // Simulate email service response
    return {
      success: true,
      message: "Email sent successfully",
      emailId: `email_${Date.now()}`,
    };
  }
}

export default EmailService;
