import { NextFunction, Request, Response } from 'express';
import * as eventRepository from '../repositories/event-repository';
import { decodeToken } from '../services/authService';
import { getByEvent as getInviteByEvent, remove as removeInvite } from '../repositories/invite-repository';
import { getByEvent as getEventGuestByEvent, remove as removeEventGuest } from '../repositories/eventGuest-repository';



export const getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let event = await eventRepository.getById(req.params.id);
        res.status(200).send(event);
    } catch (error: any) {
        res.status(400).send({ message: 'The request has failed: ' + error });
    }
};

export const getByUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization;
        const user_id = (await decodeToken(token)).id;
        let events = await eventRepository.getByUser(user_id);
        res.status(200).send(events);
    } catch (error: any) {
        res.status(400).send({ message: 'The request has failed: ' + error });
    }
};

export const post = async (req: any, res: any, next: any) => {
    try {
        const token = req.headers.authorization;
        const user_id = (await decodeToken(token)).id;
        await eventRepository.create(req.body, user_id);
        res.status(201).send({ message: 'Event successful saved' });
    } catch (error: any) {
        res.status(400).send({ message: 'The request has failed: ' + error });
    }
};

export const put = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await eventRepository.put({ event_id: req.query.id, body: req.body });
        res.status(200).send({ message: 'Event was successful updated' })
    } catch (error: any) {
        res.status(400).send({ message: 'An error occured while trying to delete the event: ', data: error.message })
    }
};

/* o mongo não aceita remoção em cascata, então fiz manualmente a exclusão 
de todos os registros de um evento quando ele é removido */
export const remove = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // apaga todos os invites relacionados ao evento em questão
        const invites = await getInviteByEvent(req.query.id);
        invites.forEach(invite => {
            removeInvite(invite.id)
        })

        // apaga todas as ligações entre convidados com o evento
        const eventGuests = await getEventGuestByEvent(req.query.id);
        eventGuests.forEach(eventGuest => {
            removeEventGuest(eventGuest.id)
        })

        await eventRepository.remove(req.query.id);
        res.status(200).send({ message: 'Event was successful deleted' })
    } catch (error: any) {
        res.status(400).send({ message: 'An error occured while trying to delete the event: ', data: error.message })
    }
};

