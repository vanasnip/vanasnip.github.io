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

####Part 3: How to use the pizza.html app

1. To view what our menu has to offer you can click the menu button at the top of the page. Alternatively you can scroll down to the section of the page.

1. In the menu section of our page, in order to select the size of your pizza use the slider. The side of the pizza is indicated above. The label will state "Small", "Medium" or "large" click and drag it left you select small if its not already selected.
If you want medium click and drag the slider from the left or right to a central position if its not already selected.
If you want a large pizza then click and drag the slider from the left or middle position all the way to the far right position if not already selected.

1. If you want to know a about our ingredients then you can click this ingredients button, this will take you to the ingredients section of the page.
Alternatively you can scroll down to this section.

1. If you want to know a about where you can locate us then you can click this location button at the top of the page, this will take you to the location section of the page.
Alternatively you can scroll down to this section.


1. We have a wide selection of pizza and in order to see them all you will have to scroll all the way to the bottom or until the pizzas in the background stop moving. where you will see a message that says "thank you for visiting!" at the bottom.
