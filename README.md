## Website Performance Optimization portfolio project


####Part 1: Optimize PageSpeed Insights score for index.html

Some useful tips to help you get started:

1. I optimised the images as well as reduced their file size
1. I inlined the CSS
1. I async attribue on google analytics js - Eliminates needless render blocking
1. I minified the HTML - to reduce the file size
1. To inspect the site on your phone, you can run a local server


####Part 2: Optimize Frames per Second in pizza.html
1. Added css to .mover class for hardware accelarated CSS
1. I optimised the photograph as well as reduced the file size for faster download
1. Altered .querySelector() tp .getElementById() because the web API call is faster
1. Altered .querySelectorAll() to .GetElementsByClassName() web api call is faster
1. Placed document accessing variable assignments outside loop to reduce repeated access of the dom. Also to minimise layout recalculation
1. Reduced background pizzas based on rows within window height to reduce number of paints and animations
