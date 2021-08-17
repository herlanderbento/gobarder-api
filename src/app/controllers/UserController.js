import User from "../models/User";
import * as Yup from "yup";

class UserController {
  async store(req, res) {
    // validação de formulário
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().email().required(),
      password: Yup.string().required().min(6),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: "Validation fails" });
    }

    // verificação de email.
    const userExist = await User.findOne({ where: { email: req.body.email } });

    if (userExist) {
      return res.status(400).json({ error: "User already exists." });
    }

    const { id, name, email, provider } = await User.create(req.body);

    return res.json({
      id,
      name,
      email,
      provider,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      oldPassord: Yup.string().min(6),
      password: Yup.string()
        .min(6)
        .when('oldPassword', (oldPassord, field) =>
          oldPassord ? field.required() : field
        ),
      confirmPassword: Yup.string().when('password', (password, field) => {
        password ? field.required().oneOf([Yup.ref('password')]) : field
      })
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: "Validation fails" });
    }

    // dados do body
    const { email, oldPassord } = req.body;

    // Pegando o id
    const user = await User.findByPk(req.userId);

    // verificação de email
    if (email !== user.email) {
      const userExist = await User.findOne({ where: { email } });

      if (userExist) {
        return res.status(400).json({ error: "User already exists." });
      }
    }

    if (oldPassord && !(await user.checkPassword(oldPassord))) {
      return res.status(400).json({ error: "Password does not match" });
    }

    const { id, name, provider } = await user.update(req.body);

    return res.json({
      id,
      name,
      email,
      provider,
    });
  }
}

export default new UserController();
