import os
import random
import smtplib
import logging
import io
from pathlib import Path
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.image import MIMEImage
import qrcode
from app.config import settings

logger = logging.getLogger("techtalk.email")

def generate_otp() -> str:
    """Generate a 6-digit numeric OTP"""
    return str(random.randint(100000, 999999))

def get_logo_image_bytes() -> bytes:
    """Load the official company logo bytes for email CID embedding"""
    possible_paths = [
        Path(__file__).resolve().parent.parent / "assets" / "nexzibyte_logo.png",
        Path(__file__).resolve().parent.parent.parent / "techtalk" / "public" / "images" / "nexzibyte_exact_logo_as_is.png",
        Path(__file__).resolve().parent.parent.parent / "techtalk" / "public" / "images" / "nexzibyte-logo-clean.png"
    ]
    for p in possible_paths:
        if p.exists():
            try:
                with open(p, "rb") as f:
                    return f.read()
            except Exception as e:
                logger.warning(f"Could not read logo from {p}: {e}")
    return b""

def generate_qr_code_bytes(data: str) -> bytes:
    """Generate PNG bytes of a QR code for digital passes"""
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_M,
        box_size=8,
        border=2,
    )
    qr.add_data(data)
    qr.make(fit=True)
    img = qr.make_image(fill_color="#0f172a", back_color="#ffffff")
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    return buf.getvalue()

def send_smtp_mail(to_email: str, subject: str, text_content: str, html_content: str, inline_images: dict = None) -> bool:
    """
    Core helper to send MIME email via configured SMTP with inline CID images.
    inline_images: dict of {cid_name: (image_bytes, subtype)}
    """
    try:
        print("\n" + "="*60)
        print("[TECHTALK EMAIL DISPATCH]")
        print(f"To: {to_email}")
        # Encode safely for Windows CP1252 consoles
        safe_subject = subject.encode("ascii", "replace").decode("ascii")
        print(f"Subject: {safe_subject}")
        print("="*60 + "\n")
    except Exception:
        pass

    smtp_user = settings.SMTP_USER.strip() if settings.SMTP_USER else ""
    smtp_password = settings.SMTP_PASSWORD.replace(" ", "").strip() if settings.SMTP_PASSWORD else ""

    if not smtp_user or not smtp_password or "YOUR_" in smtp_password:
        logger.info(f"SMTP not fully configured. Email logged to console.")
        return True

    try:
        # Standard MIME structure for HTML + Inline attachments
        msg_root = MIMEMultipart("related")
        msg_root["Subject"] = subject
        msg_root["From"] = settings.EMAIL_FROM
        msg_root["To"] = to_email

        msg_alternative = MIMEMultipart("alternative")
        msg_root.attach(msg_alternative)

        # Plain text
        part_text = MIMEText(text_content, "plain", "utf-8")
        msg_alternative.attach(part_text)

        # HTML
        part_html = MIMEText(html_content, "html", "utf-8")
        msg_alternative.attach(part_html)

        # Attach inline images
        if inline_images:
            for cid, img_info in inline_images.items():
                img_data, img_subtype = img_info
                if img_data:
                    img_part = MIMEImage(img_data, _subtype=img_subtype)
                    img_part.add_header("Content-ID", f"<{cid}>")
                    img_part.add_header("Content-Disposition", "inline", filename=f"{cid}.{img_subtype}")
                    msg_root.attach(img_part)

        if int(settings.SMTP_PORT) == 465:
            server = smtplib.SMTP_SSL(settings.SMTP_HOST, int(settings.SMTP_PORT), timeout=14)
            server.login(smtp_user, smtp_password)
        else:
            server = smtplib.SMTP(settings.SMTP_HOST, int(settings.SMTP_PORT), timeout=14)
            server.ehlo()
            server.starttls()
            server.login(smtp_user, smtp_password)
        
        server.sendmail(settings.EMAIL_FROM, [to_email], msg_root.as_string())
        server.quit()
        print(f"[SUCCESS] Real email successfully delivered to {to_email} via SMTP!")
        logger.info(f"Email successfully delivered to {to_email} via SMTP.")
        return True
    except Exception as e:
        print(f"[ERROR] SMTP delivery to {to_email} failed with error: {e}")
        logger.warning(f"SMTP send failed ({e}). Fallback logged to console.")
        return False

