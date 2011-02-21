templates = {
	heading: {
		default_content: "Heading",
		editable_content: true,
		resizable_options: {
			handles: 'n, ne, e, se, s, sw, w, nw',
			containment: 'parent',
			stop: function(event, ui) { Renderer.resize(event, ui, $(this)); },
		},
	},

	paragraph: {
		default_content: "Paragraph",
		editable_content: true,
		resizable_options: {
			handles: 'n, ne, e, se, s, sw, w, nw',
			containment: 'parent',
			stop: function(event, ui) { Renderer.resize(event, ui, $(this)); },
		},
	},

	link: {
		default_content: "Link",
		editable_content: true,
		resizable_options: {
			handles: 'n, ne, e, se, s, sw, w, nw',
			containment: 'parent',
			stop: function(event, ui) { Renderer.resize(event, ui, $(this)); },
		},
	},

	list: {
		default_content: "Item 1\nItem 2",
		editable_content: true,
		resizable_options: {
			handles: 'n, ne, e, se, s, sw, w, nw',
			containment: 'parent',
			stop: function(event, ui) { Renderer.resize(event, ui, $(this)); },
		},
	},
	image: {
		default_content: "",
		resizable_options: {
			handles: 'n, ne, e, se, s, sw, w, nw',
			containment: 'parent',
			stop: function(event, ui) { Renderer.resize(event, ui, $(this)); },
		},
	},
	input_box: {
		default_content: "Input Box",
		editable_content: true,
		resizable_options: {
			handles: 'n, ne, e, se, s, sw, w, nw',
			containment: 'parent',
			stop: function(event, ui) { Renderer.resize(event, ui, $(this)); },
		},
	},
	textarea: {
		default_content: "Textarea",
		editable_content: true,
		resizable_options: {
			handles: 'n, ne, e, se, s, sw, w, nw',
			containment: 'parent',
			stop: function(event, ui) { Renderer.resize(event, ui, $(this)); },
		},
	},
	check_box: {
		default_content: "Change Me\nChange Me Too",
		editable_content: true,
		resizable_options: {
			handles: 'n, ne, e, se, s, sw, w, nw',
			containment: 'parent',
			stop: function(event, ui) { Renderer.resize(event, ui, $(this)); },
		},
	},
	radio_buttons: {
		default_content: "Change\nUs",
		editable_content: true,
		resizable_options: {
			handles: 'n, ne, e, se, s, sw, w, nw',
			containment: 'parent',
			stop: function(event, ui) { Renderer.resize(event, ui, $(this)); },
		},
	},
	table: {
		default_content: "Change\nValues",
		editable_content: true,
		resizable_options: {
			handles: 'n, ne, e, se, s, sw, w, nw',
			containment: 'parent',
			stop: function(event, ui) { Renderer.resize(event, ui, $(this)); },
		},
	},
	submit_button: {
		default_content: "Submit",
		editable_content: true,
		resizable_options: {
			handles: 'n, ne, e, se, s, sw, w, nw',
			containment: 'parent',
			stop: function(event, ui) { Renderer.resize(event, ui, $(this)); },
		},
	},
	select_menu: {
		default_content: "Choose One",
		editable_content: true,
		resizable_options: {
			handles: 'n, ne, e, se, s, sw, w, nw',
			containment: 'parent',
			stop: function(event, ui) { Renderer.resize(event, ui, $(this)); },
		},
	},
	global_container: {
		default_content: "Drop More Items in Here"
	},
	main_navigation: {
		default_content: "Nav item 1\nNav item 2\nNav item 3"
	},
	user_navigation: {
		default_content: "Nav item 1\nNav item 2\nNav item 3"
	},
	footer_navigation: {
		default_content: "Nav item 1\nNav item 2\nNav item 3"
	},

	box_container: {
		default_content: "",
		resizable_options: {
			handles: 'n, ne, e, se, s, sw, w, nw',
			containment: 'parent',
			stop: function(event, ui) { Renderer.resize(event, ui, $(this)); },
		},
	},

	vertical_line: {
		default_content: "",
		resizable_options: {
			handles: 'n, ne, e, se, s, sw, w, nw',
			containment: 'parent',
			stop: function(event, ui) { Renderer.resize(event, ui, $(this)); },
		},
	},

	horizontal_line: {
		default_content: "",
		resizable_options: {
			handles: 'n, ne, e, se, s, sw, w, nw',
			containment: 'parent',
			stop: function(event, ui) { Renderer.resize(event, ui, $(this)); },
		},
	}
}
