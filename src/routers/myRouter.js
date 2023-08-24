require('dotenv').config();
const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const users = require('../data')
const uuid = require('uuid')
// const { MYSQL_USERNAME, MYSQL_PASSWORD, DATABASE_NAME } = process.env;
const { MYSQL_HOST, MYSQL_USERNAME, MYSQL_PASSWORD, DATABASE_NAME } = process.env;
// const users = [{
//     id: 1,
//     name: 'john',
// },
// {
//     id: 2,
//     name: 'bew'
// }]

// const db = mysql.createConnection({ 
//     host: "localhost",
//     user: "root",
//     password: "mysql01",
//     database: "employeessys"
// }
// );
// console.log(MYSQL_USERNAME,MYSQL_PASSWORD,DATABASE_NAME);

const db = mysql.createConnection({
    host: `${MYSQL_HOST}`,
    user: `${MYSQL_USERNAME}`,
    password: `${MYSQL_PASSWORD}`,
    database: `${DATABASE_NAME}`
}
);



// const db = mysql.createConnection({
//     host: "localhost",
//     user: `${MYSQL_USERNAME}`,
//     password: `${MYSQL_PASSWORD}`,
//     database: `${DATABASE_NAME}`
// }
// );


router.get('/employees', (req, res) => {
    db.query("SELECT * FROM employees", (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }
    })

});

router.post('/create', (req, res) => {
    const name = req.body.name;
    const age = req.body.age;
    const country = req.body.country;
    const position = req.body.position;
    const wage = req.body.wage;

    db.query("INSERT INTO employees (name, age, country, position, wage) VALUES(?,?,?,?,?)",
        [name, age, country, position, wage],
        (err, result) => {
            if (err) {
                console.log(err)
            } else {
                res.send("Value insert")
            }
        }
    )
})

router.put('/update', (req, res) => {
    const id = req.body.id;
    const wage = req.body.wage;
    db.query("UPDATE employees SET wage = ? WHERE id = ?", [wage, id], (err, result) => {
        if (err) {
            console.log(err)
        } else {
            res.send(result)
        }
    })
})

router.delete('/delete/:id', (req, res) => {
    const id = req.params.id
    db.query("DELETE FROM employees WHERE id = ?", id, (err, result) => {
        if (err) {
            console.log(err)
        } else {
            res.send(result)
        }
    })
})


//lesson 2

router.get('/api/users', (req, res) => {
    res.json(users)
})

router.get('/api/users/:id', (req, res) => {
    let found = users.some(user => user.id === parseInt(req.params.id))
    if (found) {
        res.json(users.filter(user => user.id === parseInt(req.params.id)))
    } else {
        res.status(400).json({ msg: `User ID: ${req.params.id} not found.` })
    }

})

router.post('/api/users/', (req, res) => {
    console.log(req.body.name)
    const newUser = {
        id: uuid.v4(),
        name: req.body.name,
        email: req.body.email
    }
    if (!newUser.name || !newUser.email) {
        return res.status(400).json({ msg: 'Please include a name and email' })
    }

    users.push(newUser)
    res.json(users)

})



module.exports = router