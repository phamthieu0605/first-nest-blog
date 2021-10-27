import { MailerService } from '@nestjs-modules/mailer';
import { OnQueueActive, OnQueueCompleted, OnQueueFailed, Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';

@Processor('mailsend')
export class MailProcessor {
  private readonly logger = new Logger(this.constructor.name);

  constructor(private readonly mailerService: MailerService) {}

  @OnQueueActive()
  onActive(job: Job) {
    this.logger.debug(
      `Processing job ${job.id} of type ${job.name}. Data: ${JSON.stringify(
        job.data,
      )}`,
    );
  }

  @OnQueueCompleted()
  onComplete(job: Job, result: any) {
    this.logger.debug(
      `Completed job ${job.id} of type ${job.name}. Result: ${JSON.stringify(
        result,
      )}`,
    );
  }

  @OnQueueFailed()
  onError(job: Job<any>, error: any) {
    this.logger.error(
      `Failed job ${job.id} of type ${job.name}: ${error.message}`,
      error.stack,
    );
  }

  @Process('confirmation')
  async sendWelcomeEmail(job: Job<{ user: string }>): Promise<any> {
    // this.logger.log(`Sending confirmation email to '${job.data.user.email}'`);
    console.log(`Sending confirmation email to '${job.data.user}'`);
    try {
      const result = await this.mailerService.sendMail({
        // template: 'confirmation',
        subject: `Welcome to ${process.env.APP_NAME}`,
        from: process.env.MAIL_USER,
        to: job.data.user,
        text: 'Welcome to Ekoios',
        html: 'Hello World'
      });
      return result;
    } catch (error) {
      this.logger.error(
        `Failed to send confirmation email to '${job.data.user}'`,
        error.stack,
      );
      throw error;
    }
  }
}
