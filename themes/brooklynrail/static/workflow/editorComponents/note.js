CMS.registerEditorComponent({
  // Internal id of the component
  id: "note",
  // Visible label
  label: "Note",
  // Fields the user need to fill out when adding an instance of the component
  fields: [
    {
      name: 'note',
      label: 'Note',
      widget: 'string',
      default: ''
    }
  ],

  // Pattern to identify a block as being an instance of this component
  pattern: /{{< note >}}\S+{{< \/note >}}/,
  // Function to extract data elements from the regexp match
  fromBlock: function(match) {
    return {
      content: match[1]
    };
  },
  // Function to create a text block from an instance of this component
  toBlock: function(obj) {
    return '{{< note >}} {{< /note >}}';
  },
  // Preview output for this component. Can either be a string or a React component
  // (component gives better render performance)
  toPreview: function(obj) {
    return (
      '<div class="shortcode-note">' + obj.content + '</div>'
    );
  }
});
