// public/service-worker.js
self.addEventListener('push', function (event) {
    const data = event.data.json();
  
    const options = {
      body: data.body,
      icon: data.icon || 'android-chrome-512x512.png', // Set your app icon
      badge: 'android-chrome-512x512.png', // Small badge icon for notifications
      data: { url: data.url } // The URL you want to open when clicking the notification
    };
  
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  });
  
  self.addEventListener('notificationclick', function (event) {
    event.notification.close();
    event.waitUntil(
      clients.openWindow(event.notification.data.url) // Redirect to a specific URL
    );
  });
  