import { Process, Processor } from "@nestjs/bull";
import { EmailService } from "apps/api/src/modules/email/email.service";
import { Job } from "bull";

@Processor("send-mail")
export class EmailConsumer {
  constructor(private readonly emailService: EmailService) {}

  @Process("register")
  async sendMailRegister(job: Job<unknown>) {
    // console.log('👌  job:', job);
    await this.emailService.sendMail(job.data["email"]);
  }
}
