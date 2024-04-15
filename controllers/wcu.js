const WcuModel = require('../models/WCUModal');

exports.createWCU = async (req, res) => {
  try {
    const { title, subtitle, description, table } = req.body;

    const user = req.user; 

    if (!user) {
      return res.status(401).json({ message: [{ key: 'error', value: 'User not authenticated' }] });
      
    }

    const newWCU = new WcuModel({
      title,
      subtitle,
      description,
      table,
      lastModifiedBy: user.email, // Assuming the user object has a username field
    });

    const savedWCU = await newWCU.save();
    console.log(savedWCU);
    res.status(201).json({ message: [{ key: 'success', value: 'WCU Added Successfully' }] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: [{ key: 'error', value: 'internal server error' }] });
  }
};

exports.getAllWCU = async (req, res) => {
  try {
    const allWCU = await WcuModel.find();
    res.status(200).json({ message: [{ key: 'success', value: 'WCU section get All data' }],allWCU:allWCU });;
  } catch (error) {
    res.status(500).json({ message: [{ key: 'error', value: 'Internal server error' }] })
  }
};

exports.getWCUById = async (req, res) => {
  const { id } = req.params;

  try {
    const WCU = await WcuModel.findById(id);
    if (!WCU) {
      return res.status(404).json({ message: [{ key: 'error', value: 'WCU section not found' }] });
    }

    res.status(200).json({ message: [{ key: 'success', value: 'WCU  section Id based get the data' }],WCU:WCU });

  } catch (error) {
    res.status(500).json({ message: [{ key: 'error', value: 'Internal server error' }] })
  }
};
exports.editWCUById = async (req, res) => {
  const { id } = req.params;
  const { title, subtitle, description, table } = req.body;

  const lastModifiedBy = req.user.email; 

  try {
    const updatedWcu = await WcuModel.findByIdAndUpdate(
      id,
      {
        title,
        subtitle,
        description,
        table,
        lastModifiedBy,
        lastModifiedOn: new Date(),
      },
      { new: true }
    );

    if (!updatedWcu) {
      return res.status(404).json({ message: [{ key: 'error', value: 'WCU section not found' }] });
    }

    return res.status(200).json({ message: [{ key: 'success', value: 'WCU section Update Successfully' }] });
  } catch (error) {
    res.status(500).json({ message: [{ key: 'error', value: 'Internal server error' }] });
  }
};

exports.deleteWCUById = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedWcu = await WcuModel.findByIdAndRemove(id);

    if (!deletedWcu) {
      return res.status(404).json({ message: [{ key: 'error', value: 'WCU section not found' }] });
    }

    res.status(200).json({ message: [{ key: 'success', value: 'WCU section deleted successfully' }] });
  } catch (error) {
    res.status(500).json({ message: [{ key: 'error', value: 'Internal server error' }] });
  }
};

