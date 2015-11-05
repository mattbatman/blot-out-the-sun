# blot-out-the-sun
Blot Out the Sun is a javascript game, playable at http://mattbatman.github.io/blot-out-the-sun.
There's a current bug for iOS 9 Safari that affects the path of the sun when the browser is refreshed.
Specifically, window.innerHeight and window.innerWidth are returning incorrectly high values when the browser is refreshed, though they're correct when the page is first loaded.
It seems to be discussed in these forums:
http://stackoverflow.com/questions/32840602/does-safari-ios9-returns-a-wrong-value-for-window-innerheight
https://forums.developer.apple.com/thread/13510
