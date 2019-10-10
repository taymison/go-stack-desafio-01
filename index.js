const express = require('express');

const server = express();

const projects = [];
let amountOfRequisitions = 0;

server.use(express.json());

function findProjectById(id) {
  return projects.find(project => project.id === id);
}

function findIndexOfProjectInArray(project) {
  return projects.findIndex(projectOfArray => projectOfArray.id === project.id);
}

function checkIfProjectExists(req, res, next) {
  const { id } = req.params;
  const project = findProjectById(id);

  if (!project) {
    return res.status(400).json({ errror: 'The project does not exist' });
  }

  req.project = project;

  return next();
}

server.use((req, res, next) => {
  amountOfRequests += 1;

  console.log(`Amount of requests: ${amountOfRequests}`);

  return next();
});

server.post('/projects', (req, res) => {
  const { id, title } = req.body;
  const project = { id, title, tasks: [] };

  projects.push(project);

  return res.json(projects);
});

server.get('/projects', (req, res) => {
  return res.json(projects);
});

server.put('/projects/:id', checkIfProjectExists, (req, res) => {
  const { project } = req;
  const { id } = req.params;
  const { title } = req.body;
  const projectOfArray = findProjectById(id);
  const index = findIndexOfProjectInArray(project);

  projectOfArray.title = title;

  projects[index] = projectOfArray;

  return res.json(projects);
});

server.delete('/projects/:id', checkIfProjectExists, (req, res) => {
  const { project } = req;
  const index = findIndexOfProjectInArray(project);

  projects.splice(index, 1);

  return res.send();
});

server.post('/projects/:id/tasks', checkIfProjectExists, (req, res) => {
  const { project } = req;
  const { title } = req.body;
  const index = findIndexOfProjectInArray(project);

  projects[index].tasks.push(title);

  return res.json(projects);
});

server.listen(3000);
