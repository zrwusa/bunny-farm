import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy as GoogleStrategyBase } from 'passport-google-oauth20';

@Injectable()
export class GoogleStrategy extends PassportStrategy(GoogleStrategyBase, 'google') {
  constructor(config: ConfigService) {
    const clientID = config.get('GOOGLE_CLIENT_ID');
    const clientSecret = config.get('GOOGLE_CLIENT_SECRET');
    if (!clientID || !clientSecret) {
      throw new Error('Google OAuth credentials are not configured');
    }
    super({
      clientID,
      clientSecret,
      callbackURL: 'http://localhost:3000/auth/google/callback',
      scope: ['email', 'profile'],
      passReqToCallback: true,
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile) {
    const { emails, displayName, photos, id } = profile;
    return {
      provider: 'google',
      oauthId: id,
      email: emails?.[0]?.value,
      displayName,
      avatar: photos?.[0]?.value,
    };
  }
}
