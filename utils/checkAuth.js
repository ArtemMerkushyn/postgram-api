import jwt from "jsonwebtoken";
import { secred } from '../index.js';

export const checkAuth = (req, res, next) => {
   const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');
   if(token) {
      try {
         const decoded = jwt.verify(token, secred);

         req.userId = decoded.id;

         next();
      } catch (error) {
         return res.json({
            message: 'Немає доступу.'
         });
      }
   } else {
      return res.json({
         message: 'Немає доступу.'
      });
   }
}