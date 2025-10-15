import nodemailer from 'nodemailer';

// Создаем транспортер для отправки email
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false, // true для 465, false для других портов
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendVerificationEmail(email: string, token: string) {
  const verificationUrl = `${process.env.NEXTAUTH_URL}/auth/verify-email?token=${token}`;
  
  const mailOptions = {
    from: `"${process.env.FROM_NAME}" <${process.env.FROM_EMAIL}>`,
    to: email,
    subject: 'Подтверждение регистрации в Restero',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #00D4AA;">Добро пожаловать в Restero!</h2>
        <p>Спасибо за регистрацию в системе управления ресторанами.</p>
        <p>Для завершения регистрации подтвердите ваш email, перейдя по ссылке ниже:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationUrl}" 
             style="background-color: #00D4AA; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Подтвердить email
          </a>
        </div>
        <p>Если кнопка не работает, скопируйте и вставьте эту ссылку в браузер:</p>
        <p style="word-break: break-all; color: #666;">${verificationUrl}</p>
        <p>Ссылка действительна в течение 24 часов.</p>
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
        <p style="color: #666; font-size: 12px;">
          Если вы не регистрировались в Restero, проигнорируйте это письмо.
        </p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email отправлен:', email);
  } catch (error) {
    console.error('Ошибка отправки email:', error);
    throw error;
  }
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const resetUrl = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${token}`;
  
  const mailOptions = {
    from: `"${process.env.FROM_NAME}" <${process.env.FROM_EMAIL}>`,
    to: email,
    subject: 'Восстановление пароля в Restero',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #00D4AA;">Восстановление пароля</h2>
        <p>Вы запросили восстановление пароля для вашего аккаунта в Restero.</p>
        <p>Для создания нового пароля перейдите по ссылке ниже:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" 
             style="background-color: #00D4AA; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Восстановить пароль
          </a>
        </div>
        <p>Если кнопка не работает, скопируйте и вставьте эту ссылку в браузер:</p>
        <p style="word-break: break-all; color: #666;">${resetUrl}</p>
        <p>Ссылка действительна в течение 1 часа.</p>
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
        <p style="color: #666; font-size: 12px;">
          Если вы не запрашивали восстановление пароля, проигнорируйте это письмо.
        </p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email восстановления пароля отправлен:', email);
  } catch (error) {
    console.error('Ошибка отправки email восстановления:', error);
    throw error;
  }
}

export async function sendAccessEmail(email: string, accessUrl: string, restaurantName: string, role: string) {
  const roleText = role === 'ADMIN' ? 'Администратор' : 'Хостес';
  
  const mailOptions = {
    from: `"${process.env.FROM_NAME}" <${process.env.FROM_EMAIL}>`,
    to: email,
    subject: `Доступ к ресторану "${restaurantName}" в Restero`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #00D4AA;">Доступ к ресторану</h2>
        <p>Вам предоставлен доступ для работы с рестораном <strong>"${restaurantName}"</strong> в системе Restero.</p>
        <p><strong>Ваша роль:</strong> ${roleText}</p>
        <p>Для активации доступа перейдите по ссылке ниже:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${accessUrl}" 
             style="background-color: #00D4AA; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Активировать доступ
          </a>
        </div>
        <p>Если кнопка не работает, скопируйте и вставьте эту ссылку в браузер:</p>
        <p style="word-break: break-all; color: #666;">${accessUrl}</p>
        <p>Ссылка действительна в течение 30 дней.</p>
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
        <p style="color: #666; font-size: 12px;">
          Если вы не ожидали это письмо, проигнорируйте его или свяжитесь с администратором ресторана.
        </p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email с доступом отправлен:', email);
  } catch (error) {
    console.error('Ошибка отправки email с доступом:', error);
    throw error;
  }
}
