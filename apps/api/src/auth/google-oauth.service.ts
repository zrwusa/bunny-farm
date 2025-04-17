import { OAuth2Client } from 'google-auth-library';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GoogleOAuthService {
  private client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

  async verifyIdToken(idToken: string) {
    const ticket = await this.client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID, // Verify signature + audience
    });

    const payload = ticket.getPayload();

    return {
      googleId: payload.sub, // Google User ID
      email: payload.email,
      name: payload.name,
      avatar: payload.picture,
    };
  }
}
