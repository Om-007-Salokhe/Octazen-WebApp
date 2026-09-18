// Video Routes
import { Router } from 'express';
import { videoController } from './video.controller.js';
import { adminAuth } from '../../middleware/adminAuth.js';
import { validate } from '../../middleware/validate.js';
import { createVideoSchema } from './video.schema.js';

const router = Router();

router.get('/', videoController.getAll);
router.get('/bunny-list', videoController.listBunny);
router.get('/:id/stream', videoController.getStream);
router.get('/status/:videoId', videoController.getStatus);
router.get('/course/:courseId', videoController.getByCourse);

// Protected Admin Routes
router.post('/init-upload', adminAuth, videoController.initUpload);
router.post('/upload-stream/:videoId', adminAuth, videoController.uploadStream);
router.post('/', adminAuth, videoController.create);
router.delete('/:id', adminAuth, videoController.remove);

export default router;
