import express from 'express';
export const router = express.Router();

router.get('/', (req, res) => {
    res.status(200).send({ message: "eventish API "})
});
