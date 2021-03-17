export default {
  lexicon: {
    addFriend: {
      iconHash: 'QmQSacVGZ7evXQCcd4edUFeGRbTS8F1UwNqtmCvXrbanLr',
      title: 'Make a Friend',
      subtext: 'Added a friend to your friendslist.'
    },
    fileUpload: {
      iconHash: 'QmUZFpND9reBxy4mWanAPkZwsSLdV4Mn7t45Bs25nYjd3Y',
      title: 'Upload a File',
      subtext: 'Upload a file to IPFS.'
    },
    theme: {
      iconHash: 'Qma7oskztz2QbLXWPQbrk7B1VdgMvYu1kMb5ALKXFhCBQf',
      title: 'Personalize It!',
      subtext: 'Choose a custom theme.'
    },
    firstWords: {
      iconHash: 'QmRBeT3LRoypnpR6Z9EdCV5fzn13a2VToRFB64bg95v6wz',
      title: 'First Words',
      subtext: 'Say something to a friend!'
    },
    spendBank: {
      iconHash: 'QmSJcb5P8hfR2h9BkxXZG2ZtbFfRcza1X1b8U1h3jfLYoB',
      title: 'Spend Bank',
      subtext: 'Sent ETH to a friend.'
    },
    enableNotifications: {
      iconHash: 'QmYwz8ToHJFjE2qfJwbkB44GWwQtBBw9vYW6cx8GvaZaCq',
      title: 'Enable Notifications',
      subtext: 'Enable notifications in settings.'
    },
    vocallyVocal: {
      iconHash: 'QmaNteXyyGCUxgeMM6UxbwLAr2DmQAA5ktjk63zZGJVw8Z',
      title: 'Vocally Vocal',
      subtext: 'Voice chat with a friend.'
    }
  },
  achievementDetails(achievement: string) {
    return this.lexicon[achievement];
  },
  completeAchievement(achievement: string) {
    localStorage.setItem(`vault74.achievement.${achievement}`, 'true');
  },
  checkAchievement(achievement: string): boolean {
    const ach = localStorage.getItem(`vault74.achievement.${achievement}`);
    return ach !== null && ach === 'true';
  }
};
