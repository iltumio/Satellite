export default {
  hasPermission() {
    return Notification.permission === 'granted';
  },
  newNotification(title: string, subtext: string) {
    const options = {
      body: subtext
    };
    const noti = new Notification(title, options);
    return noti;
  }
};
