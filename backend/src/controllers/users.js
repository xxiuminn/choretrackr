const db = require("../db/db");
const bcrypt = require("bcrypt");

const getUsers = async (req, res) => {
  try {
    const users = await db.query("SELECT * FROM users");
    console.log(users);
    res.json(users.rows);
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ status: "error", msg: "error getting users" });
  }
};

const seedUsers = async (req, res) => {
  try {
    await db.query("DELETE FROM users");
    const hash1 = await bcrypt.hash("jasminepw123", 12);
    const hash2 = await bcrypt.hash("alexpw123", 12);
    const hash3 = await bcrypt.hash("marypw123", 12);
    const users = await db.query(
      "INSERT INTO users(name, email, hash) VALUES($1, $2, $3 ),($4, $5, $6), ($7, $8, $9)",
      [
        "Jasmine",
        "jasmine@gmail.com",
        hash1,
        "Alex",
        "alex@gmail.com",
        hash2,
        "Mary",
        "mary@gmail.com",
        hash3,
      ]
    );
    console.log(users);
    res.json({ status: "ok", msg: "users seeded successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ status: "error", msg: "error seeding users" });
  }
};

const getUserInfo = async (req, res) => {
  try {
    const user = await db.query(
      "SELECT users.uuid, users.name, users.email, users.image_url, users.group_id, user_groups.name AS group_name, user_groups.account_type FROM users INNER JOIN user_groups ON users.group_id = user_groups.id WHERE uuid = $1",
      [req.body.uuid]
    );

    if (!user.rows.length) {
      return res.status(400).json({ status: "error", msg: "user not found" });
    }

    console.log(user.rows);
    res.json(user.rows[0]);
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ status: "error", msg: "error getting user info" });
  }
};

// join user group, quit user group or update any user info
const updateUserInfo = async (req, res) => {
  try {
    const { name, email, hash, image_url, group_id, uuid } = req.body;
    const user = await db.query("SELECT * FROM users WHERE uuid=$1", [uuid]);
    if (!user.rows.length) {
      return res.status(400).json({ status: "error", msg: "user not found" });
    }
    console.log(user);
    const userInfo = user.rows[0];
    console.log(userInfo);

    const updated = {
      name: name === undefined ? userInfo.name : name,
      email: email === undefined ? userInfo.email : email,
      hash: hash === undefined ? userInfo.hash : hash,
      image_url: image_url === undefined ? userInfo.image_url : image_url,
      group_id: group_id === undefined ? userInfo.group_id : group_id,
    };

    await db.query(
      "UPDATE users SET name=$1, email=$2, hash=$3, image_url=$4, group_id=$5 WHERE uuid=$6",
      [
        updated.name,
        updated.email,
        updated.hash,
        updated.image_url,
        updated.group_id,
        uuid,
      ]
    );
    res.json({ status: "ok", msg: "user info updated" });
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ status: "error", msg: "error updating user info" });
  }
};

module.exports = { getUsers, seedUsers, getUserInfo, updateUserInfo };
