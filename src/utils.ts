import * as crypto from 'crypto';

export function generateProfileUrl(email) {
  const shaHash = crypto
    .createHash('sha256')
    .update(email.trim().toLowerCase())
    .digest('hex');
  let avatarUrl = `https://www.gravatar.com/avatar/${shaHash}?d=retro`;
  return avatarUrl;
}
