import express from 'express';
import { getPackages, getPackageById, createPackage, updatePackage, deletePackage } from '../controllers/packageController.js';

const router = express.Router();

router.get('/', getPackages);
router.post('/', createPackage);
router.get('/:id', getPackageById);
router.patch('/:id', updatePackage);
router.delete('/:id', deletePackage);

export default router;