def resolve_clean_user_name(to_email: str, name: str = None) -> str:
    """Helper to ensure authentic real names are used in all emails, preventing fake test names."""
    if name and name.strip():
        cleaned = name.strip()
        if cleaned.lower() not in ["alex morgan", "string", "none", "null", "user", "member", "test", "test user"]:
            return cleaned
    clean_email = (to_email or "").lower().strip()
    if clean_email in ["mindhilalitha@gmail.com", "aiswarya@nexzibyte.com"]:
        return "Aiswarya Mindhi"
    if clean_email in ["nexzibyteadmin@gmail.com", "nexzibyte@gmail.com"]:
        return "NexziByte Super Admin"
    # Format readable name from email username (e.g. john.doe@... -> John Doe)
    prefix = clean_email.split("@")[0].replace(".", " ").replace("_", " ").replace("-", " ")
    words = [w.capitalize() for w in prefix.split() if w and not w.isdigit()]
    return " ".join(words) if words else "Member"

async def send_verification_email(to_email: str, name: str, otp_code: str, verification_link: str = None) -> bool:
    """
    Sends a branded verification email with OTP according to NexziByte TechTalk format
    matching the exact modern dark card design with company logo and lime-green OTP badge.
    """
    user_name = resolve_clean_user_name(to_email, name)
    subject = f"Your TechTalk Login Code: {otp_code}"
    
    text_content = f"""Hey {user_name},

Your temporary login code to access TechTalk Community is:

{otp_code}

This code will expire in 5 minutes. Never share this code with anyone.

If you think you've received this email in error, please ignore this email.

Thanks,
TechTalk Community | NexziByte Solutions
"""

    logo_bytes = get_logo_image_bytes()
    has_logo = bool(logo_bytes)

    # Logo HTML: uses inline CID image with fallback styled wordmark
    if has_logo:
        logo_html = """
        <div style="background-color: #ffffff; border-radius: 12px; padding: 8px 14px; display: inline-block; box-shadow: 0 2px 8px rgba(0,0,0,0.2);">
          <img src="cid:company_logo" alt="NexziByte TechTalk" height="38" style="height: 38px; width: auto; display: block; max-width: 180px; object-fit: contain;" />
        </div>
        """
    else:
        logo_html = """
        <div style="background-color: #ffffff; border-radius: 12px; padding: 10px 16px; display: inline-block;">
          <span style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 20px; font-weight: 900; color: #0a194f; letter-spacing: 0.5px;">
            NE<span style="color: #7c3aed;">X</span>ZIBYTE
          </span>
          <span style="color: #cbd5e1; margin: 0 6px; font-size: 18px;">|</span>
          <span style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 18px; font-weight: 800; color: #0a194f;">
            Tech<span style="color: #7c3aed;">Talk</span>
          </span>
        </div>
        """

    html_content = f"""
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>{subject}</title>
    </head>
    <body style="margin: 0; padding: 32px 16px; background-color: #0f1117; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f1f5f9; line-height: 1.6;">
      <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 480px; margin: 0 auto; background-color: #181a20; border-radius: 20px; border: 1px solid #272a34; box-shadow: 0 12px 36px rgba(0, 0, 0, 0.45); overflow: hidden;">
        <tr>
          <td style="padding: 36px 32px 32px 32px;">
            <!-- Company Logo Matching Home Page -->
            <div style="margin-bottom: 28px;">
              {logo_html}
            </div>

            <!-- Greeting -->
            <h2 style="margin: 0 0 16px 0; font-size: 22px; font-weight: 700; color: #ffffff; letter-spacing: -0.02em;">
              Hey {user_name},
            </h2>
            
            <!-- Message Body -->
            <p style="margin: 0 0 24px 0; font-size: 15px; color: #cbd5e1; line-height: 1.55;">
              Your temporary login code to access <strong style="color: #ffffff;">TechTalk Community</strong> is:
            </p>
            
            <!-- Bright Lime Green OTP Badge matching user screenshot -->
            <table role="presentation" border="0" cellspacing="0" cellpadding="0" style="margin: 0 0 28px 0;">
              <tr>
                <td style="background-color: #a3e635; background: linear-gradient(135deg, #a3e635 0%, #84cc16 100%); border-radius: 12px; padding: 12px 28px; text-align: center; box-shadow: 0 6px 18px rgba(163, 230, 53, 0.3);">
                  <span style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; font-size: 32px; font-weight: 900; letter-spacing: 5px; color: #ffffff; text-shadow: 0 1px 3px rgba(0,0,0,0.3); display: inline-block;">
                    {otp_code}
                  </span>
                </td>
              </tr>
            </table>
            
            <!-- Expiry & Security Notice -->
            <p style="margin: 0 0 20px 0; font-size: 13px; color: #94a3b8; line-height: 1.5;">
              This code will expire in <strong style="color: #e2e8f0;">5 minutes</strong>. Never share this code with anyone.
            </p>
            
            <!-- Ignore Note matching reference image -->
            <p style="margin: 0; font-size: 13px; color: #64748b; line-height: 1.5;">
              If you think you've received this email in error, please ignore this email.
            </p>
          </td>
        </tr>
        
        <!-- Footer -->
        <tr>
          <td style="padding: 18px 32px; background-color: #12141a; border-top: 1px solid #232630; text-align: center; font-size: 12px; color: #64748b;">
            © 2026 NexziByte Solutions Pvt Ltd • TechTalk Platform
          </td>
        </tr>
      </table>
    </body>
    </html>
    """

    inline_images = {}
    if has_logo:
        inline_images["company_logo"] = (logo_bytes, "png")

    return send_smtp_mail(to_email, subject, text_content, html_content, inline_images)


