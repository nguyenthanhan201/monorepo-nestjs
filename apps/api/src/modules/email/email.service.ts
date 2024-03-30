import { MailerService } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";
import { content } from "../../mails/wellcome/content";

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendMail(toEmail: string) {
    return this.mailerService.sendMail({
      to: toEmail,
      from: "fxannguyen201@gmail.com",
      subject: "Create New User Success ✔",
      text: "welcome",
      html: content(),
    });
  }
}
