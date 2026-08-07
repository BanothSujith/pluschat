export const enableNotifications = async (message) => {
  if (!("Notification" in window)) {
    console.log("Browser doesn't support notifications");
    return;
  }

  if (Notification.permission === "default") {
    await Notification.requestPermission();
  }

  if (Notification.permission === "granted") {
    new Notification("New Message", {
      body: message,
    });
  } else {
    console.log("Notifications are blocked");
  }
};
