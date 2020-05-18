CMS.registerEditorComponent({
  // Internal id of the component
  id: "image",
  // Visible label
  label: "Image",
  // Fields the user need to fill out when adding an instance of the component
  fields: [
    {
      name: 'image',
      label: 'Image',
      widget: 'relation',
      collection: 'media',
      searchFields: ["media", "title"],
      displayFields: ["{{title}} — {{date}}"],
      valueField: "{{slug}}"
    },
    {
      name: 'size',
      label: 'size',
      widget: 'select',
      options: ["sm", "md", "lg", "xl"],
      default: ["md"]
    }
  ],

  // Pattern to identify a block as being an instance of this component
  pattern: /{{< image media=\"(\S+)\" size=\"(\S+)\" >}}/,
  // Function to extract data elements from the regexp match
  fromBlock: function(match) {
    console.log('match');
    console.log(match);
    console.log(match[1]);
    console.log(match[2]);
    return {
      image: match[1],
      size: match[2]
    };
  },
  // Function to create a text block from an instance of this component
  toBlock: function(obj) {
    console.log('obj');
    console.log(obj);
    return '{{< image media="' + obj.image + '" size="'+obj.size+'" >}}';
  },
  // Preview output for this component. Can either be a string or a React component
  // (component gives better render performance)
  toPreview: function(obj) {
    return (
      '<img class="youtube" src="http://img.youtube.com/vi/' + obj.image + '/mqdefault.jpg" alt="Youtube Video"/>'
    );
  }
});
