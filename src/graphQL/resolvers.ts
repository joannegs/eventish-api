import * as userRepository from '../repositories/user-repository';
import { removeByUser as deleteEventsByUser } from '../repositories/event-repository';
import { removeByUser as deleteEventGuestsByUser } from '../repositories/eventGuest-repository';
import { removeByUser as deleteInvitesByUser } from '../repositories/event-repository';
import { createToken, cryptPassword, descryptPassword } from '../services/authService';

export const resolvers = {
    Query: {
        user: async(_: any, args: any, { auth }: any) => {
            if (!auth) throw new Error("Authentication required");
            const user =  await userRepository.getById(args.id);
            if(user == null) throw new Error('User does not exists');

            return user;
        },
        
        userByEmail: async(_: any, args: any, { auth }: any) => {
            if (!auth) throw new Error("Authentication required");
            const user =  await userRepository.getByEmail(args.email);
            if(user == null) throw new Error('User does not exists');

            return user;
        }
    },

    Mutation: {
        createUser: async (_: any, { data }: any) => {
            try {
                const existentUser = await userRepository.getByEmail(data.email);
                
                if (existentUser != null) {
                    throw new Error("User already signed up");
                } else {
                    const user = await userRepository.create({
                        name: data.name,
                        email: data.email,
                        password: (await cryptPassword(data.password)).cryptResponse
                    });

                    const token = createToken({ id: user._id, email: data.email });

                    return { token: token, id: user._id };
                }
            } catch (error: any) {
                throw new Error(error.message);
            }
        }, 

        updateUser: async (_: any, args: any, { auth }: any) => { 
            if (!auth) throw new Error("Authentication required");
            args.data.password = (await cryptPassword(args.data.password)).cryptResponse;

            await userRepository.put(auth.id, args.data);
            return await userRepository.getById(auth.id);
        },

        deleteUser: async(_: any, args: any, { auth }: any) => {
            if (!auth) throw new Error("Authentication required");
            
            // cascade remove
            deleteEventsByUser(auth.id);
            deleteInvitesByUser(auth.id);
            deleteEventGuestsByUser(auth.id);
            
            return !!userRepository.remove(auth.id);
        },

        login: async (_: any, { email, password }: any) => { 
            try{
                const user = await userRepository.getByEmail(email);

                if(user == null) throw new Error('User does not exists');

                const validPassword =  await descryptPassword(password, user.password);

                if(!validPassword) throw new Error('Incorrect password');

                const token = createToken({ id: user._id, email: email });
                return { token: token, id: user._id }
            } catch(error){
                throw new Error(error.message);
            }
        }
    }
}
