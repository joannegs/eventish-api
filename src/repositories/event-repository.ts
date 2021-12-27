import { Event } from '../models/Event';

export const getByUser = async(user_id: any) => {
    return await Event.find({ user: user_id });
};

export const getById = async(id: any) => {
    return await Event.findById(id, 'title date description startsAt endsAt user');
};

export const create = async(data: any, user_id: any) => {
    try {
        let event = new Event();
        event.title = data.title;
        event.initialDate = data.initialDate;
        event.finalDate = data.finalDate;
        event.description = data.description;
        event.startsAt = data.startsAt;
        event.endsAt = data.endsAt;
        event.user = user_id;

        return await event.save();

    } catch (error) {
        throw new Error(error.message)
    }
};

export const put = async(data: any) => {
    return await Event.findByIdAndUpdate(data.event_id, {
        $set: {
            title: data.body.title,
            date: data.body.date,
            description: data.body.description,
            startsAt: data.body.startsAt,
            endsAt: data.body.endsAt,
            user: data.body.user,
        }
    })
};

export const remove = async(id: any) => {
    return await Event.findByIdAndDelete(id);
};

export const removeByUser = async(user_id: any) => {
    const events = await Event.find({ user: user_id });
    events.forEach(async event => {
        await Event.findByIdAndDelete(event._id);
    });
};