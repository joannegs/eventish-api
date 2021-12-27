import { Invite } from '../models/Invite';
import { getByGuestAndEvent as getEventGuestByGuestAndEvent } from '../repositories/eventGuest-repository';


export const getByUser = async (user_id: any) => {
    return await Invite.find({ user: user_id }, 'event user message');
};

export const getById = async (id: any) => {
    return await Invite.findById(id, 'event user message');
};


export const getByUserAndEvent = async (user_id: any, event_id: any) => {
    return await Invite.find({ user: user_id, event: event_id });
}

export const getByEvent = async (event_id: any) => {
    return await Invite.find({ event: event_id });
}

export const create = async (data: any) => {
    try {
        // verifica se já existe um convite ou se ele já foi aceito
        const existentInvite = await getByUserAndEvent(data.user, data.event);
        const existentEventGuest = await getEventGuestByGuestAndEvent(data.user, data.event);

        if (existentInvite.length != 0 || existentEventGuest.length != 0) throw new Error("The invite is already made");

        let invite = new Invite();
        invite.event = data.event;
        invite.user = data.user;
        invite.message = data.message;

        return await invite.save();

    } catch (error) {
        throw new Error(error.message)
    }
};

export const patch = async (data: any) => {
    return await Invite.findOneAndUpdate(data.params.id, {
        $set: {
            message: data.message
        }
    })
};

export const remove = async (id: any) => {
    return await Invite.findByIdAndRemove(id);
};

export const removeByUser = async (user_id: any) => {
    const invites = await Invite.find({ user: user_id });
    invites.forEach(async invite => {
        await Invite.findByIdAndRemove(invite._id);
    })
};