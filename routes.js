const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const usersFilePath = path.join(__dirname, './data-users.json');

//GET USER OR USERS
const getUsers = async (req, res, next) => {
  try {
    const data = fs.readFileSync(usersFilePath);
    const dataFile = JSON.parse(data);

    if (req.params.id) {
    	const user = dataFile.find(item => item.id === Number(req.params.id));
	    if (!user) {
	      const err = new Error('User to get not found');
	      err.status = 404;
	      throw err;
	    }
	    res.json(user);
    } else res.json(dataFile);
   
  } catch (e) {
    next(e);
  }
};

//CREATE USER
const createUser = async (req, res, next) => {
  try {
    console.log(req);
    const data = fs.readFileSync(usersFilePath);
    const dataFile = JSON.parse(data);
    const newUser = {
      id: req.body.id,
      name: req.body.name,
      phone: req.body.phone
    };
    dataFile.push(newUser);
    fs.writeFileSync(usersFilePath, JSON.stringify(dataFile));
    res.status(201).json(newUser);
  } catch (e) {
    console.log(e);
    next(e);
  }
};

//UPDATE USER
const updateUser = async (req, res, next) => {
  try {
    const data = fs.readFileSync(usersFilePath);
    const dataFile = JSON.parse(data);

    const user = dataFile.find(item => item.id === Number(req.params.id));
    if (!user) {
      const err = new Error('User to update not found');
      err.status = 404;
      throw err;
    }

    const updateUser = {
    	id: Number(req.params.id),
      name: req.body.name,
      phone: req.body.phone
    };   

    const newData = dataFile.map(item => {
      if (item.id === Number(req.params.id)) {
        return updateUser;
      } else {
        return item;
      }
    });
    fs.writeFileSync(usersFilePath, JSON.stringify(newData));
    res.status(200).json(updateUser);
  } catch (e) {
    next(e);
  }
};


//DELETE USER
const deleteUser = async (req, res, next) => {
  try {
    const data = fs.readFileSync(usersFilePath);
    const stats = JSON.parse(data);
    const user = stats.find(item => item.id === Number(req.params.id));
    console.log(user);
    if (!user) {
      const err = new Error('User to delete not found');
      err.status = 404;
      throw err;
    }
    const deleteUser = stats.map(item => {
      if (item.id === Number(req.params.id)) {
        return null;
      } else {
        return item;
      }
    })
    .filter(item => item !== null);
    fs.writeFileSync(usersFilePath, JSON.stringify(deleteUser));
    res.status(200).json(user);
  } catch (e) {
    next(e);
  }
};

router
  .route('/api/v1/users')
  .get(getUsers);

router
  .route('/api/v1/users')
  .post(createUser);

router
  .route('/api/v1/users/:id')
  .get(getUsers)
  .put(updateUser)
  .delete(deleteUser);

module.exports = router;