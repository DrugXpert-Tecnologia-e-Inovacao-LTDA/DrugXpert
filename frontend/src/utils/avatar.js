export const getDefaultAvatar = (username = '') => {
  const name = username.trim() || 'U';
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=4ade80&color=ffffff&size=128&bold=true`;
};

export const getProfilePictureUrl = (user) => {
  if (!user) return null;
  return user.profile_picture_url ? 
    `http://127.0.0.1:8000${user.profile_picture_url}` : 
    getDefaultAvatar(user.username);
};
