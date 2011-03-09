# Cloudspace Mockups

## Description

The goal of Cloudspace Mockups is to serve a way of creating and editing mockups collaboratively. Users will create mockups by dragging and dropping different elements on to their canvas.  This product has been coded to work with Firefox, Chrome, Safari and the iPad.

## Technical Description

To make this all happen Cloudspace Mockups runs off of node.js, using sockets to allow for the collaboration of many users.  The data is passed between the front-end and back-end as json and therefore is stored in mongodb. Static files are served in nginx in our default setup. Our buddy [Hudson](http://hudson-ci.org/) takes care of the continuous integration.

## Cloudspace Mockups - Features

1. 12 different canvas elements with which to express your ideas
2. Auto-reconnect
3. Password Protected Projects
4. Ability to create multiple pages for each project
5. Ability to name a project
6. Easy interface for managing user data
  
## Contributing

### Wishlist

These are the features that we are planning on introducing.

1. Table elements
2. Nudging
3. Copy and paste canvas objects
4. Duplicate page
5. Canvas objects snap to grid
6. Export page as pdf, png
7. API
	1. Retrieve list of page elements
	2. Retrieve sitemap
8. Duplicate project
9. Integrate an open icon library set
19. Upload images
11. Auto-resizing text

### Guidelines

If you would like to help please follow our guidelines for adding features:

1. If your feature is not on our wishlist please contact us before you do any work to ensure that it is a feature we would be interested in adding.
2. Make sure there are tests! We will not accept any patch that is not tested.
   It's a rare time when explicit tests aren't needed. If you have questions
   about writing tests for Cloudspace Mockups, please email us.

