import { EventGuest } from '../models/EventGuest';
import { getById as getInviteById} from './invite-repository';
import { remove as deleteInvite} from './invite-repository';

export const getByUser = async(user_id: any) => {
    return await EventGuest.find({ guest: user_id });
};

export const getById = async(id: any) => {
    return await EventGuest.findById(id, 'event guest');
};

export const getByGuestAndEvent = async (guest_id: any, event_id: any) => {
    return await EventGuest.find({ guest: guest_id, event: event_id });
}

export const getByEvent = async (event_id: any) => {
    return await EventGuest.find({ event: event_id });
}

export const create = async(invite_id: any) => {
    try {
        const invite = await getInviteById(invite_id);
        
        if (invite == null) throw new Error("The invite for this event does not exist");

        let eventGuest = new EventGuest();
        eventGuest.event = invite.event;
        eventGuest.guest = invite.user;

        await deleteInvite(invite_id);
        return await eventGuest.save();
 
    } catch (error) {
        throw new Error(error.message)
    }
};

export const remove = async(id: any) => {
    return await EventGuest.findByIdAndRemove(id);
};

export const removeByUser = async (user_id: any) => {
    const eventGuests = await EventGuest.find({ user: user_id });
    eventGuests.forEach(async eventGuest => {
        await EventGuest.findByIdAndRemove(eventGuest._id);
    })
};