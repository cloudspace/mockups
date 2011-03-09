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

1. Copy and paste canvas objects
1. Create a new page from an old one
1. Canvas Objects snap to grid
1. Save page as pdf
1. API:
	1. Retrieve list of page elements
	1. Retrieve sitemap
1. Starting templates
1. Integrate an open icon library set
1. Upload images
1. Auto-resizing text
1. Nudging

### Guidelines

If you would like to help please follow our guidelines for adding features:

1. If your feature is not on our wishlist please contact us before you do any work to ensure that it is a feature we would be interested in adding.
2. Make sure there are tests! We will not accept any patch that is not tested.
   It's a rare time when explicit tests aren't needed. If you have questions
   about writing tests for Cloudspace Mockups, please email us.

