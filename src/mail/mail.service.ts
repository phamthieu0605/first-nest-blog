import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';

@Injectable()
export class MailService {
  constructor(
    @InjectQueue('mailsend')
    private mailQueue: Queue,
  ) {}

  async sendConfirmationEmail(user: string): Promise<boolean> {
    try {
      await this.mailQueue.add('confirmation', { user });
      return true;
    } catch (error) {
      console.error(`Error queueing confirmation email to user ${user}`)
      return false;
    }
  }
}
