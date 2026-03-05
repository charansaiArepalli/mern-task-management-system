const Project = require("../models/Project");

exports.createProject = async (req, res) => {
  try{
      const { title, description } = req.body;

      const project = await Project.create({
        title,
        description,
        createdBy: req.user._id
      });
    
     res.status(201).json(project);
  }
  catch (error) {

    console.error(error);
    res.status(500).json({ message: "Error fetching projects" });

  }  
};

exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find();
    res.json(projects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching projects" });
  }
};