import express from 'express';
const router = express.Router();
import { createPackage, getPackages, updatePackage, deletePackage } from '../controllers/packageController';

router.post('/', createPackage);
router.get('/', getPackages);
router.put('/:id', updatePackage);
router.delete('/:id', deletePackage);

export default router;