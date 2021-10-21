const router = require('express').Router();

const {
  getUsers, getUserById, updateProfile, updateAvatar, getCurrentUserInfo,
} = require('../controllers/users');
const { userInfoValidation, userAvatarValidation, userIdValidation } = require('../middlewares/validation');

router.get('/users', getUsers);
router.get('/users/me', getCurrentUserInfo);
router.get('/users/:userId', userIdValidation, getUserById);
router.patch('/users/me', userInfoValidation, updateProfile);
router.patch('/users/me/avatar', userAvatarValidation, updateAvatar);

module.exports = router;
