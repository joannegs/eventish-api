import { NextFunction, Request, Response } from 'express';
import * as inviteRepository from '../repositories/invite-repository';
import { decodeToken } from '../services/authService';
import * as eventRepository from '../repositories/event-repository';

export const getByUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization;
        const user_id = (await decodeToken(token)).id;
        let invite = await inviteRepository.getByUser(user_id);

        res.status(200).send(invite);
    } catch (error) {
        res.status(400).send({ message: 'The request has failed' });
    }
};

export const post = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await inviteRepository.create(req.body);
        res.status(201).send({ message: 'Invite successful saved' });
    } catch (error: any) {
        res.status(400).send({ message: 'The request has failed: ' + error.message });
    }
};

// só quem pode alterar um convite é seu criador
export const patch = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let invite = await inviteRepository.getById(req.query.id);
        let event = await eventRepository.getById(invite.event);
        const token = req.headers.authorization;
        const user_id = (await decodeToken(token)).id;

        if (event.user != user_id) {
            res.status(401).send({ message: 'Not authorized' });
        } else {
            await inviteRepository.patch({ params: req.params, body: req.body });
            res.status(200).send({ message: 'Invite was successful updated' })
        }
    } catch (error) {
        res.send(400).send({
            message: 'An error occured while trying to update the event',
            data: error
        })
    }
};

// quem pode deletar um convite é o convidado (rejeitando ou aceitando)
export const remove = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let invite = await inviteRepository.getById(req.query.id);
        const token = req.headers.authorization;
        const user_id = (await decodeToken(token)).id;

        if (invite.user != user_id) {
            res.status(401).send({ message: 'Not authorized' });
        } else {
            inviteRepository.remove(req.query.id)
            res.status(200).send({ message: 'Invite was successful deleted' })
        }
    } catch (error) {
        res.status(400).send({ message: 'An error occured while trying to delete the event', data: error })
    }
};

