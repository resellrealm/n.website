/* App Store links that also work inside in-app browsers.
   TikTok, Instagram and Facebook open links in their own web view, and those
   often refuse to hand an https://apps.apple.com link to the App Store: the tap
   just loads Apple's web page inside TikTok, or nothing happens. On iOS the
   itms-apps:// scheme asks the system to open the App Store app itself, so we
   use that on iPhone/iPad and keep the normal https link everywhere else. If the
   scheme is blocked too, the https page loads after a short wait as a fallback. */
(function () {
  var ID = '6802821164';
  var WEB = 'https://apps.apple.com/gb/app/nutrio/id' + ID;
  var ua = navigator.userAgent || '';
  var ios = /iPhone|iPad|iPod/i.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  if (!ios) return;

  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href*="apps.apple.com"]');
    if (!a) return;
    e.preventDefault();
    var left = false;
    var onHide = function () { left = true; };
    document.addEventListener('visibilitychange', onHide, { once: true });
    window.location.href = 'itms-apps://apps.apple.com/app/id' + ID;
    setTimeout(function () {
      if (!left && document.visibilityState === 'visible') window.location.href = a.href || WEB;
    }, 1500);
  });
})();
