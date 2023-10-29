import { Router } from "express";
import { getMe, login, register, updateUser } from "../controllers/auth.js";
import { checkAuth } from "../utils/checkAuth.js";

const router = new Router();

// register http://localhost:3002/api/auth/register
router.post('/register', register);

// login http://localhost:3002/api/auth/login
router.post('/login', login);

//get me http://localhost:3002/api/auth/me
router.get('/me', checkAuth, getMe);

//update user http://localhost:3002/api/auth/:id
router.put('/:id', checkAuth, updateUser);

export default router;