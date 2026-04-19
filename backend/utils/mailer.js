const nodemailer = require("nodemailer");

const sendBookingEmail = async (userEmail, userName, bookingDetails) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const { itemTitle, startDate, endDate, totalPrice, bookingId } = bookingDetails;

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f9f9f9; color: #1a1a1a; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.05); }
        .header { background-color: #000000; color: #ffffff; padding: 60px 40px; text-align: center; }
        .header h1 { margin: 0; font-size: 32px; font-weight: 800; letter-spacing: -1px; text-transform: uppercase; }
        .header p { margin: 10px 0 0; opacity: 0.6; font-size: 12px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; }
        .content { padding: 40px; }
        .intro { font-size: 18px; font-weight: 600; margin-bottom: 24px; }
        .item-card { background-color: #fcfcfc; border: 1px solid #eeeeee; border-radius: 16px; padding: 24px; margin-bottom: 32px; }
        .item-title { font-size: 20px; font-weight: 800; margin-bottom: 8px; }
        .item-details { font-size: 14px; color: #666666; line-height: 1.6; }
        .price-summary { border-top: 1px solid #eeeeee; margin-top: 24px; pt-24px; display: flex; justify-content: space-between; align-items: center; }
        .total-label { font-size: 12px; font-weight: 700; text-transform: uppercase; color: #999999; }
        .total-price { font-size: 24px; font-weight: 800; }
        .footer { padding: 40px; background-color: #fafafa; border-top: 1px solid #eeeeee; text-align: center; font-size: 12px; color: #999999; }
        .button { display: inline-block; padding: 16px 32px; background-color: #000000; color: #ffffff; text-decoration: none; border-radius: 12px; font-weight: 700; font-size: 14px; margin-top: 32px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Thriftyy</h1>
          <p>Official Archive Confirmation</p>
        </div>
        <div class="content">
          <div class="intro">Order Confirmed, ${userName}.</div>
          <p>Your selection from the Thriftyy Archive has been secured. Your piece is currently undergoing preparation and inspection for your upcoming rental period.</p>
          
          <div class="item-card">
            <div class="item-title">${itemTitle}</div>
            <div class="item-details">
              <strong>Order ID:</strong> ${bookingId}<br>
              <strong>Rental Period:</strong> ${new Date(startDate).toLocaleDateString()} — ${new Date(endDate).toLocaleDateString()}
            </div>
            <div class="price-summary">
              <span class="total-label">Total Impact</span>
              <span class="total-price">$${totalPrice}</span>
            </div>
          </div>
          
          <a href="#" class="button">VIEW IN DASHBOARD</a>
        </div>
        <div class="footer">
          © 2026 Thriftyy Limited. All rights reserved.<br>
          This is an automated confirmation of your rental agreement.
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    await transporter.sendMail({
      from: `"Thriftyy Archive" <${process.env.SMTP_USER}>`,
      to: userEmail,
      subject: `Order Confirmed: ${itemTitle} | Thriftyy Archive`,
      html: htmlContent,
    });
    console.log(`✅ Confirmation email sent to ${userEmail}`);
  } catch (error) {
    console.error("❌ Email failed to send:", error);
  }
};

module.exports = { sendBookingEmail };
