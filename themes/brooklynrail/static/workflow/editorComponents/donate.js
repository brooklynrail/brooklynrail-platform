CMS.registerEditorComponent({
  // Internal id of the component
  id: "donate",
  // Visible label
  label: "Donate",

  // Fields the user need to fill out when adding an instance of the component
  fields: [
    {
      name: 'heading',
      label: 'Heading',
      widget: 'string',
      default: ''
    }
  ],

  // Pattern to identify a block as being an instance of this component
  //        {{< donate heading="Donate Box" >}}
  pattern: /{{< donate heading=\"(.+)\" >}}/,
  // Function to extract data elements from the regexp match
  fromBlock: function(match) {
    return {
      heading: match[1]
    };
  },
  // Function to create a text block from an instance of this component
  toBlock: function(obj) {
    return '{{< donate heading="' + obj.heading + '" >}}';
  },
  // Preview output for this component. Can either be a string or a React component
  // (component gives better render performance)
  toPreview: function(obj) {
    return (
      '<img class="youtube" src="http://img.youtube.com/vi/' + obj.image + '/mqdefault.jpg" alt="Youtube Video"/>'
    );
  }
});
