const Semester = require("../../models/degreeprogram/SemesterModal");

exports.createSemester = async (req, res) => {
  try {
    const { description, semester,degree_program } = req.body;

    const newSemester = new Semester({
        description,
        semester,
        degree_program,
    });

    await newSemester.save();

   return res.status(201).json({ message: [{ key: "Success", value: "Semester added successfully" }],newSemester:newSemester });
} catch (error) {
    console.error(error);
  return  res.status(500).json({ message: [{ key: "error", value: "Internal server error" }] });
}
};

exports.getAllSemesters = async (req, res) => {
  try {
    const semesters = await Semester.find().populate("degree_program");
    return res.status(200).json({
      message: [{ key: "success", value: "Semesters Retrieved successfully" }],
      semester: semesters,
    });
  } catch (error) {
    console.error("Error fetching semesters:", error);
    return res
      .status(500)
      .json({ message: [{ key: "error", value: "Internal server error" }] });
  }
};

exports.getSemesterById = async (req, res) => {
  const { id } = req.params;
  try {
    const semester = await Semester.findById(id).populate("degree_program");
    if (!semester) {
      return res.status(404).json({ message: "Semester not found" });
    }
    return res.status(200).json({
      message: [{ key: "success", value: "Semesters Retrieved successfully" }],
      semesterById: semester,
    });
  } catch (error) {
    console.error("Error fetching semester by ID:", error);
    return res
      .status(500)
      .json({ message: [{ key: "error", value: "Internal server error" }] });
  }
};

exports.updateSemester = async (req, res) => {
  const { id } = req.params;
  const { semester, degree_program,description } = req.body;

  try {
    const existingSemester = await Semester.findById(id);
    if (!existingSemester) {
      return res.status(404).json({ message: "Semester not found" });
    }

    if (!semester || !Array.isArray(semester)) {
      return res.status(400).json({ message: "Semester data is required and should be an array" });
    }

    const semesterObjects = [];

    for (const item of semester) {
      const {
        heading,
        subheading,
        submain,
        inner_heading,
        inner_subheading,
        icon,
      } = item;

      if (!heading || !subheading) {
        return res.status(400).json({ message: [{ key: "error", value: "Missing fields in semester data" }] });
      }

      semesterObjects.push({
        heading,
        subheading,
        submain,
        inner_heading,
        inner_subheading,
        icon,
      });
    }
    existingSemester.description = description;

    existingSemester.semester = semesterObjects;
    existingSemester.degree_program = degree_program;

    await existingSemester.save();

    return res.status(200).json({ message: [{ key: "Success", value: "Semester updated successfully" }], Update_semester: existingSemester });
  } catch (error) {
    console.error("Error updating semester by ID:", error);
    return res.status(500).json({ message: [{ key: "error", value: "Internal server error" }] });
  }
};

exports.deleteSemester = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedSemester = await Semester.findByIdAndDelete(id);
    if (!deletedSemester) {
      return res.status(404).json({ message: "Semester not found" });
    }

    return res.status(201).json({ message: [{ key: "Success", value: "Semester Deleted successfully" }]});
  } catch (error) {
    console.error("Error deleting semester by ID:", error);
    return res
      .status(500)
      .json({ message: [{ key: "error", value: "Internal server error" }] });
  }
};