async def send_welcome_email(to_email: str, name: str) -> bool:
    """
    Sends a simple, clean, and authentic NexziByte TechTalk account creation welcome email:
    Hi [User Name],
    Welcome to NexziByte TechTalk!
    Your account has been successfully created.
    """
    user_name = resolve_clean_user_name(to_email, name)
    subject = "Welcome to NexziByte TechTalk — Account Created Successfully 🎉"
    explore_url = settings.FRONTEND_URL or "http://localhost:5173"
    
    text_content = f"""Hi {user_name},

Welcome to NexziByte TechTalk! 🎉

Your account has been successfully created. We're excited to have you join our developer and tech community.

Account Details:
• Name: {user_name}
• Email: {to_email}

You can now explore TechTalk summits, founder meets, read technical dispatches, and connect with peers:
{explore_url}

If you have any questions or need support, reply to this email or contact support@nexzibyte.com.

Regards,
NexziByte Solutions
NexziByte TechTalk Team
"""

    logo_bytes = get_logo_image_bytes()
    has_logo = bool(logo_bytes)

    if has_logo:
        logo_html = """
        <div style="background-color: #ffffff; border-radius: 10px; padding: 6px 14px; display: inline-block; box-shadow: 0 2px 8px rgba(0,0,0,0.15);">
          <img src="cid:company_logo" alt="NexziByte TechTalk" height="32" style="height: 32px; width: auto; display: block; max-width: 150px; object-fit: contain;" />
        </div>
        """
    else:
        logo_html = """
        <div style="background-color: #ffffff; border-radius: 10px; padding: 8px 14px; display: inline-block; box-shadow: 0 2px 6px rgba(0,0,0,0.2);">
          <span style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 18px; font-weight: 900; color: #0a194f;">
            NE<span style="color: #6C2BD9;">X</span>ZIBYTE
          </span>
          <span style="color: #cbd5e1; margin: 0 4px;">|</span>
          <span style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 16px; font-weight: 800; color: #0a194f;">
            Tech<span style="color: #6C2BD9;">Talk</span>
          </span>
        </div>
        """

    html_content = f"""
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>{subject}</title>
    </head>
    <body style="margin: 0; padding: 32px 16px; background-color: #0d0f17; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f1f5f9; line-height: 1.6;">
      <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 500px; margin: 0 auto; background-color: #151824; border-radius: 18px; border: 1px solid #252b3d; box-shadow: 0 16px 40px rgba(0, 0, 0, 0.5); overflow: hidden;">
        
        <!-- Top Accent Line -->
        <tr>
          <td height="4" style="background: linear-gradient(90deg, #6C2BD9, #4F46E5, #38BDF8);"></td>
        </tr>

        <tr>
          <td style="padding: 32px 28px 28px 28px;">
            
            <!-- Brand Logo -->
            <div style="margin-bottom: 22px;">
              {logo_html}
            </div>

            <!-- Greeting -->
            <h2 style="margin: 0 0 14px 0; font-size: 21px; font-weight: 800; color: #ffffff; letter-spacing: -0.02em;">
              Hi {user_name},
            </h2>

            <p style="margin: 0 0 18px 0; font-size: 15px; color: #cbd5e1; line-height: 1.6;">
              Welcome to <strong style="color: #ffffff;">NexziByte TechTalk</strong>! Your account has been successfully created. We're excited to have you join our developer and tech community.
            </p>

            <!-- Account Details Card -->
            <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #1b1f2e; border: 1px solid #2a3144; border-radius: 12px; margin: 0 0 20px 0; font-size: 14px;">
              <tr>
                <td style="padding: 12px 16px; border-bottom: 1px solid #242a3a; color: #94a3b8; font-weight: 500;">Account Name</td>
                <td align="right" style="padding: 12px 16px; border-bottom: 1px solid #242a3a; color: #ffffff; font-weight: 700;">{user_name}</td>
              </tr>
              <tr>
                <td style="padding: 12px 16px; border-bottom: 1px solid #242a3a; color: #94a3b8; font-weight: 500;">Registered Email</td>
                <td align="right" style="padding: 12px 16px; border-bottom: 1px solid #242a3a; color: #ffffff; font-weight: 600;">{to_email}</td>
              </tr>
              <tr>
                <td style="padding: 12px 16px; color: #94a3b8; font-weight: 500;">Status</td>
                <td align="right" style="padding: 12px 16px; color: #34d399; font-weight: 700;">✓ Account Active</td>
              </tr>
            </table>

            <p style="margin: 0 0 20px 0; font-size: 14px; color: #94a3b8; line-height: 1.6;">
              You can now browse technical articles, register for developer summits and founder meets, and connect with technology leaders.
            </p>

            <!-- Support Note -->
            <p style="margin: 0 0 22px 0; font-size: 13px; color: #64748b; line-height: 1.5;">
              If you have any questions, feel free to reply directly to this email or reach us at <a href="mailto:support@nexzibyte.com" style="color: #a78bfa; text-decoration: none;">support@nexzibyte.com</a>.
            </p>

            <!-- Signoff -->
            <div style="border-top: 1px solid #222738; padding-top: 16px;">
              <p style="margin: 0 0 2px 0; font-size: 13.5px; color: #e2e8f0; font-weight: 600;">
                Regards,
              </p>
              <p style="margin: 0 0 2px 0; font-size: 14px; color: #ffffff; font-weight: 800;">
                NexziByte Solutions
              </p>
              <p style="margin: 0; font-size: 13px; color: #a78bfa; font-weight: 600;">
                NexziByte TechTalk Team
              </p>
            </div>

          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="padding: 14px 28px; background-color: #10121a; border-top: 1px solid #1f232e; text-align: center; font-size: 11.5px; color: #64748b;">
            © 2026 NexziByte Solutions Pvt Ltd • TechTalk Community Platform
          </td>
        </tr>
      </table>
    </body>
    </html>
    """

    inline_images = {}
    if has_logo:
        inline_images["company_logo"] = (logo_bytes, "png")

    return send_smtp_mail(to_email, subject, text_content, html_content, inline_images)

