# Blot Out the Sun
## Description
Blot Out the Sun is a javascript game, playable at http://mattbatman.github.io/blot-out-the-sun.
## Bugs
There's a current bug for iOS 9 Safari that affects the path and placement of the sun on screen when the browser is refreshed. Specifically, window.innerHeight and window.innerWidth are (incorrectly) returning high of values when the browser is refreshed, though they're correct when the page is first loaded.
It seems to be discussed in these forums:
1. http://stackoverflow.com/questions/32840602/does-safari-ios9-returns-a-wrong-value-for-window-innerheight
2. https://forums.developer.apple.com/thread/13510
