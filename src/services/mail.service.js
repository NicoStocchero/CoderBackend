import nodemailer from "nodemailer";

/**
 * Servicio de mailing con Nodemailer
 * Usa variables de entorno para configurar el transporte
 */
class MailService {
  constructor() {
    const host = process.env.SMTP_HOST;
    const port = parseInt(process.env.SMTP_PORT || "587", 10);
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    if (host && user && pass) {
      this.transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: { user, pass },
      });
    } else {
      // Transporte de consola para entornos sin SMTP configurado
      this.transporter = nodemailer.createTransport({
        jsonTransport: true,
      });
    }

    this.from = process.env.MAIL_FROM || "no-reply@example.com";
    this.appUrl = process.env.APP_URL || "http://localhost:8080";
  }

  /**
   * Envía correo de recuperación de contraseña
   * @param {string} to - Email destinatario
   * @param {string} token - Token de reseteo
   */
  async sendPasswordReset(to, token) {
    const resetLink = `${this.appUrl}/reset-password?token=${encodeURIComponent(
      token
    )}`;
    const html = `
      <div style="font-family: Arial, sans-serif;">
        <h2>Restablecer contraseña</h2>
        <p>Recibimos una solicitud para restablecer tu contraseña.</p>
        <p>Este enlace expira en 1 hora.</p>
        <p>
          <a href="${resetLink}"
             style="display:inline-block;padding:10px 16px;background:#0d6efd;color:#fff;text-decoration:none;border-radius:6px;">
            Restablecer contraseña
          </a>
        </p>
        <p>Si no fuiste vos, ignorá este correo.</p>
      </div>`;

    const mail = {
      to,
      from: this.from,
      subject: "Restablecer tu contraseña",
      html,
    };

    await this.transporter.sendMail(mail);
  }
}

export const mailService = new MailService();
export default mailService;
