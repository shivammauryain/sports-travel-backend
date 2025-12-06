// src/utils/email.js
import nodemailer from 'nodemailer';

class EmailService {
  static getTransporter() {
    return nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  /**
   * Send quote email to lead.
   */
  static async sendQuoteEmail(lead, quote, event, packageInfo) {
    try {
      const transporter = this.getTransporter();
      const receiverEmail = process.env.RECEIVER_EMAIL || process.env.EMAIL_USER;

      const emailSubject = `Quote Generated: ${event.name} - ${lead.name}`;
      
      const emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #f59e0b;">New Quote Generated</h2>
          
          <h3>Lead Information</h3>
          <p><strong>Name:</strong> ${lead.name}</p>
          <p><strong>Email:</strong> ${lead.email}</p>
          <p><strong>Phone:</strong> ${lead.phone}</p>
          
          <hr style="border: 1px solid #e5e7eb; margin: 20px 0;">
          
          <h3>Quote Details</h3>
          <p><strong>Event:</strong> ${event.name}</p>
          <p><strong>Package:</strong> ${packageInfo.name} (${packageInfo.tier})</p>
          <p><strong>Travel Date:</strong> ${new Date(quote.travelDate).toLocaleDateString('en-IN', { 
            day: 'numeric', 
            month: 'long', 
            year: 'numeric' 
          })}</p>
          <p><strong>Number of Travelers:</strong> ${quote.numberOfTravelers}</p>
          
          <hr style="border: 1px solid #e5e7eb; margin: 20px 0;">
          
          <h3>Pricing</h3>
          <p><strong>Base Price:</strong> ₹${quote.basePrice?.toLocaleString('en-IN') || 0}</p>
          ${quote.adjustments && quote.adjustments.length > 0 ? `
            <p><strong>Adjustments:</strong></p>
            <ul>
              ${quote.adjustments.map(adj => `
                <li>${adj.reason}: ${adj.type === 'percentage' ? adj.value + '%' : '₹' + adj.value}</li>
              `).join('')}
            </ul>
          ` : ''}
          <p style="font-size: 18px; color: #f59e0b;"><strong>Final Price: ₹${quote.finalPrice?.toLocaleString('en-IN') || 0}</strong></p>
          
          <hr style="border: 1px solid #e5e7eb; margin: 20px 0;">
          
          <p><strong>Valid Until:</strong> ${new Date(quote.validUntil).toLocaleDateString('en-IN', { 
            day: 'numeric', 
            month: 'long', 
            year: 'numeric' 
          })}</p>
          
          ${quote.notes ? `<p><strong>Notes:</strong> ${quote.notes}</p>` : ''}
          
          <hr style="border: 1px solid #e5e7eb; margin: 20px 0;">
          
          <p style="color: #6b7280; font-size: 12px;">
            This is an automated notification from Sports Travel CRM.
          </p>
        </div>
      `;

      const emailText = `
New Quote Generated

Lead Information:
Name: ${lead.name}
Email: ${lead.email}
Phone: ${lead.phone}

Quote Details:
Event: ${event.name}
Package: ${packageInfo.name} (${packageInfo.tier})
Travel Date: ${new Date(quote.travelDate).toLocaleDateString()}
Number of Travelers: ${quote.numberOfTravelers}

Pricing:
Base Price: ₹${quote.basePrice?.toLocaleString('en-IN') || 0}
Final Price: ₹${quote.finalPrice?.toLocaleString('en-IN') || 0}

Valid Until: ${new Date(quote.validUntil).toLocaleDateString()}

${quote.notes ? 'Notes: ' + quote.notes : ''}
      `.trim();

      const info = await transporter.sendMail({
        from: `"Sports Travel CRM" <${process.env.EMAIL_USER}>`,
        to: receiverEmail,
        subject: emailSubject,
        text: emailText,
        html: emailHtml,
        replyTo: lead.email,
      });

      console.log('✅ Quote email sent successfully:', info.messageId);
      
      return {
        success: true,
        message: "Email sent successfully",
        emailId: info.messageId,
      };
    } catch (error) {
      console.error('❌ Failed to send quote email:', error);
      
      return {
        success: false,
        message: "Failed to send email",
        error: error.message,
      };
    }
  }
}

export default EmailService;
