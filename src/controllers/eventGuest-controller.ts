import { NextFunction, Request, Response } from 'express';
import * as eventGuestRepository from '../repositories/eventGuest-repository';
import { getById as getInviteById } from '../repositories/invite-repository';
import { getById as getEventById } from '../repositories/event-repository';
import { decodeToken } from '../services/authService';

export const getByUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization;
        const user_id = (await decodeToken(token)).id;
        let data = await eventGuestRepository.getByUser(user_id);
        res.status(200).send(data);
    } catch (error: any) {
        res.status(400).send({ message: 'The request has failed: ' + error });
    }
};

// só quem pode criar uma relação entre um convidado e um evento é o próprio convidado (aceitando um convite)
export const post = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const invite = await getInviteById(req.body.invite_id);
        const token = req.headers.authorization;
        const user_id = (await decodeToken(token)).id;

        if (invite.user != user_id) {
            res.status(401).send({ message: 'Not authorized' });
        } else {
            await eventGuestRepository.create(req.body.invite_id);
            res.status(201).send({ message: 'Invite successful accepted' });
        }
    } catch (error: any) {
        res.status(400).send({ message: 'The request has failed: ' + error });
    }
};

// quem pode deletar uma relação entre um convidado e um evento é o próprio convidado ou o criador do evento
export const remove = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const eventGuest = await eventGuestRepository.getById(req.query.id);
        const event = await getEventById(eventGuest.event);
        const token = req.headers.authorization;
        const user_id = (await decodeToken(token)).id;

        if (eventGuest.guest == user_id || event.user == user_id) {
            await eventGuestRepository.remove(req.query.id);
            res.status(200).send({ message: 'Invite was successful deleted' })
        } else {
            res.status(401).send({ message: 'Not authorized' });
        }
    } catch (error: any) {
        res.status(400).send({ message: 'An error occured while trying to delete the event: ' + error })
    }
};