async def send_payment_confirmation_email(
    to_email: str,
    attendee_name: str,
    pass_id: str,
    pass_type: str,
    amount: str,
    payment_method: str = "Online Payment",
    txn_id: str = None,
    organization: str = None,
    role: str = None,
    qr_data: str = None,
    notes: str = None
) -> bool:
    """
    Sends a high-end, real-time website invoice & digital pass confirmation email to the user
    after successful payment, complete with company logo, payment receipt, and QR code for venue entry.
    """
    user_name = resolve_clean_user_name(to_email, attendee_name)
    clean_pass_type = pass_type.upper() if pass_type else "TECHTALK 2026 PASS"
    resolved_txn = txn_id or f"TXN-IN-{random.randint(10000000, 99999999)}"
    subject = f"Payment Successful! Your TechTalk 2026 Pass is Confirmed - {pass_id}"
    
    # Generate QR Code image bytes
    qr_content = qr_data or f"TECHTALK:{pass_id}:{user_name.upper()}:{clean_pass_type}:{amount}:VERIFIED"
    qr_bytes = generate_qr_code_bytes(qr_content)
    logo_bytes = get_logo_image_bytes()
    has_logo = bool(logo_bytes)

    # Plain text version
    text_content = f"""Hey {user_name},

Thank you for your payment! Your registration for TechTalk 2026 is confirmed.

==============================================
PAYMENT RECEIPT & PASS CONFIRMATION
==============================================
Pass ID:        {pass_id}
Pass Type:      {clean_pass_type}
Attendee:       {user_name}
Organization:   {organization or 'NexziByte Community'}
Role:           {role or 'Accredited Member'}
Amount Paid:    {amount} (18% GST Included)
Payment Method: {payment_method}
Transaction ID: {resolved_txn}
Status:         VERIFIED & VALID FOR EVENT ENTRY
==============================================

Please present your Pass ID and QR code at the check-in desk at the venue.

Thanks,
Team NexziByte TechTalk
"""

    # Logo HTML
    if has_logo:
        logo_html = """
        <div style="background-color: #ffffff; border-radius: 12px; padding: 8px 14px; display: inline-block; box-shadow: 0 2px 8px rgba(0,0,0,0.2);">
          <img src="cid:company_logo" alt="NexziByte TechTalk" height="38" style="height: 38px; width: auto; display: block; max-width: 180px; object-fit: contain;" />
        </div>
        """
    else:
        logo_html = """
        <div style="background-color: #ffffff; border-radius: 12px; padding: 10px 16px; display: inline-block;">
          <span style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 20px; font-weight: 900; color: #0a194f; letter-spacing: 0.5px;">
            NE<span style="color: #7c3aed;">X</span>ZIBYTE
          </span>
          <span style="color: #cbd5e1; margin: 0 6px; font-size: 18px;">|</span>
          <span style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 18px; font-weight: 800; color: #0a194f;">
            Tech<span style="color: #7c3aed;">Talk</span>
          </span>
        </div>
        """

    # Rich Real-Time Payment Invoice & Digital Pass HTML
    html_content = f"""
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>{subject}</title>
    </head>
    <body style="margin: 0; padding: 32px 16px; background-color: #0c0d12; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f1f5f9; line-height: 1.6;">
      <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 580px; margin: 0 auto; background-color: #141720; border-radius: 20px; border: 1px solid #232734; box-shadow: 0 16px 48px rgba(0, 0, 0, 0.55); overflow: hidden;">
        
        <!-- Top Green Success Accent Bar -->
        <tr>
          <td height="5" style="background: linear-gradient(90deg, #10b981, #059669, #34d399);"></td>
        </tr>

        <tr>
          <td style="padding: 36px 32px 28px 32px;">
            
            <!-- Company Logo Matching Home Page -->
            <div style="margin-bottom: 24px;">
              {logo_html}
            </div>

            <!-- Payment Success Header Badge -->
            <table role="presentation" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 20px;">
              <tr>
                <td style="background-color: rgba(16, 185, 129, 0.12); border: 1px solid rgba(16, 185, 129, 0.35); border-radius: 30px; padding: 6px 16px;">
                  <span style="color: #34d399; font-size: 13px; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase;">
                    ✓ Payment Successful • Confirmed
                  </span>
                </td>
              </tr>
            </table>

            <h1 style="margin: 0 0 12px 0; font-size: 24px; font-weight: 800; color: #ffffff; letter-spacing: -0.02em;">
              You're all set, {user_name}!
            </h1>
            
            <p style="margin: 0 0 24px 0; font-size: 15px; color: #94a3b8; line-height: 1.55;">
              Thank you for your payment. Your registration for <strong style="color: #ffffff;">{clean_pass_type}</strong> has been successfully processed and your official digital entry pass is ready.
            </p>

            <!-- Digital Pass Card with QR Code -->
            <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background: linear-gradient(145deg, #1e2230 0%, #171a24 100%); border-radius: 16px; border: 1px solid #2d3345; margin-bottom: 28px; overflow: hidden; box-shadow: 0 8px 24px rgba(0,0,0,0.35);">
              <tr>
                <td style="padding: 24px; vertical-align: top;">
                  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                    <tr>
                      <td style="vertical-align: top;">
                        <div style="font-size: 11px; font-weight: 800; letter-spacing: 1.5px; color: #818cf8; text-transform: uppercase; margin-bottom: 4px;">
                          OFFICIAL ENTRY PASS
                        </div>
                        <div style="font-size: 20px; font-weight: 900; color: #ffffff; letter-spacing: -0.01em; margin-bottom: 4px;">
                          {clean_pass_type}
                        </div>
                        <div style="font-size: 14px; font-weight: 700; color: #38bdf8; margin-bottom: 12px;">
                          Pass ID: {pass_id}
                        </div>
                        <div style="font-size: 13px; color: #cbd5e1; margin-bottom: 2px;">
                          Attendee: <strong style="color: #ffffff;">{user_name}</strong>
                        </div>
                        <div style="font-size: 12px; color: #94a3b8; margin-bottom: 12px;">
                          {organization or 'NexziByte Community'} • {role or 'Accredited Member'}
                        </div>
                        <div style="display: inline-block; background-color: rgba(52, 211, 153, 0.15); border: 1px solid rgba(52, 211, 153, 0.3); border-radius: 6px; padding: 4px 10px; font-size: 11px; font-weight: 700; color: #34d399;">
                          ✓ VALID FOR EVENT ENTRY
                        </div>
                      </td>
                      <td width="130" align="right" style="vertical-align: middle; padding-left: 16px;">
                        <div style="background-color: #ffffff; border-radius: 12px; padding: 8px; display: inline-block; box-shadow: 0 4px 12px rgba(0,0,0,0.4);">
                          <img src="cid:pass_qrcode" alt="Pass QR Code" width="105" height="105" style="display: block; width: 105px; height: 105px; border-radius: 4px;" />
                        </div>
                        <div style="font-size: 10px; font-family: monospace; color: #94a3b8; text-align: center; margin-top: 4px;">
                          {pass_id}
                        </div>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>

            <!-- Payment Receipt Details Table -->
            <div style="font-size: 14px; font-weight: 700; color: #ffffff; margin-bottom: 12px; letter-spacing: 0.5px; text-transform: uppercase;">
              Payment & Invoice Receipt
            </div>
            
            <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #1a1d26; border-radius: 12px; border: 1px solid #282c3a; margin-bottom: 28px; font-size: 13px;">
              <tr>
                <td style="padding: 12px 18px; border-bottom: 1px solid #232734; color: #94a3b8;">Transaction Reference</td>
                <td align="right" style="padding: 12px 18px; border-bottom: 1px solid #232734; font-family: monospace; color: #e2e8f0; font-weight: 600;">{resolved_txn}</td>
              </tr>
              <tr>
                <td style="padding: 12px 18px; border-bottom: 1px solid #232734; color: #94a3b8;">Payment Method</td>
                <td align="right" style="padding: 12px 18px; border-bottom: 1px solid #232734; color: #e2e8f0; font-weight: 600;">{payment_method}</td>
              </tr>
              <tr>
                <td style="padding: 12px 18px; border-bottom: 1px solid #232734; color: #94a3b8;">Taxes (GST 18%)</td>
                <td align="right" style="padding: 12px 18px; border-bottom: 1px solid #232734; color: #e2e8f0;">Included (CGST + SGST)</td>
              </tr>
              <tr>
                <td style="padding: 14px 18px; color: #ffffff; font-weight: 800; font-size: 15px;">Total Paid</td>
                <td align="right" style="padding: 14px 18px; color: #34d399; font-weight: 900; font-size: 17px;">{amount}</td>
              </tr>
            </table>

            <!-- Event & Entry Instructions -->
            <div style="background-color: #12141c; border-left: 3px solid #7c3aed; border-radius: 8px; padding: 14px 16px; margin-bottom: 24px;">
              <div style="font-size: 13px; font-weight: 700; color: #ffffff; margin-bottom: 6px;">
                Venue Entry Guidelines:
              </div>
              <ul style="margin: 0; padding-left: 18px; font-size: 12px; color: #94a3b8; line-height: 1.6;">
                <li>Present this email or save your Pass ID / QR code on your mobile device.</li>
                <li>Proceed to the Fast-Track Check-in counter at the venue for instant contactless badge printing.</li>
                <li>Access all keynote sessions, breakout masterclasses, and networking zones.</li>
              </ul>
            </div>

            <p style="margin: 0; font-size: 13px; color: #64748b;">
              Need assistance? Reply directly to this email or contact support at <a href="mailto:support@nexzibyte.com" style="color: #a78bfa; text-decoration: none;">support@nexzibyte.com</a>.
            </p>

          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="padding: 20px 32px; background-color: #0f1118; border-top: 1px solid #1f232e; text-align: center; font-size: 12px; color: #64748b;">
            © 2026 NexziByte Solutions Pvt Ltd • TechTalk Community Platform<br>
            All rights reserved. GST Compliant Digital Receipt.
          </td>
        </tr>

      </table>
    </body>
    </html>
    """

    inline_images = {
        "pass_qrcode": (qr_bytes, "png")
    }
    if has_logo:
        inline_images["company_logo"] = (logo_bytes, "png")

    return send_smtp_mail(to_email, subject, text_content, html_content, inline_images)


