const { reponse_json } = require("../helpers/reponse");
const User = require("../models/user");
const Todo = require("../models/todo");
const { Op } = require("sequelize");

const List = [
  {
    name: "Choses à faire",
    data: [],
  },
  {
    name: "En Cours",
    data: [],
  },
  {
    name: "Terminé",
    data: [],
  },
];

const categories = [
  {
    name : "Design",
  },
  {
    name : "Frontend",
  },
  {
    name : "Backend",
  }
];

const newTodo = async (req, res) => {
  try {
    const insert = await Todo.create(
      {
        name: req.body.name,
        description: req.body.description,
        user_id : req.user.id,
        users: JSON.stringify([{ id: req.user.id }]),
        content: JSON.stringify(List),
        categories : JSON.stringify(categories),
      },
      { fields: ["name", "user_id", "categories" ,"description", "users", "content"] }
    );

    if (insert) {
      return reponse_json({ req, res }, { code: [2004] });
    }
    return reponse_json({ req, res }, { code: [3001], error: [] }, false, 200);
  } catch (error) {
    return reponse_json(
      { req, res },
      { code: [3001], error: error },
      false,
      500
    );
  }
};

const getTodoData = async (req, res) => {
  try {
    const { count, rows } = await Todo.findAndCountAll({
      where: {
        users: {
          [Op.like]: `%"id": "${req.user.id}"%`,
        },
      },
    });

    if (count) {
      return reponse_json({ req, res }, { data: rows, count });
    }
    return reponse_json({ req, res }, { code: [3001], error: [] }, false, 200);
  } catch (error) {
    return reponse_json(
      { req, res },
      { code: [3001], error: error },
      false,
      500
    );
  }
};

const getTodoDataById = async (req, res) => {
  try {
    if (req.query.id) {
      const data = await Todo.findByPk(req.query.id);
      if (data) {
        return reponse_json({ req, res }, { data });
      }
    }
    return reponse_json({ req, res }, { code: [3001], error: [] }, false, 200);
  } catch (error) {
    return reponse_json(
      { req, res },
      { code: [3001], error: error },
      false,
      500
    );
  }
};

const updateTodo = async (req, res) => {
  try {
    const dataQuery = {};

    if (req.body.name) {
      dataQuery.name = req.body.name;
    }

    if (req.body.description) {
      dataQuery.description = req.body.description;
    }

    if (req.body.content) {
      dataQuery.content = req.body.content;
    }

    if (req.body.categories) {
      dataQuery.categories = req.body.categories;
    }

    if (Object.keys(dataQuery).length) {
      const update = await Todo.update(dataQuery, {
        where: {
          id: req.body.id,
          users: {
            [Op.like]: `%"id": "${req.user.id}"%`,
          },
        },
      });

      if (update) {
        return reponse_json({ req, res }, { code: [2002] });
      }
    }
    return reponse_json({ req, res }, { code: [3012], error: [] }, false, 200);
  } catch (error) {
    return reponse_json(
      { req, res },
      { code: [3012], error: error },
      false,
      500
    );
  }
};

const deleteTodo = async (req, res) => {
  try {
    const destroy = await Todo.destroy({
      where: {
        id: req.body.id,
        user_id: req.user.id,
      },
    });

    if (destroy) {
      return reponse_json({ req, res }, { code: [2002] });
    }
    return reponse_json({ req, res }, { code: [3001], error: [] }, false, 200);
  } catch (error) {
    return reponse_json(
      { req, res },
      { code: [3001], error: error },
      false,
      500
    );
  }
};

const AddUserTodo = async (req, res) => {
  try {
    const user = await User.findOne({ where: { email: req.body.email, [Op.not] : {id :  req.user.id} } });

    if (user) {
      const userId = user.id;
      const todo = await Todo.findByPk(req.body.id);
      
      const dataQuery = {
        users: JSON.stringify([...todo.users.filter((item) => item.id !== userId), { id: userId }]),
      };

      if (todo) {
        const update = await Todo.update(dataQuery, {
          where: {
            id: req.body.id,
            user_id: req.user.id,
          },
        });
        if (update) {
          return reponse_json({ req, res }, { code: [2004] });
        }
      }
    }
    return reponse_json({ req, res }, { code: [3001], error: [] }, false, 200);
  } catch (error) {
    return reponse_json(
      { req, res },
      { code: [3001], error: error },
      false,
      500
    );
  }
};

module.exports = {
  newTodo,
  getTodoData,
  getTodoDataById,
  updateTodo,
  deleteTodo,
  AddUserTodo,
};
