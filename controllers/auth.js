import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { secred } from '../index.js';

// register user
export const register = async (req, res) => {
   try {
      const { username, password } = req.body;

      const isUsed = await User.findOne({ username });
      if(isUsed) {
         return res.json({ message: 'даний username вже зайнятий.' });
      }

      const salt = bcrypt.genSaltSync(10); //складність хешування
      const hash = bcrypt.hashSync(password, salt);

      const newUser = new User({
         username,
         password: hash,
      });

      const token = jwt.sign(
         {
            id: newUser._id,
         }, 
         secred,
         { expiresIn: '30d' },
      );

      await newUser.save();

      return res.json({
         newUser,
         token,
         message: 'Реєстрація пройшла успішно.'
      })
   } catch (error) {
      res.json({
         message: `Виникла помилка при створенні нового користувача.${error}`
      })
   }
}

// login user
export const login = async (req, res) => {
   try {
      const { username, password } = req.body;

      const user = await User.findOne({ username });
      if(!user) {
         return res.json({ message: 'Такого користувача немає.' });
      }

      const isPasswordCorrect = await bcrypt.compare(password, user.password); // перивіряємо чи співпадає password з хешируваним password користувача
      if(!isPasswordCorrect) {
         return res.json({ message: 'Ви невірно ввели пароль користувача' });
      }

      const token = jwt.sign(
         {
            id: user._id,
            username: user.username
         }, 
         secred,
         { expiresIn: '30d' },
      );

      return res.json({
         token,
         user,
         message: `Вітаємо Вас, ${user.username})`,
      })
      } catch (error) {
      res.json({ message: 'Ви невірно ввели дані при авторизації'});
   }
}

// get me
export const getMe = async (req, res) => {
   try {
      const user = await User.findById(req.userId);
      if(!user) {
         return res.json({ message: 'Такого користувача немає.' });
      }

      const token = jwt.sign(
         {
            id: user._id,
            username: user.username
         }, 
         secred,
         { expiresIn: '30d' },
      );

      return res.json({ 
         user,
         token,
      });
   } catch (error) {
      res.json({ message: 'Немає доступу.' });
   }
}


// update user
export const updateUser = async (req, res) => {
   try {
      const { description } = req.body;
      const user = await User.findById(req.userId);
      if(!user) {
         return res.json({ message: 'Такого користувача немає.' });
      }
      
      user.description = description;
      await user.save();
      res.json({ user, message: 'Ви успішно добавили описання для вашої сторінки.' });
   } catch (error) {
      res.json(`Щось пішло не так. ${error}`);
   }
}