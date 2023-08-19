import express from 'express';
import npmView from '../control/index';

const router = express.Router()
router.get('/npmAnalyze', npmView)

export default router