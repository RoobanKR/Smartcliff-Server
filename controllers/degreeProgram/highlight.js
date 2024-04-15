const Highlight = require('../../models/degreeprogram/HighlightModal');

exports.createHighlight = async (req, res) => {
    try {
        const { title, description, versus, highlight, degree_program } = req.body;
    
        const subheadings = versus.map(v => ({ subheading: v.subheading }));
    
        const newHighlight = new Highlight({
          title,
          description,
          versus: subheadings, 
          highlight,
          degree_program,
        });
    
        await newHighlight.save();
    
        return res.status(201).json({ message: [{ key: "Success", value: `${highlight} Highlights Added Successfully` }] });
      } catch (error) {
        console.error('Error creating highlight:', error);
        return res.status(500).json({ message: [{ key: "error", value: "Internal server error" }] });
      }
    };

    exports.getAllHighlights = async (req, res) => {
      try {
        const highlights = await Highlight.find().populate("degree_program");
        return res.status(200).json({ message: [{ key: "Success", value:"Highlights Get ALl Successfully" }],highlights:highlights });
      } catch (error) {
        console.error('Error fetching highlights:', error);
        return res.status(500).json({ message: [{ key: "error", value: "Internal server error" }] });
      }
    };


    exports.getHighlightById = async (req, res) => {
      try {
        const { id } = req.params;
        const highlight = await Highlight.findById(id).populate("degree_program");
        if (!highlight) {
          return res.status(404).json({ message: [{ key: 'error', value: 'Highlight not found' }] });
        }
        return res.status(200).json({ message: [{ key: "Success", value:"Highlights Get ALl Successfully" }],highlightById:highlight });
      } catch (error) {
        console.error('Error fetching highlight by ID:', error);
        return res.status(500).json({ message: [{ key: "error", value: "Internal server error" }] });
      }
    };


    exports.updateHighlight = async (req, res) => {
      try {
        const { highlightId } = req.params;
        const { title, description, versus, highlight, degree_program } = req.body;
    
        const subheadings = versus.map(v => ({ subheading: v.subheading }));
    
        const updatedHighlight = {
          title,
          description,
          versus: subheadings,
          highlight,
          degree_program,
        };
    
        const result = await Highlight.findByIdAndUpdate(highlightId, updatedHighlight, { new: true });
    
        if (!result) {
          return res.status(404).json({ message: 'Highlight not found' });
        }
    
        return res.status(200).json({ message: 'Highlight updated successfully', updatedHighlight: result });
      } catch (error) {
        console.error('Error updating highlight:', error);
        return res.status(500).json({ message: 'Internal server error' });
      }
    };

    exports.deleteHighlight = async (req, res) => {
      try {
        const { id } = req.params;
    
        const deletedHighlight = await Highlight.findByIdAndDelete(id);
    
        if (!deletedHighlight) {
          return res.status(404).json({ message: [{ key: 'error', value: 'Highlight not found' }] });
        }
    
        return res.status(200).json({ message: [{ key: 'Success', value: 'Highlight deleted successfully' }], deletedHighlight });
      } catch (error) {
        console.error('Error deleting highlight:', error);
        return res.status(500).json({ message: [{ key: 'error', value: 'Internal server error' }] });
      }
    };