async def send_reset_password_email(to_email: str, name: str, reset_link: str, otp_code: str = None) -> bool:
    """
    Sends a high-end, branded password reset email with secure one-click reset link and OTP code.
    """
    user_name = name if name and name.strip() else "Member"
    subject = "Reset Your TechTalk Password"
    
    text_content = f"""Hi {user_name},

We received a request to reset your password for your NexziByte TechTalk account.

To reset your password, click the link below:
{reset_link}
"""
    if otp_code:
        text_content += f"""
Alternatively, you can enter this 6-digit Reset Code on the reset page:
{otp_code}
"""
    text_content += f"""
This link and code will expire in 15 minutes.

If you didn't request a password reset, you can safely ignore this email. Your account remains secure and your password has not been changed.

Regards,
NexziByte Solutions
NexziByte TechTalk Security Team
"""

    logo_bytes = get_logo_image_bytes()
    has_logo = bool(logo_bytes)

    if has_logo:
        logo_html = """
        <div style="background-color: #ffffff; border-radius: 12px; padding: 8px 14px; display: inline-block; box-shadow: 0 2px 8px rgba(0,0,0,0.2);">
          <img src="cid:company_logo" alt="NexziByte TechTalk" height="38" style="height: 38px; width: auto; display: block; max-width: 180px; object-fit: contain;" />
        </div>
        """
    else:
        logo_html = """
        <div style="background-color: #ffffff; border-radius: 12px; padding: 10px 16px; display: inline-block;">
          <span style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 20px; font-weight: 900; color: #0a194f; letter-spacing: 0.5px;">
            NE<span style="color: #7c3aed;">X</span>ZIBYTE
          </span>
          <span style="color: #cbd5e1; margin: 0 6px; font-size: 18px;">|</span>
          <span style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 18px; font-weight: 800; color: #0a194f;">
            Tech<span style="color: #7c3aed;">Talk</span>
          </span>
        </div>
        """

    otp_block_html = ""
    if otp_code:
        otp_block_html = f"""
        <div style="margin: 24px 0 20px 0; padding: 16px; background-color: #171a24; border: 1px dashed #383e52; border-radius: 12px; text-align: center;">
          <div style="font-size: 12px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">
            Or Use 6-Digit Reset Code
          </div>
          <div style="display: inline-block; background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%); color: #ffffff; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', monospace; font-size: 24px; font-weight: 800; letter-spacing: 6px; padding: 8px 20px; border-radius: 8px; box-shadow: 0 4px 12px rgba(124, 58, 237, 0.3);">
            {otp_code}
          </div>
        </div>
        """

    html_content = f"""
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>{subject}</title>
    </head>
    <body style="margin: 0; padding: 36px 16px; background-color: #0c0d12; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f1f5f9; line-height: 1.6;">
      <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 520px; margin: 0 auto; background-color: #151824; border-radius: 20px; border: 1px solid #252b3d; box-shadow: 0 18px 48px rgba(0, 0, 0, 0.55); overflow: hidden;">
        
        <!-- Top Purple Accent Bar -->
        <tr>
          <td height="5" style="background: linear-gradient(90deg, #7c3aed, #6366f1, #38bdf8);"></td>
        </tr>

        <tr>
          <td style="padding: 36px 32px 30px 32px;">
            
            <!-- Brand Logo -->
            <div style="margin-bottom: 24px;">
              {logo_html}
            </div>

            <!-- Security Badge -->
            <table role="presentation" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 18px;">
              <tr>
                <td style="background-color: rgba(124, 58, 237, 0.15); border: 1px solid rgba(124, 58, 237, 0.35); border-radius: 30px; padding: 5px 14px;">
                  <span style="color: #a78bfa; font-size: 12px; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase;">
                    🔒 Password Reset Request
                  </span>
                </td>
              </tr>
            </table>

            <!-- Heading -->
            <h1 style="margin: 0 0 14px 0; font-size: 23px; font-weight: 800; color: #ffffff; letter-spacing: -0.02em;">
              Hi {user_name},
            </h1>
            
            <p style="margin: 0 0 20px 0; font-size: 15px; color: #cbd5e1; line-height: 1.6;">
              We received a request to reset the password for your <strong style="color: #ffffff;">NexziByte TechTalk</strong> account. Click the button below to choose a new, secure password:
            </p>

            <!-- Reset Button CTA -->
            <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="margin: 28px 0 24px 0;">
              <tr>
                <td align="center">
                  <a href="{reset_link}" target="_blank" style="display: inline-block; background: linear-gradient(135deg, #6C2BD9 0%, #4F46E5 100%); color: #ffffff; text-decoration: none; padding: 15px 36px; border-radius: 12px; font-size: 15px; font-weight: 800; letter-spacing: 0.02em; box-shadow: 0 6px 20px rgba(108, 43, 217, 0.4); text-align: center;">
                    Reset Your Password &rarr;
                  </a>
                </td>
              </tr>
            </table>

            {otp_block_html}

            <!-- Direct URL note -->
            <div style="margin-top: 20px; padding: 14px 16px; background-color: #1a1e2b; border-radius: 10px; border: 1px solid #282f42;">
              <p style="margin: 0 0 6px 0; font-size: 12px; color: #94a3b8;">
                If the button above doesn't work, copy and paste this link into your browser:
              </p>
              <p style="margin: 0; font-size: 12px; word-break: break-all;">
                <a href="{reset_link}" style="color: #38bdf8; text-decoration: underline;">{reset_link}</a>
              </p>
            </div>

            <!-- Expiry & Security Notice -->
            <div style="margin-top: 24px; padding-top: 18px; border-top: 1px solid #232838;">
              <p style="margin: 0 0 10px 0; font-size: 13px; color: #94a3b8; line-height: 1.55;">
                ⏰ <strong>This link is valid for 15 minutes.</strong>
              </p>
              <p style="margin: 0; font-size: 12.5px; color: #64748b; line-height: 1.55;">
                If you didn't request a password reset, you can safely ignore this email. No changes will be made to your account.
              </p>
            </div>

            <!-- Signoff -->
            <div style="border-top: 1px solid #232838; padding-top: 16px; margin-top: 20px;">
              <p style="margin: 0 0 2px 0; font-size: 13.5px; color: #ffffff; font-weight: 700;">
                NexziByte Solutions
              </p>
              <p style="margin: 0; font-size: 12.5px; color: #a78bfa; font-weight: 600;">
                NexziByte TechTalk Security Team
              </p>
            </div>

          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="padding: 16px 28px; background-color: #10121a; border-top: 1px solid #1f232e; text-align: center; font-size: 11.5px; color: #64748b;">
            © 2026 NexziByte Solutions Pvt Ltd • TechTalk Community Platform
          </td>
        </tr>

      </table>
    </body>
    </html>
    """

    inline_images = {}
    if has_logo:
        inline_images["company_logo"] = (logo_bytes, "png")

    return send_smtp_mail(to_email, subject, text_content, html_content, inline_images)

