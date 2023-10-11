const express = require('express');
const app = express();

const cors = require('cors');
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json({ limit: '50mb' }));
app.use(cors());

const userController = require('./controller/user.controller');
const projectController = require('./controller/project.controller');
const boardController = require('./controller/board.controller');
const activityController = require('./controller/activity.controller');
const taskController = require('./controller/task.controller');

app.post('/user/create', userController.addUser);

app.post('/user/login', userController.loginUser);

app.post('/user/getUserByToken', userController.getUserByToken);

app.post('/user/view', userController.viewUsers);

app.post('/user/userList', userController.userList);

app.post('/user/userDropByProject', userController.userDropByProject);

app.post('/project/create', projectController.addProject);

app.get('/project/projectTypeDrop', projectController.projectTypeDrop);

app.post('/project/viewProject', projectController.viewProject);

app.post('/project/viewById', projectController.viewById);

app.post('/project/addMembers', projectController.addMembers);

app.post('/project/removeMember', projectController.removeMember);

app.post('/project/editProject', projectController.editProject);

app.post('/board/create', boardController.addBoard);

app.post('/board/viewBoard', boardController.viewBoard);

app.post('/board/viewById', boardController.viewById);

app.post('/board/editBoard', boardController.editBoard);

app.post('/activity/create', activityController.addActivity);

app.post('/activity/viewActivity', activityController.viewActivity);

app.post('/activity/markAsDone', activityController.markAsDone);

app.post(
  '/activity/isAuthorizedToDelete',
  activityController.isAuthorizedToDelete
);

app.post('/activity/deleteActivity', activityController.deleteActivity);

app.post('/activity/editActivity', activityController.editActivity);

app.post('/task/create', taskController.addTask);

app.post('/task/viewTask', taskController.viewTask);

app.post('/task/editTask', taskController.editTask);

app.post('/task/deleteTask', taskController.deleteTask);

app.post('/task/markAsDone', taskController.markAsDone);

app.post('/task/manageVisibility', taskController.manageVisibility);

app.post('/task/addedMembers', taskController.addedMembers);

app.post('/task/addTaskPriority', taskController.addTaskPriority);

app.get('/task/priorityList', taskController.priorityList);

app.listen(8000, () => {
  console.log('Server started on port 8000');
});
